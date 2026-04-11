"use client";

import { useRef, useState } from "react";

interface DropzoneProps {
  onFile: (file: File) => void;
  loading: boolean;
}

export default function Dropzone({ onFile, loading }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [selected, setSelected] = useState<File | null>(null);

  function handleFile(file: File) {
    setSelected(file);
    onFile(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf") handleFile(file);
  }

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] px-8">
      <div className="w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Upload your syllabus</h2>
        <p className="text-gray-500 text-sm mb-6">Drop a PDF and SyllabAI will extract every deadline</p>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`w-full border-2 border-dashed rounded-2xl p-12 flex flex-col items-center gap-3 cursor-pointer transition-all
            ${dragging
              ? "border-indigo-500 bg-indigo-50"
              : "border-gray-300 bg-white hover:border-indigo-400 hover:bg-gray-50"
            }`}
        >
          <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center">
            <svg className="w-7 h-7 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>

          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">
              {selected ? selected.name : "Drop PDF here or click to browse"}
            </p>
            <p className="text-xs text-gray-400 mt-1">Only .pdf files are supported</p>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>

        {/* Upload button — only visible once a file is selected */}
        {selected && (
          <button
            type="button"
            disabled={loading}
            className="mt-4 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onFile(selected)}
          >
            {loading ? "Analyzing syllabus…" : "Analyze Syllabus"}
          </button>
        )}
      </div>
    </div>
  );
}
