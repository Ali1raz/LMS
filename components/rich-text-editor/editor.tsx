"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Menubar from "./menubar";
import TextAlign from "@tiptap/extension-text-align";

export function RichTextEditor({ field }: { field: any }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    immediatelyRender: false,

    editorProps: {
      attributes: {
        class:
          "min-h-[200px] focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert",
      },
    },
    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()));
    },
    content: field.value ? JSON.parse(field.value) : "",
  });

  return (
    <div className="w-full border border-t-0 border-x-0 border-input rounded overflow-hidden dark:bg-input/20">
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
