"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import UserAvatar from "./user-avatar";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

const navLinks = [
  { title: "Home", href: "/" },
  { title: "Courses", href: "/courses" },
  { title: "Dashboard", href: "/dashboard" },
];

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <header className="sticky flex justify-between px-4 items-center top-0 z-10 w-full border-b bg-background/90 backdrop-blur-[backdrop-filter]:bg-background/60">
      <div className="flex gap-6 container min-h-16 items-center mx-auto px-4 md:px-6">
        <Link href="/" className="text-xl font-bold">
          LMS
        </Link>
        <div className="flex items-center gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {link.title}
            </Link>
          ))}
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-2">
        <ThemeToggle />
        {isPending ? null : session ? (
          <>
            <UserAvatar
              name={
                session?.user.name && session?.user.name.length > 0
                  ? session?.user.name[0]
                  : session?.user?.email.split("@")[0]
              }
              email={session?.user.email}
              image={
                session?.user.image ??
                `https://avatar.vercel.sh/${
                  session?.user.name[0] && session?.user.email.split("@")[0]
                }`
              }
            />
          </>
        ) : (
          <>
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
