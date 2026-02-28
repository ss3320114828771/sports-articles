'use client'

import { useState } from 'react'

interface ProductImagesProps {
  images: string[]
  productName: string
  onImageChange?: (index: number) => void
  className?: string
}

export default function ProductImages({
  images,
  productName,
  onImageChange,
  className = ''
}: ProductImagesProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })

  // Handle image selection
  const handleImageSelect = (index: number) => {
    setSelectedImage(index)
    setIsZoomed(false)
    if (onImageChange) {
      onImageChange(index)
    }
  }

  // Handle mouse move for zoom effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setZoomPosition({ x, y })
  }

  // Handle next image
  const handleNext = () => {
    const nextIndex = (selectedImage + 1) % images.length
    handleImageSelect(nextIndex)
  }

  // Handle previous image
  const handlePrevious = () => {
    const prevIndex = (selectedImage - 1 + images.length) % images.length
    handleImageSelect(prevIndex)
  }

  // If no images, show placeholder
  if (!images || images.length === 0) {
    return (
      <div className={`bg-white/10 rounded-2xl p-8 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <span className="text-8xl mb-4 block opacity-50">📷</span>
          <p className="text-gray-400">No image available</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Image Container */}
      <div
        className="relative aspect-square bg-gradient-to-br from-green-400/20 to-blue-500/20 
                   rounded-2xl overflow-hidden cursor-crosshair group"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        {/* Main Image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-8xl transition-all duration-300 
            ${isZoomed ? 'scale-150 opacity-50' : 'scale-100 opacity-70'}`}>
            📷
          </span>
        </div>

        {/* Zoom Lens */}
        {isZoomed && (
          <div
            className="absolute w-32 h-32 border-2 border-green-400 rounded-full
                       pointer-events-none shadow-lg"
            style={{
              left: `${zoomPosition.x}%`,
              top: `${zoomPosition.y}%`,
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(circle at ${zoomPosition.x}% ${zoomPosition.y}%, 
                          transparent 0%, rgba(0,0,0,0.3) 100%)`
            }}
          />
        )}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2
                       w-10 h-10 bg-black/50 rounded-full flex items-center 
                       justify-center text-white hover:bg-black/70 
                       transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              ←
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2
                       w-10 h-10 bg-black/50 rounded-full flex items-center 
                       justify-center text-white hover:bg-black/70 
                       transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              →
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/50 text-white 
                        text-sm px-3 py-1 rounded-full">
            {selectedImage + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-6 gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleImageSelect(index)}
              className={`aspect-square bg-gradient-to-br from-green-400/20 to-blue-500/20 
                         rounded-lg flex items-center justify-center border-2 
                         transition-all hover:scale-105
                         ${selectedImage === index 
                           ? 'border-green-400 scale-105' 
                           : 'border-transparent hover:border-green-400/50'}`}
              aria-label={`View image ${index + 1}`}
              aria-current={selectedImage === index}
            >
              <span className="text-2xl">📷</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}