import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../../contexts/AuthContext";
import Auth from "../Auth";
import "@testing-library/jest-dom";

// Mocka useToast eftersom den används i Auth-komponenten
jest.mock("../../hooks/use-toast", () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}));

// Mocka supabase-klienten
jest.mock("../../integrations/supabase/client", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn()
    }
  }
}));

describe("Login", () => {
  it("should render login form", () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Auth />
        </AuthProvider>
      </MemoryRouter>
    );
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /sign in/i });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });
});
