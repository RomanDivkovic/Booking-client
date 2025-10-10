import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useGroup } from "@/contexts/GroupContext";
import { useTodos } from "@/hooks/useTodos";
import { useGroups } from "@/hooks/useGroups";
import { Plus, Trash2, List, Circle } from "lucide-react";
import { TodoSkeleton, LoadingSpinner } from "@/components/SkeletonLoaders";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function Todos() {
  const [newTodo, setNewTodo] = useState("");
  const { user } = useAuth();
  const { activeGroup } = useGroup();
  const { groups } = useGroups();
  const { toast } = useToast();
  const [todoDate, setTodoDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );
  const [selectedGroupId, setSelectedGroupId] = useState<string>(
    activeGroup?.id || ""
  );

  const {
    todos,
    isLoading,
    createTodo,
    isCreatingTodo,
    deleteTodo,
    isDeletingTodo
  } = useTodos();

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    const groupId = selectedGroupId || activeGroup?.id;
    if (!newTodo.trim() || !groupId || !user) return;

    const todoData = {
      title: newTodo.trim(),
      event_date: todoDate,
      assignee_id: user.id,
      group_id: groupId
    };

    try {
      await createTodo(todoData);
      setNewTodo("");
      setTodoDate(format(new Date(), "yyyy-MM-dd"));
      toast({
        title: "Todo added!",
        description: "Your todo has been added successfully."
      });
    } catch (error: unknown) {
      console.log(error);
      toast({
        title: "Error adding todo",
        description: "Could not add your todo. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleToggleTodo = async (todoId: string, completed: boolean) => {
    if (completed) {
      try {
        await deleteTodo(todoId);
        toast({
          title: "Todo completed!",
          description: "Great job!"
        });
      } catch (error: unknown) {
        console.log(error);
        toast({
          title: "Error completing todo",
          description: "Could not update your todo. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleDeleteTodo = async (todoId: string) => {
    try {
      await deleteTodo(todoId);
      toast({
        title: "Todo deleted!",
        description: "Your todo has been removed."
      });
    } catch (error: unknown) {
      console.log(error);
      toast({
        title: "Error deleting todo",
        description: "Could not delete your todo. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (groups.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <List className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No groups available
            </h2>
            <p className="text-gray-600">
              Please create a group first to manage todos
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <List className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">To-dos</h1>
              <p className="text-xl text-gray-600">
                Keep track of tasks and get things done together
              </p>
            </div>

            {/* Add Todo Form */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Add New Todo</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddTodo} className="space-y-4">
                  {!activeGroup && (
                    <div>
                      <Label htmlFor="group">Group *</Label>
                      <Select
                        value={selectedGroupId}
                        onValueChange={setSelectedGroupId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select group" />
                        </SelectTrigger>
                        <SelectContent>
                          {groups.map((group) => (
                            <SelectItem key={group.id} value={group.id}>
                              🏠 {group.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <Input
                      value={newTodo}
                      onChange={(e) => setNewTodo(e.target.value)}
                      placeholder="What needs to be done?"
                      disabled={isCreatingTodo}
                      className="flex-1 min-w-0"
                    />
                    <Input
                      type="date"
                      value={todoDate}
                      onChange={(e) => setTodoDate(e.target.value)}
                      disabled={isCreatingTodo}
                      className="w-full sm:w-48"
                    />
                    <Button
                      type="submit"
                      disabled={
                        isCreatingTodo ||
                        !newTodo.trim() ||
                        (!activeGroup && !selectedGroupId)
                      }
                      className="w-full sm:w-auto"
                    >
                      {isCreatingTodo ? (
                        <div className="flex items-center space-x-2">
                          <LoadingSpinner size="small" />
                          <span>Adding...</span>
                        </div>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Add
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Todos List */}
            <div className="space-y-6">
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <TodoSkeleton key={i} />
                  ))}
                </div>
              ) : todos.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Circle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      No todos yet. Add your first todo above!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Circle className="w-5 h-5 text-blue-600" />
                      <span>Your Todos ({todos.length})</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {todos.map((todo) => (
                        <div
                          key={todo.id}
                          className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors animate-in slide-in-from-top-2 duration-300"
                        >
                          <Checkbox
                            onCheckedChange={(checked) =>
                              handleToggleTodo(todo.id, checked as boolean)
                            }
                            className="flex-shrink-0"
                          />
                          <span className="flex-1 text-gray-900">
                            {todo.title}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTodo(todo.id)}
                            disabled={isDeletingTodo}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            {isDeletingTodo ? (
                              <LoadingSpinner size="small" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
