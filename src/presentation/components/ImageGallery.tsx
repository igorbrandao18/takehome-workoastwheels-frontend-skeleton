import { useState } from 'react';

interface Image {
  id: string;
  url: string;
  type: string;
  order: number;
}

interface ImageGalleryProps {
  images: Image[];
}

export const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(images[0]?.url);

  if (!images.length) {
    return (
      <div className="bg-gray-100 rounded-lg flex items-center justify-center h-96">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  // Sort images by order
  const sortedImages = [...images].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={selectedImage || sortedImages[0].url}
          alt="Vehicle"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-4 gap-2">
        {sortedImages.map((image) => (
          <button
            key={image.id}
            onClick={() => setSelectedImage(image.url)}
            className={`relative aspect-square rounded-lg overflow-hidden ${
              selectedImage === image.url
                ? 'ring-2 ring-blue-500'
                : 'hover:ring-2 hover:ring-gray-300'
            }`}
          >
            <img
              src={image.url}
              alt={`Vehicle ${image.type}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}; 