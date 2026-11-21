import type { KeyboardEvent, ReactNode, RefCallback } from "react";
import type { DepartmentData, User } from "@/services/users-data";
import UserAvatar from "./user-avatar";

export type UserDetailsTab = "personal" | "contact" | "employment";

type UsersDataProps = {
  departments: Record<string, DepartmentData>;
  activeDepartment: string | null;
  visibleUsers: User[];
  selectedUserTabs: Partial<Record<number, UserDetailsTab>>;
  hasData: boolean;
  isLoading: boolean;
  error?: string;
  isRetrying: boolean;
  hasMoreUsers: boolean;
  loadMoreSentinelRef: RefCallback<HTMLDivElement>;
  onSelectDepartment: (department: string) => void;
  onSelectUserDetailsTab: (userId: number, tab: UserDetailsTab) => void;
  onRetry: () => void;
  onLoadMore: () => void;
};

const userDetailsTabs: { id: UserDetailsTab; label: string }[] = [
  { id: "personal", label: "Personal details" },
  { id: "contact", label: "Contact details" },
  { id: "employment", label: "Education and employment" },
];

const hairColorStyles: Record<
  string,
  { backgroundColor: string; color: string }
> = {
  auburn: { backgroundColor: "#7c2d12", color: "#ffffff" },
  black: { backgroundColor: "#18181b", color: "#ffffff" },
  blond: { backgroundColor: "#f5d76e", color: "#422006" },
  blonde: { backgroundColor: "#f5d76e", color: "#422006" },
  blue: { backgroundColor: "#2563eb", color: "#ffffff" },
  brown: { backgroundColor: "#854d0e", color: "#ffffff" },
  gray: { backgroundColor: "#9ca3af", color: "#111827" },
  green: { backgroundColor: "#15803d", color: "#ffffff" },
  purple: { backgroundColor: "#7e22ce", color: "#ffffff" },
  red: { backgroundColor: "#dc2626", color: "#ffffff" },
  white: {
    backgroundColor: "#ffffff",
    color: "#18181b",
  },
};

function HairColorBadge({ color, count }: { color: string; count?: number }) {
  const style = hairColorStyles[color.toLowerCase()] ?? {
    backgroundColor: "#71717a",
    color: "#ffffff",
  };

  return (
    <span
      aria-label={count === undefined ? `Hair color: ${color}` : undefined}
      className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-2.5 py-1 text-xs font-medium dark:border-white/20"
      style={style}
    >
      <span>{color}</span>
      {count !== undefined && <span aria-hidden="true">· {count}</span>}
    </span>
  );
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm text-zinc-900 dark:text-zinc-100">
        {children}
      </dd>
    </div>
  );
}

function UserDetails({
  user,
  selectedTab,
  onSelectTab,
}: {
  user: User;
  selectedTab: UserDetailsTab;
  onSelectTab: (tab: UserDetailsTab) => void;
}) {
  const activeTabIndex = userDetailsTabs.findIndex(
    (tab) => tab.id === selectedTab,
  );
  const panelId = `user-details-panel-${user.id}`;

  function handleTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let nextIndex: number;

    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % userDetailsTabs.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex =
        (index - 1 + userDetailsTabs.length) % userDetailsTabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = userDetailsTabs.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const nextTab = userDetailsTabs[nextIndex];
    onSelectTab(nextTab.id);
    event.currentTarget.parentElement
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      [nextIndex]?.focus();
  }

  return (
    <div className="mt-4">
      <div
        aria-label={`${user.firstName} ${user.lastName} information`}
        className="grid grid-cols-3 border-b border-black/[.08] dark:border-white/[.145]"
        role="tablist"
      >
        {userDetailsTabs.map((tab, index) => {
          const isActive = index === activeTabIndex;

          return (
            <button
              aria-controls={panelId}
              aria-selected={isActive}
              className={`min-w-0 border-b-2 px-2 py-3 text-xs font-medium leading-tight transition-colors sm:text-sm ${
                isActive
                  ? "border-foreground text-zinc-950 dark:text-zinc-50"
                  : "border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
              id={`user-details-tab-${user.id}-${tab.id}`}
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              role="tab"
              tabIndex={isActive ? 0 : -1}
              type="button"
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        aria-labelledby={`user-details-tab-${user.id}-${selectedTab}`}
        className="pt-4"
        id={panelId}
        role="tabpanel"
        tabIndex={0}
      >
        <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
          {selectedTab === "personal" && (
            <>
              <Detail label="Age">{user.age}</Detail>
              <Detail label="Gender">
                <span className="capitalize">{user.gender}</span>
              </Detail>
              <Detail label="Birth date">{user.birthDate}</Detail>
              <Detail label="Blood group">{user.bloodGroup}</Detail>
              <Detail label="Height">{user.height} cm</Detail>
              <Detail label="Weight">{user.weight} kg</Detail>
              <Detail label="Eye color">{user.eyeColor}</Detail>
              <Detail label="Hair">
                <span className="flex flex-wrap items-center gap-2">
                  <HairColorBadge color={user.hair.color} />
                  {user.hair.type}
                </span>
              </Detail>
            </>
          )}

          {selectedTab === "contact" && (
            <>
              <Detail label="Email">
                <a
                  className="underline decoration-zinc-400 underline-offset-2"
                  href={`mailto:${user.email}`}
                >
                  {user.email}
                </a>
              </Detail>
              <Detail label="Phone">
                <a
                  className="underline decoration-zinc-400 underline-offset-2"
                  href={`tel:${user.phone}`}
                >
                  {user.phone}
                </a>
              </Detail>
              <Detail label="Address">{user.address.address}</Detail>
              <Detail label="City">{user.address.city}</Detail>
              <Detail label="State">
                {user.address.state} ({user.address.stateCode})
              </Detail>
              <Detail label="Postal code">{user.address.postalCode}</Detail>
              <Detail label="Country">{user.address.country}</Detail>
              <Detail label="Profile photo">
                <a
                  className="underline decoration-zinc-400 underline-offset-2"
                  href={user.image}
                  rel="noreferrer"
                  target="_blank"
                >
                  Open photo
                </a>
              </Detail>
            </>
          )}

          {selectedTab === "employment" && (
            <>
              <Detail label="University">{user.university}</Detail>
              <Detail label="Company">{user.company.name}</Detail>
              <Detail label="Job title">{user.company.title}</Detail>
              <Detail label="Department">{user.company.department}</Detail>
              <Detail label="Role">{user.role}</Detail>
            </>
          )}
        </dl>
      </div>
    </div>
  );
}

export default function UsersData({
  departments,
  activeDepartment,
  visibleUsers,
  selectedUserTabs,
  hasData,
  isLoading,
  error,
  isRetrying,
  hasMoreUsers,
  loadMoreSentinelRef,
  onSelectDepartment,
  onSelectUserDetailsTab,
  onRetry,
  onLoadMore,
}: UsersDataProps) {
  if (isLoading) {
    return (
      <p
        aria-live="polite"
        className="text-sm text-zinc-500 dark:text-zinc-400"
      >
        Loading all users…
      </p>
    );
  }

  if (error && !hasData) {
    return (
      <div className="space-y-3" role="alert">
        <p className="text-sm text-red-700 dark:text-red-400">
          Could not load users: {error}
        </p>
        <button
          className="rounded-full border border-black/[.12] px-4 py-2 text-sm font-medium hover:bg-black/[.04] dark:border-white/[.2] dark:hover:bg-white/[.08]"
          disabled={isRetrying}
          onClick={onRetry}
          type="button"
        >
          {isRetrying ? "Retrying…" : "Try again"}
        </button>
      </div>
    );
  }

  const entries = Object.entries(departments);
  const activeIndex = entries.findIndex(([name]) => name === activeDepartment);
  const activeData = activeIndex >= 0 ? entries[activeIndex][1] : undefined;

  function handleTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let nextIndex: number;

    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % entries.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + entries.length) % entries.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = entries.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    onSelectDepartment(entries[nextIndex][0]);
    event.currentTarget.parentElement
      ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
      [nextIndex]?.focus();
  }

  return (
    <div className="flex w-full flex-col gap-8 px-5 pb-5 sm:px-10">
      {error && (
        <div
          aria-live="polite"
          className="mb-4 rounded-xl border border-red-500/30 p-3 text-sm text-red-700 dark:text-red-400"
          role="alert"
        >
          Could not refresh users: {error}
        </div>
      )}
      {entries.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No users found.
        </p>
      ) : (
        <>
          <div
            aria-label="Departments"
            className="-mx-5 sticky top-[3.0625rem] z-10 flex w-[calc(100%+2.5rem)] gap-2 overflow-x-auto border-y border-black/[.08] bg-white/95 px-5 backdrop-blur dark:border-white/[.145] dark:bg-black/95 sm:top-[4.5625rem] sm:-mx-10 sm:w-[calc(100%+5rem)] sm:px-10"
            role="tablist"
          >
            {entries.map(([name, department], index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  aria-controls={`department-panel-${index}`}
                  aria-selected={isActive}
                  className={`w-max flex-none whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "border-foreground text-zinc-950 dark:text-zinc-50"
                      : "border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  }`}
                  id={`department-tab-${index}`}
                  key={name}
                  onClick={() => onSelectDepartment(name)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                  role="tab"
                  tabIndex={isActive ? 0 : -1}
                  type="button"
                >
                  <span>{name}</span>
                  <span className="ml-2 text-xs">
                    {department.users.length}
                  </span>
                </button>
              );
            })}
          </div>

          {activeData && activeDepartment && (
            <section
              aria-labelledby={`department-tab-${activeIndex}`}
              className="space-y-6"
              id={`department-panel-${activeIndex}`}
              role="tabpanel"
              tabIndex={0}
            >
              <div>
                <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400">
                      Department overview
                    </p>
                    <h3 className="mt-1 text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
                      {activeDepartment}
                    </h3>
                  </div>
                  <p className="rounded-full bg-black/[.05] px-3 py-1.5 text-sm font-semibold dark:bg-white/[.1]">
                    {activeData.users.length}{" "}
                    {activeData.users.length === 1 ? "user" : "users"}
                  </p>
                </header>

                <dl className="grid grid-cols-3 gap-3 rounded-2xl border border-black/[.08] p-4 dark:border-white/[.145]">
                  <Detail label="Male">{activeData.summary.male}</Detail>
                  <Detail label="Female">{activeData.summary.female}</Detail>
                  <Detail label="Age range">
                    {activeData.summary.ageRange}
                  </Detail>
                </dl>

                <div className="mt-4">
                  <h4 className="mb-2 text-sm font-semibold">Hair colors</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(activeData.summary.hair).map(
                      ([color, count]) => (
                        <HairColorBadge
                          color={color}
                          count={count}
                          key={color}
                        />
                      ),
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-semibold">
                    Users in {activeDepartment}
                  </h3>
                  <p
                    aria-live="polite"
                    className="text-sm text-zinc-500 dark:text-zinc-400"
                  >
                    Showing {visibleUsers.length} of {activeData.users.length}
                  </p>
                </div>
                <ul className="grid grid-cols-1 gap-4">
                  {visibleUsers.map((user) => (
                    <li key={user.id}>
                      <article className="w-full rounded-2xl border border-black/[.08] p-4 dark:border-white/[.145] sm:p-5">
                        <header className="flex flex-wrap items-center gap-3 border-b border-black/[.08] pb-4 dark:border-white/[.145]">
                          <UserAvatar
                            fallbackText={`${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`}
                            name={`${user.firstName} ${user.lastName}`}
                            src={user.image}
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="break-words text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                              {user.firstName} {user.lastName}
                            </h4>
                            {user.maidenName && (
                              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                Maiden name: {user.maidenName}
                              </p>
                            )}
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                              @{user.username}
                            </p>
                          </div>
                          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium capitalize text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                            {user.role}
                          </span>
                        </header>

                        <UserDetails
                          onSelectTab={(tab) =>
                            onSelectUserDetailsTab(user.id, tab)
                          }
                          selectedTab={
                            selectedUserTabs[user.id] ?? "personal"
                          }
                          user={user}
                        />
                      </article>
                    </li>
                  ))}
                </ul>

                {hasMoreUsers && (
                  <div className="mt-5 flex flex-col items-center gap-3">
                    <div
                      aria-hidden="true"
                      className="h-1 w-full"
                      key={activeDepartment}
                      ref={loadMoreSentinelRef}
                    />
                    <button
                      className="rounded-full border border-black/[.12] px-5 py-2.5 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/[.2] dark:hover:bg-white/[.08]"
                      onClick={onLoadMore}
                      type="button"
                    >
                      Load more users
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
