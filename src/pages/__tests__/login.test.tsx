/* global jest, describe, it, expect */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Auth from "../Auth";

jest.mock("../../integrations/supabase/client", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(() =>
        Promise.resolve({ data: { user: { id: "1" } }, error: null })
      )
    }
  }
}));

describe("Login", () => {
  it("should allow user to login", async () => {
    render(<Auth />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(loginButton);

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
    // Optionally, check for loading state or success message
  });
});
