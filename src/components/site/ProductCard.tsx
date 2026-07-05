import { Link, useNavigate } from "react-router-dom";
import {
  formatPrice,
  productImage,
  type Product,
  useCart,
  useCategories,
} from "@/lib/store";
import { ShoppingCart, Eye } from "lucide-react";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const cart = useCart();
  const [categories] = useCategories();
  const navigate = useNavigate();
  const outOfStock = product.stock <= 0;

  const categoryName =
    categories.find((cat) => cat.id === product.category)?.name || product.category;

  function openProductPage() {
    window.scrollTo(0, 0);
    navigate(`/product/${product.id}`);
  }

  return (
    <div className="group relative overflow-hidden rounded-md border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-red">
      <button onClick={openProductPage} className="block w-full text-left">
        <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
          <img
            src={productImage(product)}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.featured && (
            <span className="absolute left-3 top-3 rounded-sm bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
              Featured
            </span>
          )}
          <span
            className={`absolute right-3 top-3 rounded-sm px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${
              outOfStock ? "bg-muted text-muted-foreground" : "bg-black/70 text-white"
            }`}
          >
            {outOfStock ? "Sold Out" : "In Stock"}
          </span>
        </div>
      </button>

      <div className="p-5">
        <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
          {categoryName}
        </div>

        <button onClick={openProductPage} className="text-left">
          <h3 className="display text-xl font-bold tracking-wide hover:text-primary">
            {product.name}
          </h3>
        </button>

        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {product.shortDescription}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="display text-2xl font-bold">
            {formatPrice(product.price)}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={openProductPage}
            className="inline-flex items-center justify-center gap-1.5 rounded-sm border border-border px-3 py-2.5 text-xs font-bold uppercase tracking-wider hover:border-primary hover:text-primary"
          >
            <Eye className="h-3.5 w-3.5" /> View
          </button>

          <button
            disabled={outOfStock}
            onClick={() => {
              cart.add(product.id, 1);
              toast.success(`${product.name} added to cart`);
            }}
            className="inline-flex items-center justify-center gap-1.5 rounded-sm bg-primary px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground transition-colors hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ShoppingCart className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
