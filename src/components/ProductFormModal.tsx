import type { ChangeEvent, FormEvent } from "react";
import type { CreateProductPayload } from "../types/product";

interface ProductFormModalProps {
  isOpen: boolean;
  formMode: "create" | "edit";
  formData: CreateProductPayload;
  onClose: () => void;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const ProductFormModal = ({
  isOpen,
  formMode,
  formData,
  onClose,
  onChange,
  onSubmit,
}: ProductFormModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 bg-teal-600 text-white">
          <div>
            <h2 className="text-xl font-semibold">
              {formMode === "create" ? "Add Product" : "Edit Product"}
            </h2>
            <p className="text-sm text-teal-100">
              {formMode === "create"
                ? "Create a new product record."
                : "Update the selected product details."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-teal-700 px-3 py-2 text-sm hover:bg-teal-800 cursor-pointer"
          >
            Close
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4 px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Title</span>
              <input
                name="title"
                value={formData.title}
                onChange={onChange}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Brand</span>
              <input
                name="brand"
                value={formData.brand}
                onChange={onChange}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700">
                Category
              </span>
              <input
                name="category"
                value={formData.category}
                onChange={onChange}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Price</span>
              <input
                name="price"
                type="number"
                min={0}
                value={formData.price}
                onChange={onChange}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700">
                Discount %
              </span>
              <input
                name="discountPercentage"
                type="number"
                min={0}
                max={100}
                value={formData.discountPercentage}
                onChange={onChange}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Rating</span>
              <input
                name="rating"
                type="number"
                min={0}
                max={5}
                step={0.1}
                value={formData.rating}
                onChange={onChange}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Stock</span>
              <input
                name="stock"
                type="number"
                min={0}
                value={formData.stock}
                onChange={onChange}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-gray-700">
                Thumbnail URL
              </span>
              <input
                name="thumbnail"
                value={formData.thumbnail}
                onChange={onChange}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </label>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-medium text-gray-700">
              Description
            </span>
            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              rows={4}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </label>

          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-700 cursor-pointer"
            >
              {formMode === "create" ? "Create Product" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
