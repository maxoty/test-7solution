import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fetchAllUsers,
  fetchUsers,
  getDepartmentData,
  groupUsersByDepartment,
} from "./users-service";
import {
  USERS_API_URL,
  type User,
  type UsersPage,
} from "./users-data";

afterEach(() => {
  vi.unstubAllGlobals();
});

function makeUser(overrides: Partial<User>): User {
  const defaultUser: User = {
    id: 1,
    firstName: "Terry",
    lastName: "Medhurst",
    maidenName: "",
    age: 50,
    gender: "male",
    email: "terry@example.test",
    phone: "555-0101",
    username: "terry",
    birthDate: "1976-01-01",
    image: "https://example.test/terry.png",
    bloodGroup: "O+",
    height: 170,
    weight: 70,
    eyeColor: "Brown",
    hair: { color: "Brown", type: "Straight" },
    address: {
      address: "1 Main Street",
      city: "Fairbanks",
      state: "Alaska",
      stateCode: "AK",
      postalCode: "99501",
      country: "United States",
    },
    university: "Alaska University",
    company: {
      department: "Engineering",
      name: "Acme",
      title: "Engineer",
    },
    role: "user",
  };

  return {
    ...defaultUser,
    ...overrides,
    hair: { ...defaultUser.hair, ...overrides.hair },
    address: { ...defaultUser.address, ...overrides.address },
    company: { ...defaultUser.company, ...overrides.company },
  };
}

const users: User[] = [
  makeUser({ id: 1 }),
  makeUser({
    id: 2,
    firstName: "Sheldon",
    lastName: "Quigley",
    age: 28,
    address: { ...makeUser({}).address, postalCode: "89765" },
  }),
  makeUser({
    id: 3,
    firstName: "Jenna",
    lastName: "Burks",
    age: 25,
    gender: "female",
    hair: { color: "Black", type: "Curly" },
    address: { ...makeUser({}).address, postalCode: "99060" },
    company: {
      department: "Marketing",
      name: "Acme",
      title: "Marketer",
    },
  }),
];

describe("groupUsersByDepartment", () => {
  it("summarizes gender, age range, hair, and postal codes per department", () => {
    expect(groupUsersByDepartment(users)).toEqual({
      Engineering: {
        male: 2,
        female: 0,
        ageRange: "28-50",
        hair: { Brown: 2 },
        addressUser: {
          TerryMedhurst: "99501",
          SheldonQuigley: "89765",
        },
      },
      Marketing: {
        male: 0,
        female: 1,
        ageRange: "25-25",
        hair: { Black: 1 },
        addressUser: { JennaBurks: "99060" },
      },
    });
  });

  it("returns an empty result when there are no users", () => {
    expect(groupUsersByDepartment([])).toEqual({});
  });

  it("groups full user cards and overviews by department", () => {
    const grouped = getDepartmentData(users);

    expect(grouped.Engineering.summary.male).toBe(2);
    expect(grouped.Engineering.users).toEqual(users.slice(0, 2));
    expect(grouped.Marketing.users).toEqual([users[2]]);
  });

  it("fetches and validates a page of users from the API", async () => {
    const responseData: UsersPage = {
      users,
      total: users.length,
      skip: 0,
      limit: 30,
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(responseData), { status: 200 }),
      ),
    );

    await expect(fetchUsers({ limit: 30, skip: 0 })).resolves.toEqual(
      responseData,
    );
    expect(fetch).toHaveBeenCalledWith(
      `${USERS_API_URL}?limit=30&skip=0`,
      { signal: undefined },
    );
  });

  it("throws a clear error for failed API responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 503 })),
    );

    await expect(fetchUsers({ limit: 30, skip: 0 })).rejects.toThrow(
      "Failed to load users (503)",
    );
  });

  it("rejects malformed API data", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            users: [{ firstName: "Incomplete" }],
            total: 1,
            skip: 0,
            limit: 30,
          }),
          { status: 200 },
        ),
      ),
    );

    await expect(fetchUsers({ limit: 30, skip: 0 })).rejects.toThrow(
      "The users API returned an invalid response",
    );
  });

  it("loads every page before returning the complete user list", async () => {
    const allUsers = Array.from({ length: 31 }, (_, index) => ({
      ...users[index % users.length],
      id: index + 1,
      firstName: `User${index + 1}`,
    }));

    vi.stubGlobal(
      "fetch",
      vi.fn((input: string | URL) => {
        const url = new URL(String(input));
        const skip = Number(url.searchParams.get("skip"));
        const pageUsers = allUsers.slice(skip, skip + 30);

        return Promise.resolve(
          new Response(
            JSON.stringify({
              users: pageUsers,
              total: allUsers.length,
              skip,
              limit: 30,
            }),
            { status: 200 },
          ),
        );
      }),
    );

    await expect(fetchAllUsers()).resolves.toEqual(allUsers);
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
