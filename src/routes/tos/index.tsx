import { createFileRoute } from "@tanstack/react-router";
import TOS from "../../pages/TOS";

export const Route = createFileRoute("/tos/")({
  component: TOS
});
