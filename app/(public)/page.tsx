"use client";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

type feature = {
  title: string;
  description: string;
  icon: string;
};

const features: feature[] = [
  {
    title: "Interactive Learning",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis asperiores omnis eveniet.",
    icon: "📚",
  },
  {
    title: "Progress Tracking",
    description:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda ea quam ad. Explicabo, a inventore.",
    icon: "📈",
  },
  {
    title: "Project Management",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem, accusamus officiis autem iste sunt veritatis",
    icon: "📊",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative py-10">
        <div className="flex flex-col items-center text-center space-y-8">
          <Badge variant="secondary">The futrure of online education</Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight capitalize">
            Enhance your learing experience
          </h1>
          <p className="text-muted-foreground max-w-2xl md:text-xl max-md:px-4">
            Discover a new way to learn with our modern, interactive learning
            management system. Access high quality courses anytime, anywhere.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/courses" className={buttonVariants({ size: "lg" })}>
              Explore Courses
            </Link>
            <Link
              href="/login"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 max-sm:px-3">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-4xl mb-4">{feature.icon}</div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}
