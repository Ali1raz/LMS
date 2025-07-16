"use client";

import React, { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { ShowEmptyState, ShowErrorState } from "./show-state";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { file } from "zod";

type FileState = {
  id: string | null;
  file: File | null;
  isUploading: boolean;
  isDeleting: boolean;
  progress: number;
  error: boolean;
  key?: string;
  objectUrl?: string;
  fileType: "image" | "video";
};

export default function Uploader() {
  const [fileState, setFileState] = useState<FileState>({
    id: null,
    file: null,
    isUploading: false,
    isDeleting: false,
    progress: 0,
    error: false,
    fileType: "image",
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      setFileState({
        id: uuidv4(),
        file: file,
        isUploading: false,
        isDeleting: false,
        progress: 0,
        error: false,
        objectUrl: URL.createObjectURL(file),
        fileType: "image",
      });

      uploadFile(file);
    }
  }, []);

  async function uploadFile(file: File) {
    console.log("uploaded file:", file);
    setFileState((prev) => ({
      ...prev,
      isUploading: true,
      progress: 0,
    }));

    try {
      // get presigned url
      const preSignedResponse = await fetch("/api/s3/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          size: file.size,
          isImage: true,
        }),
      });
      if (!preSignedResponse.ok) {
        toast.error("Failed to get presigned URL");
        setFileState((prev) => ({
          ...prev,
          error: true,
          isUploading: false,
          progress: 0,
        }));
        return;
      }

      const { preSignedUrl, key } = await preSignedResponse.json();

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            setFileState((prev) => ({
              ...prev,
              progress: Math.round(percentComplete),
            }));
          }
        };

        xhr.onload = () => {
          console.log("Upload complete:", xhr.status);
          console.log("Response text:", xhr.responseText);
          if (xhr.status === 200 || xhr.status === 204) {
            setFileState((prev) => ({
              ...prev,
              progress: 100,
              isUploading: false,
              error: false,
              key,
            }));
            toast.success("File uploaded successfully");
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => {
          console.log(xhr.responseText, xhr.status);
          toast.error("Upload failed");
          reject(new Error("Upload failed"));
        };

        xhr.open("PUT", preSignedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
    } catch {
      toast.error("Something went wrong");
      setFileState((prev) => ({
        ...prev,
        error: true,
        isUploading: false,
        progress: 0,
      }));
    }
  }

  function dropRejection(rejectedFiles: FileRejection[]) {
    if (rejectedFiles.length) {
      const tooManyFiles = rejectedFiles.find(
        (rejection) => rejection.errors[0].code === "too-many-files"
      );

      if (tooManyFiles) {
        toast.error("Error too many files, only one file is allowed.");
      }
    }

    const fileTooLarge = rejectedFiles.find(
      (rej) => rej.errors[0].code === "file-too-large"
    );

    if (fileTooLarge) {
      toast.error("File size too large");
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxSize: 1024 * 1024 * 5,
    maxFiles: 1,
    multiple: false,
    onDropRejected: dropRejection,
  });

  function renderContent() {
    if (fileState.isUploading) {
      return <h1>uploading...</h1>;
    }
    if (fileState.error) {
      return <ShowErrorState />;
    }

    if (fileState.objectUrl) {
      return <h1>File uploaded...</h1>;
    }
    return <ShowEmptyState isDragActive={isDragActive} />;
  }

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative w-full border-2 border-dashed h-48 transition-colors duration-100 ease-in-out",
        isDragActive
          ? "border-primary bg-primary/30 border-solid"
          : "border-border hover:border-primary"
      )}
    >
      <CardContent className="flex items-center justify-center p-2 h-full w-full">
        <input {...getInputProps()} />
        {/* <ShowEmptyState isDragActive={isDragActive} /> */}
        {/* <ShowErrorState /> */}
        {renderContent()}

        {fileState.objectUrl && (
          <img
            src={fileState.objectUrl}
            alt="Preview"
            className="w-24 h-24 object-cover rounded"
          />
        )}
      </CardContent>
    </Card>
  );
}
