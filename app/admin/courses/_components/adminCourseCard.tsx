import { AdminCourseType } from "@/app/data/admin/get-courses";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useConstructImageUrl } from "@/hooks/use-construct-url";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  ArrowRight,
  Eye,
  MoreVertical,
  Pencil,
  School,
  Timer,
  Trash,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface iAdminCourseCardProps {
  data: AdminCourseType;
}

export default function AdminCourseCard({ data }: iAdminCourseCardProps) {
  const imageUrl = useConstructImageUrl(data.fileKey);

  return (
    <Card className="overflow-hidden relative group py-0 gap-0">
      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 space-y-2">
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${data.id}/update`}>
                <div className="flex items-center gap-2">
                  <Pencil className="size-4 mr-2" />
                  Edit this course
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${data.slug}}`}>
                <div className="flex items-center gap-2">
                  <Eye className="size-4 mr-2" />
                  View
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${data.id}`}>
                <div className="flex items-center gap-2">
                  <Trash className="size-4 mr-2 text-destructive" />
                  Delete
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Image
        src={imageUrl}
        alt="image"
        width={600}
        height={400}
        className="aspect-video w-full rounded-t-lg object-cover h-full"
      />
      <CardContent className="p-4">
        <Link
          href={`/admin/courses/${data.id}`}
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary"
        >
          <p>{data.title}</p>
        </Link>

        <p className="text-muted-foreground leading-tight line-clamp-2 text-medium">
          {data.smallDescription}
        </p>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Timer className="size-6 p-1 rounded-full text-primary bg-primary/50" />
            <p className="text-muted-foreground text-sm">{data.duration}</p>
          </div>
          <div className="flex items-center gap-1">
            <School className="size-6 p-1 rounded-full text-primary bg-primary/50" />
            <p className="text-muted-foreground text-sm">{data.category}</p>
          </div>
        </div>

        <Link
          href={`/admin/courses/${data.id}/update`}
          className={buttonVariants({ className: "w-full mt-4" })}
        >
          Edit this Course <ArrowRight className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
