import { redirect } from "next/navigation";

// Root page redirects to the public homepage inside (public) route group
export default function RootPage() {
  redirect("/");
}
