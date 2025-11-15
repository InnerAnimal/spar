'use client'

import { useState, useCallback, useRef } from 'react'
import { X, Upload, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  onUpload: (files: File[]) => Promise<void>
  maxFiles?: number
  maxSizeMB?: number
  accept?: string
  disabled?: boolean
  existingImages?: Array<{ id: string; url: string; filename: string }>
  onRemoveExisting?: (imageId: string) => Promise<void>
}

export function ImageUpload({
  onUpload,
  maxFiles = 10,
  maxSizeMB = 10,
  accept = 'image/*',
  disabled = false,
  existingImages = [],
  onRemoveExisting,
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [previews, setPreviews] = useState<Array<{ file: File; preview: string }>>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): boolean => {
    const maxSize = maxSizeMB * 1024 * 1024
    if (file.size > maxSize) {
      setError(`File ${file.name} is too large. Max size is ${maxSizeMB}MB`)
      return false
    }
    if (!file.type.startsWith('image/')) {
      setError(`File ${file.name} is not an image`)
      return false
    }
    return true
  }

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return

      setError(null)
      const fileArray = Array.from(files)
      const totalImages = existingImages.length + previews.length + fileArray.length

      if (totalImages > maxFiles) {
        setError(`Maximum ${maxFiles} images allowed`)
        return
      }

      const validFiles = fileArray.filter(validateFile)
      const newPreviews = validFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }))

      setPreviews((prev) => [...prev, ...newPreviews])
    },
    [maxFiles, maxSizeMB, existingImages.length, previews.length]
  )

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (disabled) return

      handleFiles(e.dataTransfer.files)
    },
    [disabled, handleFiles]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    handleFiles(e.target.files)
  }

  const removePreview = (index: number) => {
    setPreviews((prev) => {
      const newPreviews = [...prev]
      URL.revokeObjectURL(newPreviews[index].preview)
      newPreviews.splice(index, 1)
      return newPreviews
    })
  }

  const handleUpload = async () => {
    if (previews.length === 0) return

    setUploading(true)
    setError(null)

    try {
      const files = previews.map((p) => p.file)
      await onUpload(files)

      // Clear previews after successful upload
      previews.forEach((p) => URL.revokeObjectURL(p.preview))
      setPreviews([])

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="w-full">
      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Current Images</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {existingImages.map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.url}
                  alt={image.filename}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
                {onRemoveExisting && (
                  <button
                    onClick={() => onRemoveExisting(image.id)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    type="button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <p className="text-xs text-gray-500 mt-1 truncate">{image.filename}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center text-center">
          <Upload className="w-12 h-12 text-gray-400 mb-3" />
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            PNG, JPG, GIF up to {maxSizeMB}MB (max {maxFiles} images)
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Preview Images */}
      {previews.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">
            Ready to Upload ({previews.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview.preview}
                  alt={preview.file.name}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removePreview(index)
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  type="button"
                  disabled={uploading}
                >
                  <X className="w-4 h-4" />
                </button>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {preview.file.name}
                </p>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={uploading || disabled}
            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? 'Uploading...' : `Upload ${previews.length} Image${previews.length > 1 ? 's' : ''}`}
          </button>
        </div>
      )}
    </div>
  )
}
