import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useGroups } from "@/hooks/useGroups";
import { LoadingSpinner } from "./SkeletonLoaders";
import { Calendar } from "lucide-react";

export const GroupSelection = () => {
  const { createGroup, loading } = useGroups();
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [error, setError] = useState("");

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) {
      setError("Group name cannot be empty.");
      return;
    }
    setError("");
    const result = await createGroup(groupName, groupDescription);
    if (!result.error) {
      setGroupName("");
      setGroupDescription("");
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <div className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Create Your First Group
              </h1>
              <p className="text-xl text-gray-600">
                Start by creating a group to organize your family calendar with
                FamCaly
              </p>
            </div>

            {/* Create Group Form */}
            <Card>
              <CardHeader>
                <CardTitle>Create New Group</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateGroup} className="space-y-4">
                  <div>
                    <Label htmlFor="groupName">Group name *</Label>
                    <Input
                      id="groupName"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      placeholder="e.g. Andersson Family"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <Label htmlFor="groupDescription">Description</Label>
                    <Textarea
                      id="groupDescription"
                      value={groupDescription}
                      onChange={(e) => setGroupDescription(e.target.value)}
                      placeholder="Describe your group (optional)"
                      rows={3}
                      disabled={loading}
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <div className="flex justify-end space-x-3">
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <LoadingSpinner size="small" />
                          <span>Creating...</span>
                        </div>
                      ) : (
                        "Create Group"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
