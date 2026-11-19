import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import FruitVegetableTodo from "./fruit-vegetable-todo";

describe("FruitVegetableTodo", () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("moves an item to its category and automatically returns it after five seconds", async () => {
    vi.useFakeTimers();
    render(<FruitVegetableTodo />);

    const availableItems = screen.getByRole("region", { name: /^Items/ });
    fireEvent.click(within(availableItems).getByRole("button", { name: /^Apple/ }));

    expect(screen.getByRole("button", { name: "AppleReturn" })).toBeDefined();
    expect(
      within(availableItems).queryByRole("button", { name: /^Apple/ }),
    ).toBeNull();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });

    expect(
      within(availableItems).getByRole("button", { name: /^Apple/ }),
    ).toBeDefined();
    expect(screen.queryByRole("button", { name: "AppleReturn" })).toBeNull();
  });

  it("returns an item immediately and does not add it again when its timer expires", async () => {
    vi.useFakeTimers();
    render(<FruitVegetableTodo />);

    const availableItems = screen.getByRole("region", { name: /^Items/ });
    fireEvent.click(within(availableItems).getByRole("button", { name: /^Apple/ }));
    fireEvent.click(screen.getByRole("button", { name: "AppleReturn" }));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });

    expect(
      within(availableItems).getAllByRole("button", { name: /^Apple/ }),
    ).toHaveLength(1);
    expect(screen.queryByRole("button", { name: "AppleReturn" })).toBeNull();
  });
});
