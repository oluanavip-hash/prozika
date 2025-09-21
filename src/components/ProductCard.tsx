import React, { useState, useEffect } from 'react';
import { Team } from '../types';
import { RefreshCw, Package, Star } from 'lucide-react';

interface ProductCardProps {
  team: Team;
  onAddToCart: (team: Team) => void;
  isImageToggled: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ team, onAddToCart, isImageToggled }) => {
  const [currentImage, setCurrentImage] = useState(team.image1);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const originalPrice = team.price;
  const discountedPrice = originalPrice * 0.30; // 70% discount

  useEffect(() => {
    setCurrentImage(isImageToggled ? team.image2 : team.image1);
  }, [isImageToggled, team.image1, team.image2]);

  const toggleImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage(currentImage === team.image1 ? team.image2 : team.image1);
  };

  // Calcular estoque total disponível
  const totalStock = team.stock?.reduce((total, stockItem) => total + stockItem.stock_quantity, 0) || 0;
  const isOutOfStock = totalStock === 0;
  const isLowStock = totalStock > 0 && totalStock <= 10;

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 flex flex-col group">
      <div className="relative">
        <div className="aspect-[4/5] overflow-hidden">
          <img
            src={currentImage}
            alt={`${team.name} - Camisa`}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
          
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <Package className="text-gray-400" size={32} />
            </div>
          )}
        </div>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-md text-xs md:text-sm font-bold shadow-sm">
            70% OFF
          </div>
          {isOutOfStock && (
            <div className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-sm">
              ESGOTADO
            </div>
          )}
          {isLowStock && !isOutOfStock && (
            <div className="bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-sm">
              ÚLTIMAS UNID.
            </div>
          )}
        </div>

        {/* Botão de trocar imagem */}
        <button
          onClick={toggleImage}
          aria-label="Trocar imagem"
          className="absolute top-2 right-2 bg-black bg-opacity-30 hover:bg-opacity-60 text-white p-1.5 md:p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 z-10"
        >
          <RefreshCw size={16} />
        </button>
        
        {/* Indicadores de imagem */}
        <div className="absolute bottom-2 w-full flex justify-center items-center gap-2">
          <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
            currentImage === team.image1 ? 'bg-white bg-opacity-90 scale-125' : 'bg-white bg-opacity-40'
          }`}></div>
          <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
            currentImage === team.image2 ? 'bg-white bg-opacity-90 scale-125' : 'bg-white bg-opacity-40'
          }`}></div>
        </div>

        {/* Gradiente sobreposto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none"></div>
      </div>
      
      <div className="p-3 md:p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-1 mb-1">
          <p className="text-xs text-red-600 font-semibold">{team.leagues.name}</p>
        </div>
        
        <h3 className="text-sm md:text-lg font-bold text-gray-800 mb-2 line-clamp-2 flex-grow leading-tight">
          {team.name}
        </h3>
        
        {/* Preços */}
        <div className="flex items-baseline gap-2 mb-4 mt-auto pt-2">
          <p className="text-sm md:text-base text-gray-500 line-through">
            R$ {originalPrice.toFixed(2).replace('.', ',')}
          </p>
          <p className="text-lg md:text-2xl font-bold text-red-600">
            R$ {discountedPrice.toFixed(2).replace('.', ',')}
          </p>
        </div>
        
        {/* Botão de compra */}
        <button
          onClick={() => onAddToCart(team)}
          disabled={isOutOfStock}
          className={`w-full font-semibold py-2 md:py-3 px-2 md:px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm transform hover:scale-105 ${
            isOutOfStock 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg'
          }`}
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.4 3M6 16v2a2 2 0 002 2h8a2 2 0 002-2v-2M6 16h12" />
          </svg>
          <span className="hidden sm:inline">
            {isOutOfStock ? 'Indisponível' : 'Adicionar ao'}
          </span> 
          <span>{isOutOfStock ? 'Esgotado' : 'Carrinho'}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
