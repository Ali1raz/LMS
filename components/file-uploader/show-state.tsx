import { cn } from "@/lib/utils";
import { CloudUpload, ImageIcon } from "lucide-react";
import { Button } from "../ui/button";

interface IShowState {
  isDragActive: boolean;
}

export function ShowEmptyState({ isDragActive }: IShowState) {
  return (
    <div className="text-center space-y-2">
      <div className="flex items-center justify-center mx-auto">
        <CloudUpload
          className={cn(
            "size-6 text-muted-foreground",
            isDragActive && "text-primary"
          )}
        />
      </div>
      <p className="text-foreground">
        Drag your file here or{" "}
        <span className="text-primary font-bold cursor-pointer">
          click to upload
        </span>
      </p>

      <Button type="button" className="mt-4">
        Select File
      </Button>
    </div>
  );
}

export function ShowErrorState() {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center size-12 mx-auto rounded-full bg-destructive/20 mb-4">
        <ImageIcon className="size-6 mx-auto" />
      </div>

      <p className="text-base font-semibold">Upload Failed</p>
      <p className="text-xs">Something went wrong</p>
      <Button type="button" className="mt-4">
        Click or drag file to retry
      </Button>
    </div>
  );
}
