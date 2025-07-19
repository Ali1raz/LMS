"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DndContext,
  DraggableSyntheticListeners,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React, { ReactNode, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { AdminSingleCourseType } from "@/app/data/admin/get-course";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  GripVertical,
  Trash2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface iAppProps {
  data: AdminSingleCourseType;
}

interface SortableItemsProps {
  id: string;
  children: (listern: DraggableSyntheticListeners) => ReactNode;
  className?: string;
  data: {
    type: "chapter" | "lesson";
    chapterId?: string;
  };
}

export default function CourseStructure({ data }: iAppProps) {
  const initialItems = data.chapters.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    order: chapter.position,
    isOpen: true,
    lessons: chapter.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      order: lesson.position,
    })),
  }));

  const [items, setItems] = useState(initialItems);

  function SortableItem({ children, id, className, data }: SortableItemsProps) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: id, data: data });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={cn("touch-none", className, isDragging ? "z-10" : "")}
      >
        {children(listeners)}
      </div>
    );
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  function toggleChapter(chapterId: string) {
    setItems(
      items.map((chapter) =>
        chapter.id === chapterId
          ? { ...chapter, isOpen: !chapter.isOpen }
          : chapter
      )
    );
  }

  return (
    <>
      <DndContext
        collisionDetection={rectIntersection}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <Card>
          <CardHeader className="flex flex-row border-border border-b items-center justify-between">
            <CardTitle>Chapters</CardTitle>
          </CardHeader>

          <CardContent>
            <SortableContext
              strategy={verticalListSortingStrategy}
              items={items}
            >
              {items.map((item) => (
                <SortableItem
                  id={item.id}
                  data={{ type: "chapter" }}
                  key={item.id}
                >
                  {(listeners) => (
                    <Card>
                      <Collapsible
                        open={item.isOpen}
                        onOpenChange={() => toggleChapter(item.id)}
                      >
                        <div className="p-3 flex items-center justify-between border-border border-b">
                          <div className="flex gap-1 items-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-50 hover:opacity-100"
                              {...listeners}
                            >
                              <GripVertical className="size-4" />
                            </Button>
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost">
                                {item.isOpen ? (
                                  <ChevronDown />
                                ) : (
                                  <ChevronRight />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                            <p className="cursor-pointer pl-1">{item.title}</p>
                          </div>
                          <Button variant="destructive" size="icon">
                            <Trash2Icon />
                          </Button>
                        </div>

                        <CollapsibleContent>
                          <SortableContext
                            items={item.lessons.map((lesson) => lesson.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {item.lessons.map((lesson) => (
                              <SortableItem
                                key={lesson.id}
                                id={lesson.id}
                                data={{ type: "lesson", chapterId: item.id }}
                              >
                                {(lessonListeners) => (
                                  <div className="flex items-center justify-between p-2 hover:bg-accent rounded-sm">
                                    <div className="flex items-center p-2 gap-2">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        {...lessonListeners}
                                      >
                                        <GripVertical />
                                      </Button>
                                      <FileText className="size-4" />
                                      <Link
                                        href={`/admin/courses/${data.id}/${item.id}/${lesson.id}`}
                                      >
                                        {lesson.title}
                                      </Link>
                                    </div>
                                    <Button variant="outline" size="icon">
                                      <Trash2Icon />
                                    </Button>
                                  </div>
                                )}
                              </SortableItem>
                            ))}
                          </SortableContext>
                          <div className="p-2">
                            <Button variant="outline" className="w-full">
                              Create new Lesson
                            </Button>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>
                  )}
                </SortableItem>
              ))}
            </SortableContext>
          </CardContent>
        </Card>
      </DndContext>
    </>
  );
}
