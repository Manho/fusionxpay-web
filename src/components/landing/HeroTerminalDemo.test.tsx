import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import HeroTerminalDemo from "./HeroTerminalDemo";

describe("HeroTerminalDemo", () => {
  it("replays the search refund confirm happy path", async () => {
    render(<HeroTerminalDemo isLoaded />);

    const input = screen.getByPlaceholderText(/check recent payments/i);
    await userEvent.type(input, "check recent payments");
    await userEvent.keyboard("{Enter}");

    expect(screen.getByText(/Payments: 2 found/i)).toBeInTheDocument();

    await userEvent.type(input, "refund 87a46da7");
    await userEvent.keyboard("{Enter}");

    expect(screen.getByText(/CONFIRMATION_REQUIRED/i)).toBeInTheDocument();

    await userEvent.type(input, "confirm");
    await userEvent.keyboard("{Enter}");

    expect(screen.getByText(/Refund Status: SUCCESS/i)).toBeInTheDocument();
  });

  it("shows guidance for unsupported input", async () => {
    render(<HeroTerminalDemo isLoaded />);

    const input = screen.getByPlaceholderText(/check recent payments/i);
    await userEvent.type(input, "do something else");
    await userEvent.keyboard("{Enter}");

    expect(screen.getByText(/small scripted cli demo/i)).toBeInTheDocument();
  });
});
