import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";
import { dance } from "@/lib/copy";

export const metadata: Metadata = { title: dance.pages.join };

export default function Page() {
  return <AuthForm mode="join" />;
}
