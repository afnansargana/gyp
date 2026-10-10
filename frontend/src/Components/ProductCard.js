import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ id, title, price, image, onAddToCart }) => {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-200/80 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:border-brand-400/40 hover:shadow-lift">
      <Link to={`/product/${id}`} className="block overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-52 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link to={`/product/${id}`}>
          <h3 className="font-display text-base font-semibold text-ink-900 transition group-hover:text-brand-700">
            {title}
          </h3>
        </Link>
        <p className="mt-1 text-sm font-medium text-ink-500">${price}</p>
        <button
          type="button"
          className="btn-secondary mt-auto w-full py-2 text-sm"
          onClick={onAddToCart}
        >
          Add to cart
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
