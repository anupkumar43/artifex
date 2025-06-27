"use client";

import { ImagePlus } from "lucide-react";

const Dropzone = ({
  setSelectedImage,
}: {
  setSelectedImage: (file?: File) => void;
}) => {
  return (
    <div className="w-full">
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => setSelectedImage(e.target.files?.[0])}
      />

      <label
        htmlFor="file-upload"
        className="group border-muted-foreground/40 relative flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-slate-50 p-10 text-center shadow-sm transition hover:bg-slate-100 dark:bg-slate-900/40 dark:hover:bg-slate-900/60"
      >
        <div className="text-muted-foreground mb-4 rounded-full bg-slate-200 p-3 transition group-hover:bg-slate-300 dark:bg-slate-800 dark:group-hover:bg-slate-700">
          <ImagePlus className="h-8 w-8" />
        </div>

        <p className="text-muted-foreground text-base font-semibold">
          Upload an Image
        </p>
        <p className="text-muted-foreground mt-1 text-xs">
          Click to browse files
        </p>
      </label>
    </div>
  );
};

export default Dropzone;
