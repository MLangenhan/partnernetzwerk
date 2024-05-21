import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

import { convertFileToUrl } from "@/lib/utils"; // Utility function to convert file to URL

type ProfileUploaderProps = {
  fieldChange: (files: File[]) => void; // Function to handle file selection change
  mediaUrl: string; // Initial media URL for the profile picture
};

const ProfileUploader = ({ fieldChange, mediaUrl }: ProfileUploaderProps) => {
  const [file, setFile] = useState<File[]>([]); // Array to store selected files
  const [fileUrl, setFileUrl] = useState<string>(mediaUrl); // Stores the URL of the selected file (or initial mediaUrl)

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      // Update selected files and trigger field change handler with the new files
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);

      // Assuming convertFileToUrl returns a URL based on the file
      setFileUrl(convertFileToUrl(acceptedFiles[0]));
    },
    [file] // Only recreate onDrop if file state changes (to avoid unnecessary updates)
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"], // Accept only image files with specified extensions
    },
  });

  return (
    <div {...getRootProps()}>  {/* Apply props from getRootProps for drag/drop functionality */}
      <input {...getInputProps()} className="cursor-pointer" /> {/* Hidden input for file selection */}

      <div className="cursor-pointer flex-center gap-4">
        <img
          src={fileUrl || "/assets/icons/profile-placeholder.svg"}
          alt="image"
          className="h-24 w-24 rounded-full object-cover object-center"
        />
        <p className="text-primary-500 small-regular md:bbase-semibold">
          Change profile photo
        </p>
      </div>
    </div>
  );
};

export default ProfileUploader;
