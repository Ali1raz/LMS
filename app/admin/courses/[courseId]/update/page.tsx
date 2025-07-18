import { AdminGetCourse } from "@/app/data/admin/get-course";
import { Tabs, TabsList } from "@/components/ui/tabs";
import { TabsContent, TabsTrigger } from "@radix-ui/react-tabs";
import UpdateCourseForm from "./_components/UpdateCourseForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Params = Promise<{ courseId: string }>;

export default async function UpdateCourse({ params }: { params: Params }) {
  const { courseId } = await params;
  const data = await AdminGetCourse(courseId);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Edit course: <p className="text-primary/90">{data.title}</p>
      </h1>

      <Tabs className="w-full" defaultValue="basic-info">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="course-structure">Course Structure</TabsTrigger>
        </TabsList>

        <TabsContent value="basic-info">
          <Card>
            <CardHeader>
              <CardTitle>Update Course</CardTitle>
              <CardDescription>
                Update the basic information of the course.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UpdateCourseForm data={data} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
