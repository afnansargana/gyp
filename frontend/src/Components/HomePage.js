import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BackgroundSection from "./BackgroundSection";
import CardsSection from "./CardsSection";
import DescriptionSection from "./DescriptionSection";
import ProductCard from "./ProductCard";
import { useCart } from "./CartContext";
import { FadeIn } from "./motion/FadeIn";
import { StaggerList } from "./motion/StaggerList";
import { CardSkeleton } from "./ui";
import { apiClient } from "../lib/api/client";

const HomePage = () => {
  const { handleAddToCart } = useCart();
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await apiClient.get("/products");
        setFeaturedProducts((data || []).slice(0, 4));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const onAddToCart = (product) => {
    handleAddToCart({ ...product, quantity: 1 });
    navigate("/cart");
  };

  return (
    <div>
      <BackgroundSection />
      <div className="bg-ink-50">
        <CardsSection />
        <DescriptionSection />

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
          <FadeIn className="mb-8 text-center">
            <h2 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
              Featured parts
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-500">
              Popular components ready to ship or fit at the workshop.
            </p>
          </FadeIn>

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <StaggerList className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  title={product.title}
                  price={product.price}
                  image={`http://localhost:3000${product.image}`}
                  onAddToCart={() => onAddToCart(product)}
                />
              ))}
            </StaggerList>
          )}

          <FadeIn delay={0.1} className="mt-10 text-center">
            <Link
              to="/car-parts"
              className="text-sm font-semibold text-brand-600 transition hover:text-brand-500"
            >
              Browse all parts →
            </Link>
          </FadeIn>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
