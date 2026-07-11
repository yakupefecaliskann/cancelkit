import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sign in — CancelKit",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl tracking-tight">CancelKit</CardTitle>
          <CardDescription>Sign in to manage your save offers and cancel sessions.</CardDescription>
        </CardHeader>
        <CardContent>
          {error === "google_oauth_failed" && (
            <p className="mb-4 text-sm text-destructive">
              Google sign-in failed. Please try again or use a magic link.
            </p>
          )}
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  );
}
