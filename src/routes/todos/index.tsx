import { createFileRoute } from "@tanstack/react-router";
import Todos from "../../pages/Todos";

export const Route = createFileRoute("/todos/")({
  component: Todos
});
