import React from "react";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useEvents } from "@/hooks/useEvents";
import { Plus, Trash2, List, Circle } from "lucide-react";
import { TodoSkeleton, LoadingSpinner } from "@/components/SkeletonLoaders";
import { supabase } from "@/integrations/supabase/client";

export default function Todos() {
  const [newTodo, setNewTodo] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [deletingTodos, setDeletingTodos] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const { toast } = useToast();

  // Get the current group ID from localStorage
  const getCurrentGroupId = () => {
    return localStorage.getItem("selectedGroupId");
  };

  const selectedGroupId = getCurrentGroupId();
  const { events, loading, createEvent } = useEvents(selectedGroupId);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim() || !selectedGroupId || !user) return;

    setIsAdding(true);

    try {
      const todoData = {
        title: newTodo.trim(),
        description: "",
        event_date: new Date().toISOString().split("T")[0],
        event_time: "12:00",
        event_type: "task" as const,
        assignee_id: user.id,
        category: "General"
      };

      const { error } = await createEvent(todoData);

      if (error) {
        throw error;
      }

      setNewTodo("");

      toast({
        title: "Todo added!",
        description: "Your todo has been added successfully."
      });
    } catch {
      toast({
        title: "Error adding todo",
        description: "Could not add your todo. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAdding(false);
    }
  };

  const toggleTodo = async (todoId: string, completed: boolean) => {
    try {
      // For now, we'll just delete the todo when marked as completed
      // In a real implementation, you'd update a completed field
      if (completed) {
        const { error } = await supabase
          .from("events")
          .delete()
          .eq("id", todoId);

        if (error) throw error;

        toast({
          title: "Todo completed!",
          description: "Great job!"
        });
      }
    } catch {
      toast({
        title: "Error updating todo",
        description: "Could not update your todo. Please try again.",
        variant: "destructive"
      });
    }
  };

  const deleteTodo = async (todoId: string) => {
    setDeletingTodos((prev) => new Set(prev).add(todoId));

    try {
      const { error } = await supabase.from("events").delete().eq("id", todoId);

      if (error) throw error;

      toast({
        title: "Todo deleted!",
        description: "Your todo has been removed."
      });
    } catch {
      toast({
        title: "Error deleting todo",
        description: "Could not delete your todo. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDeletingTodos((prev) => {
        const newSet = new Set(prev);
        newSet.delete(todoId);
        return newSet;
      });
    }
  };

  // Filter tasks from events
  const todos = events.filter((event) => event.event_type === "task");

  if (!selectedGroupId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <List className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No group selected
            </h2>
            <p className="text-gray-600">Please select a group to view todos</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
      <Header />

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
                <form onSubmit={addTodo} className="flex gap-3">
                  <Input
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="What needs to be done?"
                    disabled={isAdding}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isAdding || !newTodo.trim()}>
                    {isAdding ? (
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
                </form>
              </CardContent>
            </Card>

            {/* Todos List */}
            <div className="space-y-6">
              {loading ? (
                // Show skeleton loaders while loading
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
                              toggleTodo(todo.id, checked as boolean)
                            }
                            className="flex-shrink-0"
                          />
                          <span className="flex-1 text-gray-900">
                            {todo.title}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTodo(todo.id)}
                            disabled={deletingTodos.has(todo.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            {deletingTodos.has(todo.id) ? (
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

      <Footer />
    </div>
  );
}
