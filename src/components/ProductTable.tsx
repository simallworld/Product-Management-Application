import type { Product } from "../types/product";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

const ProductTable = ({ products, onEdit, onDelete }: ProductTableProps) => (
  <div className="hidden md:block bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-200">
    <div className="overflow-x-auto">
      <table className="min-w-full text-left">
        <thead className="bg-teal-700 text-white">
          <tr>
            <th className="px-6 py-4 text-sm font-semibold">ID</th>
            <th className="px-6 py-4 text-sm font-semibold">Title</th>
            <th className="px-6 py-4 text-sm font-semibold">Brand</th>
            <th className="px-6 py-4 text-sm font-semibold">Category</th>
            <th className="px-6 py-4 text-sm font-semibold">Price</th>
            <th className="px-6 py-4 text-sm font-semibold">Stock</th>
            <th className="px-6 py-4 text-sm font-semibold">Status</th>
            <th className="px-6 py-4 text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((product, index) => (
            <tr
              key={product.id}
              className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {product.id}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                <div className="flex items-center gap-3">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{product.title}</p>
                    <div className="relative inline-block group">
                      <p
                        className="text-xs text-gray-500 truncate cursor-help w-100"
                        title={product.description}
                      >
                        {product.description}
                      </p>
                      <div className="pointer-events-none absolute left-0 top-full z-10 mt-2 hidden w-72 rounded-2xl bg-slate-900 px-3 py-2 text-xs text-white shadow-lg ring-1 ring-white/10 group-hover:block">
                        <p className="whitespace-normal wrap-break-word">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {product.brand}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {product.category}
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-teal-700">
                ${product.price.toFixed(2)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {product.stock}
              </td>
              <td className="px-4 py-4 text-sm min-w-28">
                <span
                  className={`inline-flex px-3 py-2 rounded-xl text-xs font-semibold ${
                    product.stock > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.stock > 0 ? "In stock" : "Out of stock"}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-700 space-y-2">
                <button
                  onClick={() => onEdit(product)}
                  className="w-16 px-3 py-1 rounded-lg text-green-800 border-2 border-green-800 text-xs hover:bg-green-200 cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="w-16 px-3 py-1 rounded-lg bg-red-600 text-white text-xs hover:bg-red-700 cursor-pointer"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default ProductTable;
