import { createFileRoute } from "@tanstack/react-router";
import GroupManagement from "../../pages/GroupManagement";

export const Route = createFileRoute("/group-management/")({
  component: GroupManagement
});
