import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import HeroTerminalDemo from "./HeroTerminalDemo";

describe("HeroTerminalDemo", () => {
  it("replays the search refund confirm happy path", async () => {
    render(<HeroTerminalDemo isLoaded />);

    const input = screen.getByPlaceholderText(/check recent payments/i);
    await userEvent.type(input, "chec paymen");
    await userEvent.keyboard("{Enter}");

    expect(screen.getByText(/Latest merchant payments/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/refund 87a46da7/i)).toBeInTheDocument();

    await userEvent.type(input, "refund 87a46da7");
    await userEvent.keyboard("{Enter}");

    expect(screen.getByText(/CONFIRMATION_REQUIRED/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/try: confirm/i)).toBeInTheDocument();

    await userEvent.type(input, "confirm");
    await userEvent.keyboard("{Enter}");

    expect(screen.getByText(/Refund Status: SUCCESS/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/try: replay/i)).toBeInTheDocument();
  });

  it("rejects refunds for a processing transaction", async () => {
    render(<HeroTerminalDemo isLoaded />);

    const input = screen.getByPlaceholderText(/check recent payments/i);
    await userEvent.type(input, "recent payment");
    await userEvent.keyboard("{Enter}");
    await userEvent.type(input, "refund 1c4d55c2");
    await userEvent.keyboard("{Enter}");

    expect(screen.getByText(/Status: REJECTED/i)).toBeInTheDocument();
    expect(screen.getByText(/Transaction is still PROCESSING/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/refund 87a46da7/i)).toBeInTheDocument();
  });

  it("shows not found feedback for unknown transaction ids", async () => {
    render(<HeroTerminalDemo isLoaded />);

    const input = screen.getByPlaceholderText(/check recent payments/i);
    await userEvent.type(input, "check payment");
    await userEvent.keyboard("{Enter}");
    await userEvent.type(input, "refund deadbeef");
    await userEvent.keyboard("{Enter}");

    expect(screen.getByText(/Payment transaction not found/i)).toBeInTheDocument();
    expect(screen.getByText(/Use a transaction id like 87a46da7/i)).toBeInTheDocument();
  });

  it("shows guidance for unsupported input and premature confirm", async () => {
    render(<HeroTerminalDemo isLoaded />);

    const input = screen.getByPlaceholderText(/check recent payments/i);
    await userEvent.type(input, "confirm");
    await userEvent.keyboard("{Enter}");

    expect(screen.getByText(/small demo flow here/i)).toBeInTheDocument();
    expect(screen.getByText(/Try: check recent payments/i)).toBeInTheDocument();
  });

  it("supports replay command", async () => {
    render(<HeroTerminalDemo isLoaded />);

    const input = screen.getByPlaceholderText(/check recent payments/i);
    await userEvent.type(input, "refund 87a46da7");
    await userEvent.keyboard("{Enter}");
    await userEvent.clear(input);
    await userEvent.type(input, "replay");
    await userEvent.keyboard("{Enter}");

    expect(screen.getByPlaceholderText(/check recent payments/i)).toBeInTheDocument();
  });

  it("focuses the hidden input when the visible terminal area is clicked", async () => {
    render(<HeroTerminalDemo isLoaded />);

    const user = userEvent.setup();
    const input = screen.getByRole("textbox", { name: /terminal command input/i });
    await user.click(screen.getByText(/try: "check recent payments"/i));
    await user.keyboard("refund 87a46da7");

    expect(input).toHaveValue("refund 87a46da7");
  });

  it("autocompletes the placeholder command on tab", async () => {
    render(<HeroTerminalDemo isLoaded />);

    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/check recent payments/i);

    await user.click(input);
    await user.keyboard("{Tab}");

    expect(input).toHaveValue("check recent payments");
    expect(screen.queryByText(/Latest merchant payments/i)).not.toBeInTheDocument();
  });

  it("autocompletes partial input with the current placeholder suggestion", async () => {
    render(<HeroTerminalDemo isLoaded />);

    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/check recent payments/i);

    await user.type(input, "chec");
    await user.keyboard("{Tab}{Enter}");

    expect(screen.getByText(/Latest merchant payments/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/refund 87a46da7/i)).toBeInTheDocument();
  });
});
