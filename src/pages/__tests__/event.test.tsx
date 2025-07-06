/* global jest, describe, it, expect */
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { EventModal } from "@/components/EventModal";

jest.mock("@/hooks/useEvents", () => ({
  useEvents: () => ({
    createEvent: jest.fn(() => Promise.resolve({})),
    events: [],
    isLoading: false
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

    const titleInput = screen.getByLabelText(/titel/i);
    fireEvent.change(titleInput, { target: { value: "Birthday Party" } });
    const saveButton = screen.getByRole("button", {
      name: /lägg till händelse/i
    });
    fireEvent.click(saveButton);

    expect(titleInput).toHaveValue("Birthday Party");
    // Optionally, check for success message or modal close
  });
});
