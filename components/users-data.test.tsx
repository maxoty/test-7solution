import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { DepartmentData, User } from "@/services/users-data";
import UsersData, { type UserDetailsTab } from "./users-data";

afterEach(cleanup);

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

const engineeringUsers: DepartmentData["users"] = [
  makeUser({ id: 1 }),
  makeUser({
    id: 2,
    firstName: "Sheldon",
    lastName: "Quigley",
    age: 28,
    email: "sheldon@example.test",
    phone: "555-0102",
    username: "sheldon",
    address: {
      ...makeUser({}).address,
      address: "2 Oak Street",
      postalCode: "89765",
    },
    university: "Fairbanks Institute",
    company: {
      department: "Engineering",
      name: "Globex",
      title: "Senior Engineer",
    },
  }),
];

const departments: Record<string, DepartmentData> = {
  Engineering: {
    users: engineeringUsers,
    summary: {
      male: 2,
      female: 0,
      ageRange: "28-50",
      hair: { Brown: 2 },
      addressUser: {
        TerryMedhurst: "99501",
        SheldonQuigley: "89765",
      },
    },
  },
  Marketing: {
    users: [
      makeUser({
        id: 3,
        firstName: "Jenna",
        lastName: "Burks",
        age: 25,
        gender: "female",
        hair: { color: "Black", type: "Curly" },
        company: {
          department: "Marketing",
          name: "Acme",
          title: "Marketer",
        },
      }),
    ],
    summary: {
      male: 0,
      female: 1,
      ageRange: "25-25",
      hair: { Black: 1 },
      addressUser: { JennaBurks: "99501" },
    },
  },
};

function renderUsers(
  overrides: Partial<Parameters<typeof UsersData>[0]> = {},
) {
  const onSelectDepartment = vi.fn();
  const onSelectUserDetailsTab = vi.fn();
  const onRetry = vi.fn();
  const onLoadMore = vi.fn();

  render(
    <UsersData
      activeDepartment="Engineering"
      departments={departments}
      hasData
      hasMoreUsers={false}
      isLoading={false}
      isRetrying={false}
      loadMoreSentinelRef={() => {}}
      onLoadMore={onLoadMore}
      onRetry={onRetry}
      onSelectDepartment={onSelectDepartment}
      onSelectUserDetailsTab={onSelectUserDetailsTab}
      selectedUserTabs={{}}
      visibleUsers={engineeringUsers}
      {...overrides}
    />,
  );

  return {
    onSelectDepartment,
    onSelectUserDetailsTab,
    onRetry,
    onLoadMore,
  };
}

describe("UsersData", () => {
  it("shows loading state before the complete response is ready", () => {
    renderUsers({ hasData: false, isLoading: true });

    expect(screen.getByText("Loading all users…")).toBeDefined();
  });

  it("allows retry when the initial request fails", () => {
    const { onRetry } = renderUsers({
      departments: {},
      error: "Network unavailable",
      hasData: false,
    });

    expect(screen.getByRole("alert").textContent).toContain(
      "Network unavailable",
    );
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("keeps cached department summaries visible when refresh fails", () => {
    renderUsers({ error: "Network unavailable" });

    expect(screen.getByRole("tab", { name: /Engineering/ })).toBeDefined();
    expect(screen.getByRole("heading", { name: "Engineering" })).toBeDefined();
    expect(screen.getByRole("alert").textContent).toContain(
      "Could not refresh users",
    );
  });

  it("uses a full-width sticky department tab bar", () => {
    renderUsers();

    const tabList = screen.getByRole("tablist", { name: "Departments" });
    expect(tabList.className).toContain("sticky");
    expect(tabList.className).toContain("w-[calc(100%+2.5rem)]");
    expect(
      screen.getByRole("tab", { name: /Engineering/ }).className,
    ).toContain("whitespace-nowrap");
    const engineeringTab = screen.getByRole("tab", { name: /Engineering/ });
    expect(engineeringTab.className).toContain("w-max");
    expect(engineeringTab.className).not.toContain("flex-1");
    expect(
      screen.getByText(
        (_, element) =>
          element?.tagName === "P" && element.textContent?.trim() === "2 users",
      ),
    ).toBeDefined();
    expect(screen.getByRole("heading", { name: "Engineering" })).toBeDefined();
  });

  it("notifies the page when a different department tab is selected", () => {
    const { onSelectDepartment } = renderUsers();

    fireEvent.click(screen.getByRole("tab", { name: /Marketing/ }));

    expect(onSelectDepartment).toHaveBeenCalledWith("Marketing");
  });

  it("shows a load-more action for users in the selected department", () => {
    const { onLoadMore } = renderUsers({
      hasMoreUsers: true,
      visibleUsers: engineeringUsers.slice(0, 1),
    });

    expect(screen.getByText("Showing 1 of 2")).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: "Load more users" }));
    expect(onLoadMore).toHaveBeenCalledOnce();
  });

  it("shows three detail tabs and two-column detail rows in each user card", () => {
    renderUsers();

    const userCard = within(screen.getAllByRole("article")[0]);
    expect(
      userCard
        .getAllByRole("tab")
        .map((tab) => tab.textContent?.trim()),
    ).toEqual([
      "Personal details",
      "Contact details",
      "Education and employment",
    ]);
    expect(userCard.getByText("50")).toBeDefined();
    expect(userCard.getByText("1976-01-01")).toBeDefined();
    expect(
      userCard.getByRole("tabpanel").querySelector("dl")?.className,
    ).toContain("grid-cols-2");
    expect(
      userCard
        .getAllByLabelText("Hair color: Brown")[0]
        .getAttribute("style"),
    ).toContain("background-color");
  });

  it("switches user detail tabs using the page-controlled selection", () => {
    const selectedUserTabs: Partial<Record<number, UserDetailsTab>> = {
      1: "contact",
    };
    const { onSelectUserDetailsTab } = renderUsers({ selectedUserTabs });
    const userCard = within(screen.getAllByRole("article")[0]);

    expect(userCard.getByText("terry@example.test")).toBeDefined();
    fireEvent.click(userCard.getByRole("tab", { name: "Education and employment" }));
    expect(onSelectUserDetailsTab).toHaveBeenCalledWith(1, "employment");
  });
});
