import React, { useState, useEffect } from 'react';

const banners = [
  {
    src: 'https://i.ibb.co/yFYpkNXN/2-img-1915875354-1747434047-b0f62c051926174d7d497230bd0941e51747434047-1920-1920.webp',
    alt: 'Banner promocional de camisetas de time'
  },
  {
    src: 'https://i.ibb.co/4wPmXqnh/2-slide-1747433565035-7669203113-93be0884a503f4ebddd1a85d97f98e101747433568-640-0.webp',
    alt: 'Banner de nova coleção de camisetas'
  }
];

const HeroBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full container mx-auto px-4 pt-4">
      <div className="relative w-full aspect-[2/1] md:aspect-[3/1] lg:aspect-[4/1] overflow-hidden rounded-xl shadow-lg">
        {banners.map((banner, index) => (
          <img
            key={index}
            src={banner.src}
            alt={banner.alt}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white scale-125' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
