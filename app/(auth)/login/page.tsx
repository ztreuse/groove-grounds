import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";
import { dance } from "@/lib/copy";

export const metadata: Metadata = { title: dance.pages.login };

export default function Page() {
  return <AuthForm mode="login" />;
}
