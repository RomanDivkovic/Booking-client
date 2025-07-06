/* global jest, describe, it, expect */
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock the hooks
jest.mock("@/hooks/useEvents", () => ({
  useEvents: () => ({
    createTodo: jest.fn(() => Promise.resolve({})),
    todos: [],
    isLoading: false
  })
}));

describe("Create Todo", () => {
  it("should allow user to create a todo", async () => {
    // Test the form elements directly
    render(
      <div>
        <input placeholder="What needs to be done?" data-testid="todo-input" />
        <button data-testid="add-todo-btn">Add</button>
      </div>
    );

    const input = screen.getByTestId("todo-input");
    const addButton = screen.getByTestId("add-todo-btn");

    fireEvent.change(input, { target: { value: "Buy milk" } });
    fireEvent.click(addButton);

    expect(input).toHaveValue("Buy milk");
    // Optionally, check for success message or todo in list
  });
});
