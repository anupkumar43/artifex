"use client";

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
        className="border-muted-foreground/40 relative flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-slate-50 p-10 text-center transition hover:bg-slate-100 dark:bg-slate-900/40 dark:hover:bg-slate-900/60"
      >
        <svg
          className="text-muted-foreground mb-3 h-10 w-10"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>

        <span className="text-muted-foreground text-sm font-semibold">
          Attach Image
        </span>
        <span className="text-muted-foreground mt-1 text-xs">
          or Drag &amp; Drop
        </span>
      </label>
    </div>
  );
};

export default Dropzone;
