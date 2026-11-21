import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import UserAvatar from "./user-avatar";

afterEach(cleanup);

describe("UserAvatar", () => {
  it("shows initials when the profile image fails to load", () => {
    render(
      <UserAvatar
        fallbackText="TM"
        name="Terry Medhurst"
        src="https://dummyjson.com/icon/terry/128"
      />,
    );

    fireEvent.error(screen.getByRole("img", { name: "Terry Medhurst" }));

    expect(
      screen.getByRole("img", {
        name: "Terry Medhurst profile image unavailable",
      }).textContent,
    ).toBe("TM");
  });
});
