import type { Product } from "../types/product";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

const ProductCard = ({ product, onEdit, onDelete }: ProductCardProps) => (
  <article className="bg-white rounded-3xl border border-gray-200 p-4 shadow-sm">
    <div className="flex items-center gap-3">
      <img
        src={product.thumbnail}
        alt={product.title}
        className="h-16 w-16 rounded-xl object-cover"
      />
      <div className="min-w-0">
        <h2 className="font-semibold text-gray-900 truncate">
          {product.title}
        </h2>
        <p className="text-sm text-gray-500 truncate">
          {product.brand} · {product.category}
        </p>
      </div>
    </div>
    <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-700">
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500">Price</p>
        <p className="font-semibold text-teal-700">
          ${product.price.toFixed(2)}
        </p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500">Stock</p>
        <p>{product.stock}</p>
      </div>
    </div>
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span
        className={`inline-flex px-3 py-2 rounded-full text-xs font-semibold ${
          product.stock > 0
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {product.stock > 0 ? "In stock" : "Out of stock"}
      </span>
      <button
        onClick={() => onEdit(product)}
        className="rounded-2xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(product.id)}
        className="rounded-2xl bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 cursor-pointer"
      >
        Delete
      </button>
    </div>
  </article>
);

export default ProductCard;
