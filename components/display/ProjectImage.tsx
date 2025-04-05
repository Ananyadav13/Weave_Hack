
import { useState } from 'react';

interface ProjectImageProps {
  fileId: string;
  name: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function ProjectImage({ 
  fileId, 
  name, 
  alt, 
  width = 300, 
  height = 200,
  className = ''
}: ProjectImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const imageUrl = `/api/project-images/${fileId}`;
  
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-pulse">Loading...</div>
        </div>
      )}
      
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-red-500">Failed to load image</div>
        </div>
      ) : (
        <img
          src={imageUrl}
          alt={alt || name}
          className={`object-cover w-full h-full ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setError(true);
          }}
        />
      )}
    </div>
  );
}
