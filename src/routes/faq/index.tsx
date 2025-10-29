import { createFileRoute } from "@tanstack/react-router";
import FAQ from "../../pages/faq/FAQ";

export const Route = createFileRoute("/faq/")({
  component: FAQ
});
