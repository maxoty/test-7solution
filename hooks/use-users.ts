"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllUsers, getDepartmentData } from "@/services/users-service";
import { USERS_QUERY_KEY } from "@/services/users-data";

export function useUsers() {
  const query = useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: ({ signal }) => fetchAllUsers(signal),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });

  const departments = useMemo(
    () => getDepartmentData(query.data ?? []),
    [query.data],
  );

  return {
    ...query,
    departments,
    userCount: query.data?.length ?? 0,
    totalUserCount: query.data?.length ?? 0,
    hasData: query.data !== undefined,
  };
}
