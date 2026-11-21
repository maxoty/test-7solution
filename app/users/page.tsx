"use client";

import { useCallback, useState } from "react";
import ProfileLayout from "@/components/profile-layout";
import UsersData, {
  type UserDetailsTab,
} from "@/components/users-data";
import { useLoadMoreOnScroll } from "@/hooks/use-load-more-on-scroll";
import { useUsers } from "@/hooks/use-users";

const userCardPageSize = 12;

export default function Users() {
  const { departments, hasData, isPending, error, isFetching, refetch } =
    useUsers();
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null,
  );
  const [selectedUserTabs, setSelectedUserTabs] = useState<
    Partial<Record<number, UserDetailsTab>>
  >({});
  const [visibleUserCount, setVisibleUserCount] = useState(userCardPageSize);
  const departmentNames = Object.keys(departments);
  const activeDepartment =
    selectedDepartment && departments[selectedDepartment]
      ? selectedDepartment
      : (departmentNames[0] ?? null);
  const activeUsers = activeDepartment
    ? departments[activeDepartment].users
    : [];
  const visibleUsers = activeUsers.slice(0, visibleUserCount);
  const hasMoreUsers = visibleUsers.length < activeUsers.length;

  const handleSelectDepartment = useCallback((department: string) => {
    setSelectedDepartment(department);
    setVisibleUserCount(userCardPageSize);
  }, []);
  const handleSelectUserDetailsTab = useCallback(
    (userId: number, tab: UserDetailsTab) => {
      setSelectedUserTabs((current) => ({ ...current, [userId]: tab }));
    },
    [],
  );
  const handleLoadMore = useCallback(() => {
    setVisibleUserCount((count) => count + userCardPageSize);
  }, []);
  const loadMoreSentinelRef = useLoadMoreOnScroll({
    hasMore: hasMoreUsers,
    isLoading: false,
    onLoadMore: handleLoadMore,
  });
  const errorMessage = error
    ? error instanceof Error
      ? error.message
      : "An unexpected error occurred"
    : undefined;

  return (
    <ProfileLayout activeTab="users">
      <UsersData
        activeDepartment={activeDepartment}
        departments={departments}
        error={errorMessage}
        hasData={hasData}
        isLoading={isPending}
        isRetrying={isFetching}
        loadMoreSentinelRef={loadMoreSentinelRef}
        onLoadMore={handleLoadMore}
        onRetry={() => void refetch()}
        onSelectDepartment={handleSelectDepartment}
        onSelectUserDetailsTab={handleSelectUserDetailsTab}
        hasMoreUsers={hasMoreUsers}
        selectedUserTabs={selectedUserTabs}
        visibleUsers={visibleUsers}
      />
    </ProfileLayout>
  );
}
