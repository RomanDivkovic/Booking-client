import { render, screen } from "@testing-library/react";
import { AuthProvider } from "../../contexts/AuthContext";
import Auth from "../auth/Auth";
import "@testing-library/jest-dom";

// Mock TanStack Router
jest.mock("@tanstack/react-router", () => ({
  useRouterState: () => ({
    location: {
      search: {}
    }
  }),
  useNavigate: () => jest.fn()
}));

// Mocka useToast eftersom den används i Auth-komponenten
jest.mock("../../hooks/use-toast", () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}));

// Mock useInvitationHandler
jest.mock("../../hooks/useInvitationHandler", () => ({
  useInvitationHandler: () => ({
    invitationGroup: null
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
      <AuthProvider>
        <Auth />
      </AuthProvider>
    );
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /sign in/i });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });
});
