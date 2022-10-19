import Image from 'next/image';
import React, { useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';

const fileTypes = ["JPG", "JPEG", "PNG", "GIF"];

interface UploadProps {
  enabled: boolean;
  onUploadComplete: (cid: string, objectURI?: string) => void;
  onError: (message: string) => void;
}

function Upload({ enabled, onUploadComplete, onError }: UploadProps) {
  const [file, setFile] = useState<File>();
  const [objectURI, setObjectURI] = useState<string>();
  const [uploadState, setUploadState] = useState<string>("select");

  const handleChange = async (file: File) => {
    setFile(file);
    const dataURI = URL.createObjectURL(file);
    setObjectURI(dataURI);
    setUploadState("uploading");

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    setUploadState("finished");
    const body = (await response.json()) as {
      status: "ok" | "fail";
      message: string;
      cid: string;
    };
    if (body.status === "ok") {
      onUploadComplete(body.cid, dataURI);
    } else {
      onError(body.message);
    }
  };

  const border = enabled ? "border-violet-600" : "border-neutral-400";

  return (
    <div className="relative">
      <FileUploader
        handleChange={handleChange}
        name="file"
        types={fileTypes}
        disabled={!enabled}
      >
        <div
          className={`border-2 border-dashed ${border} rounded-xl bg-neutral-100`}
        >
          <div className="p-16 text-center cursor-pointer">
            {uploadState === "select" && !enabled && (
              <p className="text-neutral-400">Connect wallet to mint</p>
            )}
            {uploadState === "select" && enabled && (
              <div>
                <div className="text-violet-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-10 h-10 mx-auto"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                </div>
                <p>Drag & drop an image to upload</p>
                <p className="text-violet-600 font-bold">or click to browse</p>
              </div>
            )}
            {["finished", "uploading"].includes(uploadState) && (
              <div>
                <p>
                  {objectURI && (
                    <div className="w-24 h-24 relative mx-auto">
                      <Image
                        src={objectURI}
                        alt="Image preview"
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  )}
                </p>
                <p>{file && file.name}</p>
                <p className="font-bold text-violet-600">
                  {uploadState === "uploading"
                    ? "Uploading to IPFS..."
                    : "File saved."}
                </p>
              </div>
            )}
          </div>
        </div>
      </FileUploader>
    </div>
  );
}

export default Upload;
