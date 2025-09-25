import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGroups } from "@/hooks/useGroups";
import { Bell } from "lucide-react";
import React, { useState, useContext, createContext } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { useEvents } from "@/hooks/useEvents";

// Notification context and hook
const NotificationContext = createContext([]);
export const useNotifications = () => useContext(NotificationContext);

function getUpcomingTasks(events) {
  const now = new Date();
  return events.filter(
    (e) =>
      e.event_type === "task" &&
      new Date(e.event_date) > now &&
      new Date(e.event_date) < new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)
  );
}
function getUpcomingEvents(events) {
  const now = new Date();
  return events.filter(
    (e) =>
      e.event_type === "booking" &&
      new Date(e.event_date) > now &&
      new Date(e.event_date) < new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)
  );
}

function NotificationList({ notifications }) {
  if (notifications.length === 0) {
    return <div className="p-4 text-gray-500">No notifications</div>;
  }
  return (
    <ul className="p-2 min-w-[250px]">
      {notifications.map((n, i) => (
        <li key={i} className="py-2 border-b last:border-b-0 text-sm">
          {n}
        </li>
      ))}
    </ul>
  );
}

export const Header = () => {
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const { invitations } = useGroups();
  const pendingInvitations = invitations.filter(
    (inv) => inv.status === "pending"
  );
  const [showNotifications, setShowNotifications] = useState(false);
  const selectedGroupId = localStorage.getItem("selectedGroupId");
  const { events = [] } = useEvents(selectedGroupId);

  // Build notifications
  const notifications = [
    ...pendingInvitations.map(
      (inv) => `You have been invited to join ${inv.group?.name || "a group"}`
    ),
    ...getUpcomingTasks(events).map(
      (e) => `Your task '${e.title}' is due soon`
    ),
    ...getUpcomingEvents(events).map(
      (e) => `Your event '${e.title}' is coming up soon`
    )
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <NotificationContext.Provider value={notifications}>
      <header className="bg-white shadow-sm border-b border-[#FFD700] sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <Link
                to="/"
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    src="/web-app-manifest-192x192.png"
                    alt="FamCaly Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xl font-bold text-gray-900">FamCaly</span>
              </Link>
              {!isMobile && (
                <nav className="hidden md:flex items-center space-x-6">
                  <Link
                    to="/"
                    className="link-hover-animation text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Calendar
                  </Link>
                  <Link
                    to="/todos"
                    className="link-hover-animation text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Todos
                  </Link>
                  {pendingInvitations.length > 0 && (
                    <Link
                      to="/invitations"
                      className="relative link-hover-animation text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Invitations
                      <span className="absolute -top-2 -right-3 bg-red-600 text-white rounded-full px-2 text-xs font-bold">
                        {pendingInvitations.length}
                      </span>
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="link-hover-animation text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Profile
                  </Link>
                </nav>
              )}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2"
                    >
                      {isMobile ? (
                        <User className="w-5 h-5 text-gray-600" />
                      ) : (
                        <>
                          <User className="w-5 h-5 text-gray-600" />
                          <span className="text-gray-900 font-medium">
                            {user.email}
                          </span>
                        </>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/todos">Todos</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Popover
                        open={showNotifications}
                        onOpenChange={setShowNotifications}
                      >
                        <PopoverTrigger asChild>
                          <span className="flex items-center cursor-pointer">
                            <Bell className="w-4 h-4 mr-2" /> Notifications
                            {notifications.length > 0 && (
                              <span className="ml-2 bg-red-600 text-white rounded-full px-2 text-xs font-bold">
                                {notifications.length}
                              </span>
                            )}
                          </span>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="z-50">
                          <NotificationList notifications={notifications} />
                        </PopoverContent>
                      </Popover>
                    </DropdownMenuItem>
                    {pendingInvitations.length > 0 && (
                      <DropdownMenuItem asChild>
                        <Link to="/invitations" className="flex items-center">
                          Invitations
                          <span className="ml-2 bg-red-600 text-white rounded-full px-2 text-xs font-bold">
                            {pendingInvitations.length}
                          </span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-red-600"
                    >
                      <LogOut className="w-4 h-4 mr-2" /> Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </header>
    </NotificationContext.Provider>
  );
};
