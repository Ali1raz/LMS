import { AdminGetCourses } from "@/app/data/admin/get-courses";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import AdminCourseCard from "./_components/adminCourseCard";

export default async function AdminCoursesPage() {
  const data = await AdminGetCourses();
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Courses</h1>
        <Link className={buttonVariants()} href="/admin/courses/create">
          Create Course
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((course) => (
          <AdminCourseCard data={course} key={course.id} />
        ))}
      </div>
    </>
  );
}
