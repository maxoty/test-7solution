import {
  USERS_API_URL,
  USERS_PAGE_SIZE,
  type DepartmentData,
  type DepartmentSummary,
  type User,
  type UsersPage,
} from "./users-data";

export type {
  DepartmentData,
  DepartmentSummary,
  User,
  UsersPage,
} from "./users-data";

type DepartmentAccumulator = {
  users: User[];
  male: number;
  female: number;
  minAge: number;
  maxAge: number;
  hair: Map<string, number>;
  addressUser: Map<string, string>;
};

export function groupUsersByDepartment(
  users: User[],
): Record<string, DepartmentSummary> {
  return Object.fromEntries(
    Object.entries(getDepartmentData(users)).map(([name, department]) => [
      name,
      department.summary,
    ]),
  );
}

export function getDepartmentData(
  users: User[],
): Record<string, DepartmentData> {
  const departments = new Map<string, DepartmentAccumulator>();

  for (const user of users) {
    let department = departments.get(user.company.department);

    if (!department) {
      department = {
        users: [],
        male: 0,
        female: 0,
        minAge: user.age,
        maxAge: user.age,
        hair: new Map(),
        addressUser: new Map(),
      };
      departments.set(user.company.department, department);
    }

    department.users.push(user);

    if (user.gender === "male") {
      department.male += 1;
    } else {
      department.female += 1;
    }

    department.minAge = Math.min(department.minAge, user.age);
    department.maxAge = Math.max(department.maxAge, user.age);
    department.hair.set(
      user.hair.color,
      (department.hair.get(user.hair.color) ?? 0) + 1,
    );
    department.addressUser.set(
      `${user.firstName}${user.lastName}`,
      user.address.postalCode,
    );
  }

  return Object.fromEntries(
    Array.from(departments, ([name, department]) => [
      name,
      {
        users: department.users,
        summary: {
          male: department.male,
          female: department.female,
          ageRange: `${department.minAge}-${department.maxAge}`,
          hair: Object.fromEntries(department.hair),
          addressUser: Object.fromEntries(department.addressUser),
        },
      },
    ]),
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isUser(value: unknown): value is User {
  if (!isRecord(value)) {
    return false;
  }

  const user = value;
  const hair = user.hair;
  const address = user.address;
  const company = user.company;

  return (
    Number.isInteger(user.id) &&
    typeof user.firstName === "string" &&
    typeof user.lastName === "string" &&
    typeof user.maidenName === "string" &&
    typeof user.age === "number" &&
    Number.isFinite(user.age) &&
    (user.gender === "male" || user.gender === "female") &&
    typeof user.email === "string" &&
    typeof user.phone === "string" &&
    typeof user.username === "string" &&
    typeof user.birthDate === "string" &&
    typeof user.image === "string" &&
    typeof user.bloodGroup === "string" &&
    typeof user.height === "number" &&
    Number.isFinite(user.height) &&
    typeof user.weight === "number" &&
    Number.isFinite(user.weight) &&
    typeof user.eyeColor === "string" &&
    isRecord(hair) &&
    typeof hair.color === "string" &&
    typeof hair.type === "string" &&
    isRecord(address) &&
    typeof address.address === "string" &&
    typeof address.city === "string" &&
    typeof address.state === "string" &&
    typeof address.stateCode === "string" &&
    typeof address.postalCode === "string" &&
    typeof address.country === "string" &&
    typeof user.university === "string" &&
    isRecord(company) &&
    typeof company.department === "string" &&
    typeof company.name === "string" &&
    typeof company.title === "string" &&
    typeof user.role === "string"
  );
}

export async function fetchUsers({
  limit,
  skip,
  signal,
}: {
  limit: number;
  skip: number;
  signal?: AbortSignal;
}): Promise<UsersPage> {
  const url = new URL(USERS_API_URL);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("skip", String(skip));

  const response = await fetch(url.toString(), { signal });

  if (!response.ok) {
    throw new Error(`Failed to load users (${response.status})`);
  }

  const data: unknown = await response.json();
  const payload = isRecord(data) ? data : undefined;
  const users = payload?.users;
  const total = payload?.total;
  const responseSkip = payload?.skip;
  const responseLimit = payload?.limit;

  if (
    !Array.isArray(users) ||
    !users.every(isUser) ||
    typeof total !== "number" ||
    !Number.isInteger(total) ||
    total < 0 ||
    typeof responseSkip !== "number" ||
    !Number.isInteger(responseSkip) ||
    responseSkip < 0 ||
    typeof responseLimit !== "number" ||
    !Number.isInteger(responseLimit) ||
    responseLimit <= 0
  ) {
    throw new Error("The users API returned an invalid response");
  }

  return {
    users,
    total,
    skip: responseSkip,
    limit: responseLimit,
  };
}

export async function fetchAllUsers(signal?: AbortSignal): Promise<User[]> {
  const firstPage = await fetchUsers({
    limit: USERS_PAGE_SIZE,
    skip: 0,
    signal,
  });

  const pageCount = Math.ceil(firstPage.total / USERS_PAGE_SIZE);
  const remainingPages = await Promise.all(
    Array.from({ length: Math.max(0, pageCount - 1) }, (_, index) =>
      fetchUsers({
        limit: USERS_PAGE_SIZE,
        skip: (index + 1) * USERS_PAGE_SIZE,
        signal,
      }),
    ),
  );
  const users = [firstPage, ...remainingPages].flatMap((page) => page.users);

  if (users.length !== firstPage.total) {
    throw new Error("The users API returned an incomplete paginated response");
  }

  return users;
}
