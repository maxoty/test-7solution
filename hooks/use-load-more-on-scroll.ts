"use client";

import { useCallback, useEffect, useState, type RefCallback } from "react";

type UseLoadMoreOnScrollOptions = {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
};

export function useLoadMoreOnScroll({
  hasMore,
  isLoading,
  onLoadMore,
}: UseLoadMoreOnScrollOptions): RefCallback<HTMLDivElement> {
  const [sentinel, setSentinel] = useState<HTMLDivElement | null>(null);
  const sentinelRef = useCallback((element: HTMLDivElement | null) => {
    setSentinel(element);
  }, []);

  useEffect(() => {
    if (
      !sentinel ||
      !hasMore ||
      isLoading ||
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin: "0px 0px 400px 0px" },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore, sentinel]);

  return sentinelRef;
}
