import { act, cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useLoadMoreOnScroll } from "./use-load-more-on-scroll";

let intersectionCallback: IntersectionObserverCallback;
const observe = vi.fn();
const disconnect = vi.fn();

class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    intersectionCallback = callback;
  }

  observe = observe;
  disconnect = disconnect;
}

function Sentinel({
  hasMore,
  isLoading,
  onLoadMore,
}: {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}) {
  const ref = useLoadMoreOnScroll({ hasMore, isLoading, onLoadMore });

  return <div ref={ref} />;
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  observe.mockClear();
  disconnect.mockClear();
});

describe("useLoadMoreOnScroll", () => {
  it("loads the next page when the sentinel approaches the viewport", () => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    const onLoadMore = vi.fn();

    const { container } = render(
      <Sentinel
        hasMore
        isLoading={false}
        onLoadMore={onLoadMore}
      />,
    );

    expect(observe).toHaveBeenCalledWith(container.firstChild);

    act(() => {
      intersectionCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(onLoadMore).toHaveBeenCalledOnce();
  });

  it("does not observe while no more pages exist or a page is loading", () => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

    render(
      <Sentinel
        hasMore
        isLoading
        onLoadMore={vi.fn()}
      />,
    );

    expect(observe).not.toHaveBeenCalled();
  });
});
