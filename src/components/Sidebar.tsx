import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, List, User, UserPlus } from "lucide-react";

interface SidebarProps {
  onAddClick: () => void;
  onInviteClick: () => void;
}

export const Sidebar = ({ onAddClick, onInviteClick }: SidebarProps) => {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={onAddClick} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
          <Button onClick={onInviteClick} className="w-full" variant="outline">
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>Navigation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link to="/todos">
            <Button variant="ghost" className="w-full justify-start">
              <List className="w-4 h-4 mr-2" />
              Todos
            </Button>
          </Link>

          <Link to="/profile">
            <Button variant="ghost" className="w-full justify-start">
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};
