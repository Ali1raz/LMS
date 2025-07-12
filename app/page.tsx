"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();

  const { data: session } = authClient.useSession();

  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          toast.success("Successfully signed out!");
        },
      },
    });
  }

  return (
    <div className="text-3xl flex flex-col items-center justify-center min-h-screen">
      {session ? (
        <>
          <h1 className="text-center">{session.user.name}</h1>
          <Button onClick={signOut}>Sign out</Button>
        </>
      ) : (
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      )}
      <ThemeToggle />
    </div>
  );
}
