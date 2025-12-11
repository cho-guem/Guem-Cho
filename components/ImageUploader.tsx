import React, { useCallback, useState } from 'react';
import { SUPPORTED_MIME_TYPES } from '../types';

interface ImageUploaderProps {
  onImageSelected: (base64: string) => void;
  selectedImage: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, selectedImage }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  }, [onImageSelected]);

  const processFile = (file: File) => {
    if (!SUPPORTED_MIME_TYPES.includes(file.type)) {
      alert('JPG, PNG, WebP 형식의 이미지만 지원됩니다.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onImageSelected(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="w-full">
      <label
        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden group
          ${isDragging 
            ? 'border-indigo-500 bg-indigo-500/10' 
            : 'border-slate-600 bg-slate-800/50 hover:border-indigo-400 hover:bg-slate-800'
          }
          ${selectedImage ? 'border-solid border-slate-600' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {selectedImage ? (
          <div className="relative w-full h-full">
            <img 
              src={selectedImage} 
              alt="Preview" 
              className="w-full h-full object-contain p-2" 
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
               <p className="text-white font-medium">사진 변경하기</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-400">
            <svg className={`w-12 h-12 mb-4 transition-colors duration-300 ${isDragging ? 'text-indigo-500' : 'text-slate-500'}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className="mb-2 text-sm"><span className="font-semibold text-indigo-400">클릭하여 업로드</span> 하거나 드래그 앤 드롭</p>
            <p className="text-xs text-slate-500">JPG, PNG, WebP (최대 10MB)</p>
          </div>
        )}
        <input 
          type="file" 
          className="hidden" 
          accept={SUPPORTED_MIME_TYPES.join(',')} 
          onChange={handleFileChange} 
        />
      </label>
    </div>
  );
};