/* global jest, require */
// Mock Supabase client globally
jest.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(() =>
        Promise.resolve({ data: { user: { id: "1" } }, error: null })
      ),
      signUp: jest.fn(() =>
        Promise.resolve({ data: { user: { id: "1" } }, error: null })
      ),
      signOut: jest.fn(() => Promise.resolve({ error: null }))
    }
  }
}));

const React = require("react");
const mockAuth = {
  user: { id: "1", email: "test@example.com" },
  signIn: jest.fn(),
  signUp: jest.fn(),
  signOut: jest.fn(),
  loading: false
};
jest.mock("@/contexts/AuthContext", () => ({
  useAuth: () => mockAuth,
  AuthProvider: ({ children }) =>
    React.createElement(React.Fragment, null, children)
}));

// Mock useEvents hook
jest.mock("@/hooks/useEvents", () => ({
  useEvents: () => ({
    events: [],
    todos: [],
    loading: false,
    createEvent: jest.fn(() => Promise.resolve({})),
    createTodo: jest.fn(() => Promise.resolve({})),
    updateEvent: jest.fn(() => Promise.resolve({})),
    deleteEvent: jest.fn(() => Promise.resolve({})),
    toggleTodo: jest.fn(() => Promise.resolve({})),
    deleteTodo: jest.fn(() => Promise.resolve({})),
    refetch: jest.fn()
  })
}));

// Mock useGroups hook
jest.mock("@/hooks/useGroups", () => ({
  useGroups: () => ({
    groups: [{ id: "1", name: "Test Group" }],
    loading: false,
    createGroup: jest.fn(() => Promise.resolve({})),
    updateGroup: jest.fn(() => Promise.resolve({})),
    deleteGroup: jest.fn(() => Promise.resolve({})),
    inviteToGroup: jest.fn(() => Promise.resolve({})),
    acceptInvitation: jest.fn(() => Promise.resolve({})),
    declineInvitation: jest.fn(() => Promise.resolve({})),
    getGroupMembers: jest.fn(() =>
      Promise.resolve([
        { id: "1", full_name: "Test User", email: "test@example.com" }
      ])
    )
  })
}));

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  BrowserRouter: ({ children }) =>
    React.createElement(React.Fragment, null, children)
}));
