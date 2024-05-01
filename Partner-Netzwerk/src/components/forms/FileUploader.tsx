import React, { useState, useCallback } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'
import { Button } from '../ui/button'

// Interface for props passed to the FileUploader component
type FileUploaderProps = {
  fieldChange: (FILES: File[]) => void; // Function to handle file selection changes
  mediaUrl: string; // Optional initial media URL to display (e.g., for pre-filled images)
}

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  // State variables
  const [file, setFile] = useState<File[]>([]); // Array to store selected files
  const [fileUrl, setFileUrl] = useState(mediaUrl); // URL of the displayed image

  // Callback function for handling file drops
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setFile(acceptedFiles); // Update state with dropped files
    fieldChange(acceptedFiles); // Call prop function to handle changes on parent component
    const newFileUrl = URL.createObjectURL(acceptedFiles[0]); // Generate URL for preview
    setFileUrl(newFileUrl); // Update state with preview URL
  }, [file]); // Ensure callback doesn't trigger unnecessary re-renders

  // Destructure props from useDropzone hook
  const { getRootProps, getInputProps } = useDropzone({
    onDrop, // Callback function to handle file drops
    accept: { // Accepted file types
      'image/*': ['.png', '.jpeg', '.jpg', '.svg'],
    },
  });

  return (
    <div
      {...getRootProps()} // Spread props for root dropzone element
      className='flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer'
    >
      <input {...getInputProps()} className='cursor-pointer' /> {/* Hidden input for file selection */}
      {fileUrl ? ( // Conditionally render content based on file selection
        <>
          <div className='flex flex-1 justify-center w-full p-5 lg:p-10'>
            <img src={fileUrl} alt="image" className='file_uploader-img' /> {/* Display uploaded image */}
          </div>
          <p className='file_uploader-label'>Click or drag photo to replace</p> {/* Instruction for replacing image */}
        </>
      ) : (
        <div className='file_uploader-box'> {/* Default content before file selection */}
          <img
            src='/assets/icons/file-upload.svg'
            width={96}
            height={77}
            alt='file-upload'
          />
          <h3 className='base-medium text-light-2 mb-2 mt-6'>Drag Photo here</h3>
          <p className='text-light-4 small-regular mb-6'>SVG, PNG, JPG</p>
          <Button className='shad-button_dark_4'>Select from Computer</Button> {/* Button for manual file selection */}
        </div>
      )}
    </div>
  )
}

export default FileUploader
