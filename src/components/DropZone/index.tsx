import { useCallback } from 'react'
import { useDropzone, FileWithPath } from 'react-dropzone'

type Props = {
  onFilesDropped: (files: FileWithPath[]) => void
}

const DropZone = ({ onFilesDropped }: Props) => {
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    onFilesDropped(acceptedFiles)
  }, [onFilesDropped])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div
      className={`w-full p-4 border-2 border-dashed ${isDragActive ? 'border-blue-500' : 'border-gray-300'
        } rounded-lg flex flex-col items-center gap-4`}
      {...getRootProps()}
    >
      <input {...getInputProps()} type='file' />
      {isDragActive ? (
        <>
          <p className="text-blue-500">Drop your files here ...</p>
          <svg xmlns="http://www.w3.org/2000/svg" className='w-12 h-12 fill-blue-500' viewBox="0 0 24 24"><path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5c0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5l5 5h-3z"></path></svg>
          <sub>Only FIT files</sub>
        </>

      ) : (
        <>
          <p>Drag and drop a file here or click inside and search</p>
          <svg xmlns="http://www.w3.org/2000/svg" className='w-12 h-12 fill-gray-600' viewBox="0 0 24 24"><path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5c0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5l5 5h-3z"></path></svg>
          <sub>Only FIT files</sub>
        </>
      )}
    </div>
  )
}

export default DropZone