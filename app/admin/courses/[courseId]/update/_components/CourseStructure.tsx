"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DndContext,
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
import React, { useState } from "react";
import { CSS } from "@dnd-kit/utilities";

export default function CourseStructure() {
  const [items, setItems] = useState([1, 2, 3]);

  function SortableItem(props) {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: props.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
    return (
      <div
        className="cursor-grab"
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      >
        {props.id}
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
              {items.map((id) => (
                <SortableItem key={id} id={id} />
              ))}
            </SortableContext>
          </CardContent>
        </Card>
      </DndContext>
    </>
  );
}
