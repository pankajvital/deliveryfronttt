import React from "react";

const ProductCard = ({ product, quantity, onSelect }) => {
  const { name, img } = product;

  const incrementQuantity = () => {
    onSelect(product, quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 0) {
      onSelect(product, quantity - 1);
    }
  };

  return (
    <div className="w-full max-w-xs mx-auto bg-white shadow-md rounded-md overflow-hidden hover:shadow-lg">
      <div className="p-4 text-center">
        <h3 className="text-lg font-medium text-[#2A364D]">{name}</h3>
      </div>

      <div className="flex justify-center p-4">
        {img ? (
          <img src={img} alt={name} className="h-32 w-32 object-contain" />
        ) : (
          <div>Loading...</div>
        )}
      </div>

      <div className="flex items-center justify-center px-4 py-2 bg-gray-200">
        <button
          onClick={decrementQuantity}
          className="bg-[#2A364D] text-white text-lg px-3 rounded-l-full disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={quantity === 0}
        >
          -
        </button>
        <span className="text-lg font-semibold text-gray-700 px-4">
          {quantity}
        </span>
        <button
          onClick={incrementQuantity}
          className="bg-[#2A364D] text-white text-lg px-3 rounded-r-full"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
