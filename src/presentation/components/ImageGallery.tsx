import { useState } from 'react';
import { VehicleImage } from '../../lib/api';

interface ImageGalleryProps {
  images: VehicleImage[];
}

export const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  const sortedImages = [...images].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
        <img
          src={selectedImage?.url}
          alt={`Vehicle ${selectedImage?.type} view`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-4">
        {sortedImages.map((image) => (
          <button
            key={image.id}
            onClick={() => setSelectedImage(image)}
            className={`relative aspect-square rounded-lg overflow-hidden ${
              selectedImage?.id === image.id
                ? 'ring-2 ring-blue-500'
                : 'hover:ring-2 hover:ring-blue-300'
            }`}
          >
            <img
              src={image.url}
              alt={`Vehicle ${image.type} view thumbnail`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}; 