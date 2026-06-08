/* eslint-disable prettier/prettier */
import { getUser } from "@/lib/session";
import { uploadFile } from "@/api/upload";
import { getGlueStatus } from "@/api/glueStatus";
import { useState } from "react";
import { Upload, FileSpreadsheet, X, CheckCircle2, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";

type UploadedFile = {
  name: string;
  size: number;
  uploadedAt: string;
  type: string;
};

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [featureEngineering, setFeatureEngineering] = useState(false);
  const [featureStatus, setFeatureStatus] =
  useState<"PROCESSING" | "COMPLETED" | "FAILED">(
    "PROCESSING"
  );
  const [history, setHistory] =
  useState<UploadedFile[]>([]);
const onFile = (f: File | null) => {
  if (!f) return;
  setFile(f);
};

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onFile(f);
  };

const upload = async () => {
  if (!file) return;

  const user = getUser();

  if (!user?.user_id) {
    toast.error("Please sign in first");
    return;
  }

  try {
    setUploading(true);

    const result = await uploadFile(
     user.user_id,
      file
    );

    console.log(
      "Upload Result:",
      result
    );

    setHistory((h) => [
      {
        name: file.name,
        size: file.size,
        uploadedAt: "just now",
        type: "Product catalog",
      },
      ...h,
    ]);

    toast.success(
      "Dataset uploaded successfully"
    );
    setFeatureStatus("PROCESSING");
    setFeatureEngineering(true);

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

          if (status.status === "SUCCEEDED") {
  clearInterval(interval);

  
setFeatureStatus("COMPLETED");

toast.success(
  "Feature Engineering Completed"
);
}

          if (
            status.status ===
            "FAILED"
          ) {
            clearInterval(
              interval
            );
setFeatureStatus("FAILED");

toast.error(
  "Feature Engineering Failed"
);
          }
        } catch (error) {
          console.error(
            error
          );

          clearInterval(
            interval
          );
        }
      },
      5000
    );

    setFile(null);
    setUploading(false);
  } catch (error) {
    console.error(error);

    setUploading(false);

    toast.error(
      "Upload failed"
    );
  }
};

return (
  <>
    {featureEngineering && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        <div className="rounded-xl bg-card p-8 text-center shadow-xl">
<h2
  className={`text-xl font-semibold ${
    featureStatus === "COMPLETED"
      ? "text-green-500"
      : featureStatus === "FAILED"
      ? "text-red-500"
      : ""
  }`}
>
  {featureStatus === "PROCESSING" &&
    "Feature Engineering in Progress"}

  {featureStatus === "COMPLETED" &&
    "Feature Engineering Completed"}

  {featureStatus === "FAILED" &&
    "Feature Engineering Failed"}
</h2>

<p className="mt-3 text-sm text-muted-foreground">
  {featureStatus === "PROCESSING" &&
    "Please wait while the dataset is being processed."}

  {featureStatus === "COMPLETED" &&
    "Feature engineering completed successfully. You can now continue."}

  {featureStatus === "FAILED" &&
    "Feature engineering failed. Please try again."}
</p>
          {featureStatus !== "PROCESSING" && (
  <Button
    className="mt-4"
    onClick={() => {
      setFeatureEngineering(false);
    }}
  >
    OK
  </Button>
)}
        </div>
      </div>
    )}
    <div className="space-y-6 pt-8 pb-12">
      <PageHeader
        eyebrow="Data"
        title="Upload Data"
        description="Import your product catalog, pricing, or inventory files to keep PriceAI in sync with your business."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-gradient-card p-6 shadow-elevated">
            <h2 className="text-base font-semibold">Upload a new file</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              CSV or Excel — include SKUs, prices, costs, and stock levels.
            </p>

            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={`mt-5 group relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 text-center transition ${
                dragOver
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card-elevated/40 hover:border-primary hover:bg-card-elevated"
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
                <Upload className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium">Drop your file here or click to browse</p>
                <p className="text-xs text-muted-foreground">.csv, .xlsx — up to 50MB</p>
              </div>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0] ?? null)}
              />
            </label>

            {file && (
              <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-card-elevated/60 p-3">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setFile(null)} disabled={!file}>
                Clear
              </Button>
              <Button
                size="sm"
                onClick={upload}
                disabled={!file || uploading}
                className="bg-gradient-primary text-primary-foreground hover:opacity-90"
              >
                {uploading ? "Uploading..." : "Upload file"}
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-gradient-card p-6 shadow-elevated">
<div className="flex items-center justify-between">
  <div>
    <h2 className="text-base font-semibold">
      Recent uploads
    </h2>
    <p className="text-xs text-muted-foreground">
      Files you've uploaded recently.
    </p>
  </div>

  <Button
    variant="outline"
    size="sm"
    onClick={() => setHistory([])}
  >
    Clear History
  </Button>
</div>
            <div className="mt-4 divide-y divide-border rounded-lg border border-border">
              {history.map((h) => (
                <div key={h.name + h.uploadedAt} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">{h.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {h.type} · {(h.size / 1024).toFixed(1)} KB · {h.uploadedAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
                      <CheckCircle2 className="h-3 w-3" /> Processed
                    </span>
                  </div>
                </div>
              ))}
              {history.length === 0 && (
                <div className="px-4 py-6 text-center text-xs text-muted-foreground">
                  No uploads yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-gradient-card p-6 shadow-elevated">
            <h3 className="text-sm font-semibold">File format guide</h3>
            <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
              <li>• Required: <span className="text-foreground">sku, name, price, cost, stock</span></li>
              <li>• Optional: <span className="text-foreground">region, category, competitor_price</span></li>
              <li>• First row should contain column headers</li>
              <li>• Use UTF-8 encoding for CSV files</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-gradient-card p-6 shadow-elevated">
            <h3 className="text-sm font-semibold">Templates</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Download a starter template to format your data correctly.
            </p>
            <div className="mt-3 space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                <Download className="h-3.5 w-3.5" /> Product catalog template
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                <Download className="h-3.5 w-3.5" /> Inventory template
              </Button>
            </div>
          </div>
        </div>
      </div>
        </div>
  </>
);
}
