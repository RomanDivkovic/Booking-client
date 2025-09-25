import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { GroupProvider } from "@/contexts/GroupContext";
import { GroupInviteModal } from "@/components/GroupInviteModal";

// Mock the global fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ message: "Invite sent successfully" })
  })
) as jest.Mock;

const mockUser = { id: "user-1", email: "test@example.com" };
const mockGroup = {
  group_id: "group-1",
  name: "Test Group 1",
  description: "A test group",
  created_by: "user-1"
};

const renderComponent = () => {
  const mockOnInvite = jest.fn().mockResolvedValue({
    userExists: false,
    invitationId: "invitation-123"
  });

  return render(
    <MemoryRouter>
      <AuthProvider>
        <GroupProvider>
          <GroupInviteModal
            isOpen={true}
            onClose={() => {}}
            onInvite={mockOnInvite}
            groupName={mockGroup.name}
          />
        </GroupProvider>
      </AuthProvider>
    </MemoryRouter>
  );
};

describe("Invitation Functionality", () => {
  beforeEach(() => {
    // Mock the useAuth hook to provide a mock user
    jest.spyOn(require("@/contexts/AuthContext"), "useAuth").mockReturnValue({
      user: mockUser,
      loading: false
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  test("should allow inviting a user to a group", async () => {
    // Mock window.location.origin
    Object.defineProperty(window, "location", {
      value: { origin: "http://localhost:3000" },
      writable: true
    });

    renderComponent();

    // Fill in the email
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "invite@example.com" }
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /invite/i }));

    // Check if fetch was called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/send-invite-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: "invite@example.com",
          inviteLink: "http://localhost:3000/auth?invite=invitation-123",
          groupName: mockGroup.name
        })
      });
    });

    // Check that the invitation link section appears
    expect(
      await screen.findByText("Share invitation link")
    ).toBeInTheDocument();

    // Check that the invitation link is displayed
    expect(
      screen.getByDisplayValue(
        "http://localhost:3000/auth?invite=invitation-123"
      )
    ).toBeInTheDocument();
  });
});
