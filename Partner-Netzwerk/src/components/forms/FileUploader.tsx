import React, { useState, useCallback } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'
import { Button } from '../ui/button'

type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl: string;
}

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState(mediaUrl);

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setFile(acceptedFiles);
    fieldChange(acceptedFiles);
    const newFileUrl = URL.createObjectURL(acceptedFiles[0]);
    setFileUrl(newFileUrl);
  }, [file]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpeg', '.jpg', '.svg'],
      'application/pdf': ['.pdf'],
      'video/mp4': ['.mp4'],
    },
  });

  return (
    <div {...getRootProps()} className='flex flex-center flex-col bg-ecurie-lightgrey dark:bg-dark-3 rounded-xl cursor-pointer'>
      <input {...getInputProps()} className='cursor-pointer' />
      {fileUrl && file.length > 0 ? (
        <>
          <div className='flex flex-1 justify-center w-full p-5 lg:p-10'>
            {file[0].type.startsWith('image/') ? (
              <img src={fileUrl} alt="uploaded" className='file_uploader-img' />
            ) : file[0].type === 'application/pdf' ? (
              <embed src={fileUrl} width="100%" height="500px" type="application/pdf" />
            ) : file[0].type === 'video/mp4' ? (
              <video width="100%" controls>
                <source src={fileUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : null}
          </div>
          <p className='file_uploader-label'>Zum Ersetzem das Bild hier einfügen</p>
        </>
      ) : (
        <div className='file_uploader-box'>
          <img src='/assets/icons/file-upload.svg' width={96} height={77} alt='file-upload' />
          <h3 className='base-medium text-light-2 mb-2 mt-6'>Hier Bild einfügen</h3>
          <p className='text-light-4 small-regular mb-6'>SVG, PNG, JPG, PDF, MP4</p>
          <Button className='shad-button_dark_4'>Datei auswählen</Button>
        </div>
      )}
    </div>
  )
}

export default FileUploader
