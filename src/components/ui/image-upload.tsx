import { UploadCloud } from "lucide-react";
import { Button } from "./button";
import { useState } from "react";
import { validateImageUrl } from '@/lib/utils/image';

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  onUpload: (file: File) => Promise<void>;
  disabled?: boolean;
}

export function ImageUpload({
  value,
  onChange,
  onUpload,
  disabled,
}: ImageUploadProps) {
  const [imageErrors, setImageErrors] = useState<{[key: number]: boolean}>({});
  
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onUpload(file);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {value.map((url, index) => (
          <div key={index} className="relative h-24 w-24">
            {validateImageUrl(url) && !imageErrors[index] ? (
              <img
                src={url}
                alt={`Pet ${index + 1}`}
                className="h-full w-full rounded-md object-cover"
                onError={() => {
                  console.warn(`Failed to load image at index ${index}:`, url);
                  setImageErrors(prev => ({ ...prev, [index]: true }));
                }}
              />
            ) : (
              <div className="h-full w-full rounded-md bg-gray-200 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 640 512"
                >
                  <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
                </svg>
              </div>
            )}
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -right-2 -top-2 h-6 w-6 rounded-full p-0"
              onClick={() => onChange(value.filter((_, i) => i !== index))}
              disabled={disabled}
            >
              ×
            </Button>
          </div>
        ))
      </div>
      <label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={disabled}
        >
          <UploadCloud className="mr-2 h-4 w-4" />
          Upload Image
        </Button>
      </label>
    </div>
  );
}