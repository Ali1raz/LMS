"use client";
import { authClient } from "@/lib/auth-client";
import { Github, Loader } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const [githubPending, startGithubTrasnition] = useTransition();
  const [emailPending, startEmailTransition] = useTransition();

  async function signInWithGitHub() {
    startGithubTrasnition(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Successfully signed in with GitHub! Redirecting...");
          },
          onError: () => {
            toast.error("Internal server error");
          },
        },
      });
    });
  }

  function signInWithEmail() {
    startEmailTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
        fetchOptions: {
          onSuccess: () => {
            toast.success(
              "Verification code sent to your email! Please check your inbox."
            );
            router.push(`/verify-email?email=${email}`);
          },
          onError: (error) => {
            toast.error("Internal Server error");
          },
        },
      });
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome Back!</CardTitle>
        <CardDescription>Login with your GitHub Account</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button
          disabled={githubPending}
          onClick={signInWithGitHub}
          className="w-full"
          variant="outline"
        >
          {githubPending ? (
            <>
              <Loader className="size-4 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <>
              <Github className="size-4" />
              Sign in with GitHub
            </>
          )}
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-card px-2 text-muted-foreground">
            or continue with
          </span>
        </div>

        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <Button disabled={emailPending} onClick={signInWithEmail}>
            {emailPending ? (
              <>
                <Loader className="size-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              "Send Verification Code"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
