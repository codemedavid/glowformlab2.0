import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  currentImage?: string | null;
  onImageChange: (imageUrl: string | undefined) => void;
  className?: string;
  folder?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  currentImage, 
  onImageChange, 
  className = '',
  folder = 'menu-images'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('❌ Please upload a valid image file (JPEG, PNG, WebP, or GIF)');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('❌ Image size must be less than 5MB');
      return;
    }

    // Convert image to base64 - this works without any setup!
    const reader = new FileReader();
    reader.onloadstart = () => setUploading(true);
    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        setUploadProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    reader.onload = () => {
      const base64String = reader.result as string;
      onImageChange(base64String);
      setUploading(false);
      setUploadProgress(0);
    };
    reader.onerror = () => {
      alert('❌ Failed to read image file');
      setUploading(false);
      setUploadProgress(0);
    };
    reader.readAsDataURL(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    onImageChange(undefined);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {currentImage ? (
        <div className="relative group">
          <img
            src={currentImage}
            alt="Preview"
            className="w-full max-w-2xl object-contain rounded-2xl border-2 border-sky-200 shadow-lg hover:shadow-xl transition-all"
            loading="lazy"
            decoding="async"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all"
            disabled={uploading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <div
          onClick={triggerFileSelect}
          className="w-full max-w-2xl border-2 border-dashed border-sky-300 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-sky-400 hover:bg-sky-50/50 transition-all duration-300 bg-gradient-to-br from-sky-50/30 to-blue-50/30"
        >
          {uploading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-200 border-t-sky-500 mx-auto mb-4"></div>
              <p className="text-base font-medium text-gray-700 mb-2">Uploading... {uploadProgress}%</p>
              <div className="w-48 bg-sky-100 rounded-full h-3 mt-3">
                <div 
                  className="bg-gradient-to-r from-sky-400 to-sky-500 h-3 rounded-full transition-all duration-300 shadow-sm"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <>
              <ImageIcon className="h-16 w-16 text-sky-400 mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">Click to upload COA image</p>
              <p className="text-sm text-gray-500 mb-1">or drag and drop</p>
              <p className="text-xs text-gray-400">JPEG, PNG, WebP (max 5MB)</p>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {!currentImage && (
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={triggerFileSelect}
            disabled={uploading}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="h-5 w-5" />
            <span>Choose File</span>
          </button>
          <span className="text-sm text-gray-500">or paste URL below</span>
        </div>
      )}

      {/* Optional URL Input */}
      {!currentImage && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Or paste an image URL (optional)
          </label>
          <input
            type="url"
            value={currentImage || ''}
            onChange={(e) => onImageChange(e.target.value || undefined)}
            className="input-field"
            placeholder="https://i.imgur.com/example.jpg"
            disabled={uploading}
          />
          <p className="text-xs text-gray-500 mt-1">
            If you have the image already hosted online
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;