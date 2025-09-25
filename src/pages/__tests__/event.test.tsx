/* global jest, describe, it, expect, beforeAll */
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { EventModal } from "@/components/EventModal";

beforeAll(() => {
  HTMLElement.prototype.scrollIntoView = jest.fn();
});

jest.mock("@/hooks/useEvents", () => ({
  useEvents: () => ({
    createEvent: jest.fn(() => Promise.resolve({})),
    events: [],
    isLoading: false
  })
}));

jest.mock("@/hooks/useGroups", () => ({
  useGroups: () => ({
    getGroupMembers: jest.fn(() => [
      { id: "1", full_name: "John Doe", email: "john@example.com" }
    ])
  })
}));

describe("Publish Event", () => {
  it("should allow user to publish an event", async () => {
    const mockOnClose = jest.fn();
    const mockOnSubmit = jest.fn();

    render(
      <EventModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        selectedDate={new Date()}
        groupId="test-group"
      />
    );

    await waitFor(() => screen.getByLabelText("Title *"));

    const titleInput = screen.getByLabelText("Title *");
    const descriptionInput = screen.getByLabelText("Description");
    const dateInput = screen.getByLabelText("Date");
    const timeInput = screen.getByLabelText("Time *");
    const submitButton = screen.getByRole("button", { name: "Add event" });

    fireEvent.change(titleInput, { target: { value: "Test Event" } });
    fireEvent.change(descriptionInput, {
      target: { value: "This is a test event." }
    });
    fireEvent.change(dateInput, { target: { value: "2023-12-31" } });
    fireEvent.change(timeInput, { target: { value: "18:00" } });

    // Type is already set to "booking"

    // Select assignee
    const assigneeSelect = screen.getByText("Select person");
    fireEvent.click(assigneeSelect);
    await waitFor(() => screen.getByRole("option", { name: /John Doe/ }));
    fireEvent.click(screen.getByRole("option", { name: /John Doe/ }));

    // Select category
    const categorySelect = screen.getByText("Select category");
    fireEvent.click(categorySelect);
    const categoryOption = screen.getByRole("option", { name: /Household/ });
    fireEvent.click(categoryOption);

    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it("should close the modal when cancel button is clicked", () => {
    const mockOnClose = jest.fn();
    const mockOnSubmit = jest.fn();

    render(
      <EventModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        selectedDate={new Date()}
        groupId="test-group"
      />
    );

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
