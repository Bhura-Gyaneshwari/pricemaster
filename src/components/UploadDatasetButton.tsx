/* eslint-disable prettier/prettier */
import { getUser } from "@/lib/session";
import { uploadFile } from "@/api/upload";
import { getGlueStatus } from "@/api/glueStatus";
import { useRef, useState } from "react";
import {
  Upload,
  FileSpreadsheet,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const MAX_BYTES = 50 * 1024 * 1024; // 50MB
const ACCEPTED = [".csv", ".xlsx", ".xls"];

type Status = "success" | "error" | "uploading";
type RecentUpload = {
  name: string;
  size: number;
  uploadedAt: Date;
  status: Status;
};

function formatTime(d: Date) {
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString();
}

function validate(f: File): string | null {
  const ext = "." + f.name.split(".").pop()?.toLowerCase();
  if (!ACCEPTED.includes(ext)) return "Only .csv and .xlsx files are supported.";
  if (f.size > MAX_BYTES) return "File too large. Maximum size is 50MB.";
  if (f.size === 0) return "File is empty.";
  return null;
}

export function UploadDatasetButton({ onUploaded }: { onUploaded?: () => void }) {
  const [open, setOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [recent, setRecent] = useState<RecentUpload[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setFile(null);
    setError(null);
    setSuccess(false);
    setUploading(false);
  };

  const handleFile = (f: File | null | undefined) => {
    if (!f) return;
    setSuccess(false);
    const err = validate(f);
    if (err) {
      setError(err);
      setFile(null);
      toast.error(err);
      return;
    }
    setError(null);
    setFile(f);
  };

 const upload = async () => {
  if (!file) return;
  const user = getUser();

if (!user?.email) {
  toast.error("Please sign in first");
  return;
}

  try {
    setUploading(true);
    setError(null);

const result = await uploadFile(
  user.email,
  file
);

    console.log(
      "Upload Result:",
      result
    );

    setUploading(false);
    setSuccess(true);

    const entry: RecentUpload = {
      name: file.name,
      size: file.size,
      uploadedAt: new Date(),
      status: "success",
    };

    setRecent((r) =>
      [entry, ...r].slice(0, 5)
    );

    toast.success(
      "Dataset uploaded successfully"
    );

    onUploaded?.();
    const interval = setInterval(
  async () => {
    try {
      const status =
        await getGlueStatus(
          "price-optimization-job"
        );

      console.log(
        "Glue Status:",
        status
      );

      if (
        status.status ===
        "SUCCEEDED"
      ) {
        clearInterval(interval);

        toast.success(
          "Feature Engineering Completed"
        );
      }

      if (
        status.status === "FAILED"
      ) {
        clearInterval(interval);

        toast.error(
          "Feature Engineering Failed"
        );
      }
    } catch (error) {
      console.error(error);

      clearInterval(interval);
    }
  },
  5000
);

    setTimeout(() => {
      setOpen(false);
      reset();
    }, 1200);
  } catch (error) {
    console.error(error);

    setUploading(false);

    setError(
      "Failed to upload file"
    );

    toast.error(
      "Upload failed"
    );
  }
};
  return (
    <>
      <Button
        size="sm"
        onClick={() => setOpen(true)}
        className="group relative overflow-hidden bg-gradient-primary text-primary-foreground shadow-glow transition-all hover:scale-[1.02] hover:shadow-elevated"
      >
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        <Upload className="h-4 w-4" />
        Upload Dataset
      </Button>

      <Dialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) reset();
        }}
      >
        <DialogContent className="max-w-xl border-border bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Upload Dataset
            </DialogTitle>
            <DialogDescription>
              Upload a CSV or Excel file to refresh your dashboard analytics.
            </DialogDescription>
          </DialogHeader>

          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFile(e.dataTransfer.files?.[0]);
            }}
            className={`group relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-all ${
              dragOver
                ? "scale-[1.01] border-primary bg-primary/10"
                : "border-border bg-card-elevated/40 hover:border-primary/60 hover:bg-card-elevated"
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary shadow-glow transition-transform group-hover:scale-110">
              <Upload className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">
                Drop your file here or <span className="text-primary">click to browse</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Supports .csv, .xlsx — up to 50MB
              </p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </label>

          {file && !success && (
            <div className="flex items-center justify-between rounded-lg border border-border bg-card-elevated/60 p-3 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-3 min-w-0">
                <FileSpreadsheet className="h-5 w-5 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              {!uploading && (
                <button
                  onClick={() => setFile(null)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-lg border border-success/40 bg-success/10 p-3 text-sm text-success animate-in fade-in zoom-in-95">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Upload complete — analytics refreshing…</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setOpen(false);
                reset();
              }}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={upload}
              disabled={!file || uploading || success}
              className="bg-gradient-primary text-primary-foreground hover:opacity-90"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Uploading…
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="h-4 w-4" /> Uploaded
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" /> Upload
                </>
              )}
            </Button>
          </div>

          {recent.length > 0 && (
            <div className="mt-2 border-t border-border pt-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> Recent uploads
              </div>
              <div className="space-y-1.5">
                {recent.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-md border border-border/60 bg-card-elevated/40 px-3 py-2 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileSpreadsheet className="h-3.5 w-3.5 shrink-0 text-primary" />
                      <span className="truncate font-medium">{r.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span>{formatTime(r.uploadedAt)}</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-1.5 py-0.5 text-success">
                        <CheckCircle2 className="h-3 w-3" /> Success
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}