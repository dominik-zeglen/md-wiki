import React, { useRef, useState } from "react";
import { useLayout } from "src/Layouts";
import { trpc } from "./api/trpc";

export function useUpload(onCompleted: () => void) {
  const [, setLayout] = useLayout();
  const [uploadedUrl, setUploadedUrl] = useState("");

  const s3Settings = trpc.site.s3.useQuery(undefined);
  const inputRef = useRef<HTMLInputElement>();
  const getUploadLink = trpc.upload.useMutation({
    onSuccess: async ({ url, file }) => {
      await fetch(url, {
        method: "PUT",
        body: inputRef.current!.files![0]!,
      });
      setUploadedUrl(file);
      onCompleted();
    },
    onSettled: () => {
      setLayout({ loading: false });
    },
  });

  const onUpload = () => inputRef.current?.click();
  const canUpload = !!s3Settings.data?.bucket;

  React.useEffect(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.setAttribute("style", "display: none");
    input.onchange = (event: any) => {
      if (event.target.files?.length) {
        setLayout({ loading: true });
        getUploadLink.mutate(inputRef.current!.files![0]!.type);
      }
    };
    inputRef.current = input;
    document.body.appendChild(input);

    return () => {
      document.removeChild(input);
    };
  }, []);

  return {
    uploadedUrl,
    canUpload,
    onUpload,
  };
}
