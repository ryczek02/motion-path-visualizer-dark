
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface FileUploaderProps {
  onDataParsed: (data: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onDataParsed }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsUploading(true);
      setFileName(file.name);

      const reader = new FileReader();
      reader.onload = () => {
        try {
          const csvContent = reader.result as string;
          onDataParsed(csvContent);
          toast.success(`Successfully imported ${file.name}`);
        } catch (error) {
          toast.error("Error parsing CSV file");
          console.error("CSV parsing error:", error);
        } finally {
          setIsUploading(false);
        }
      };

      reader.onerror = () => {
        toast.error("Error reading file");
        setIsUploading(false);
      };

      reader.readAsText(file);
    },
    [onDataParsed]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    maxFiles: 1,
  });

  return (
    <Card className="bg-secondary/40 border-secondary/60">
      <CardContent className="p-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
            isDragActive
              ? "border-primary bg-primary/10"
              : "border-secondary hover:border-primary/50"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-4">
            {fileName ? (
              <>
                <FileCheck
                  className="h-12 w-12 text-primary animate-pulse-glow"
                  strokeWidth={1.5}
                />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Loaded file:
                  </p>
                  <p className="text-foreground font-medium">{fileName}</p>
                </div>
              </>
            ) : (
              <>
                <Upload
                  className={`h-12 w-12 ${
                    isDragActive ? "text-primary" : "text-muted-foreground"
                  }`}
                  strokeWidth={1.5}
                />
                <div>
                  <p className="font-medium mb-1">
                    {isDragActive
                      ? "Drop the file here"
                      : "Drag CSV file here or click to browse"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    The CSV should contain motion data columns: 
                    timestamp, accel_x, accel_y, accel_z, gyro_x, gyro_y, gyro_z
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {fileName && (
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setFileName(null);
              }}
            >
              Upload a different file
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUploader;
