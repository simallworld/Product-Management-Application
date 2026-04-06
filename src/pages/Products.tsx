import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ChangeEvent,
} from "react";
import type { Product, CreateProductPayload } from "../types/product";
import { useAppDispatch, useAppSelector } from "../store";
import {
  fetchProducts,
  setCurrentPage,
  setPageSize,
  setSearchTerm,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../store/slices/productSlice";
import { useNavigate } from "react-router-dom";
import ProductSearchPanel from "../components/ProductSearchPanel";
import ProductCard from "../components/ProductCard";
import ProductTable from "../components/ProductTable";
import ProductFormModal from "../components/ProductFormModal";

const initialFormState: CreateProductPayload = {
  title: "",
  description: "",
  price: 0,
  discountPercentage: 0,
  rating: 0,
  stock: 0,
  brand: "",
  category: "",
  thumbnail: "",
  images: [""],
};

const Products = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    products,
    total,
    isLoading,
    error,
    currentPage,
    pageSize,
    searchTerm,
  } = useAppSelector((state) => state.products);

  const [localSearch, setLocalSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState<number | null>(null);

  const totalPages = useMemo(
    () => Math.ceil(total / pageSize),
    [total, pageSize],
  );

  useEffect(() => {
    const skip = currentPage * pageSize;
    dispatch(fetchProducts({ skip, limit: pageSize, search: searchTerm }));
  }, [currentPage, pageSize, searchTerm, dispatch]);

  const openCreateForm = () => {
    setFormMode("create");
    setFormData(initialFormState);
    setEditingId(null);
    setIsFormOpen(true);
  };

  const openEditForm = (product: Product) => {
    setFormMode("edit");
    setEditingId(product.id);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      discountPercentage: product.discountPercentage,
      rating: product.rating,
      stock: product.stock,
      brand: product.brand,
      category: product.category,
      thumbnail: product.thumbnail,
      images: product.images.length ? product.images : [""],
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setSearchTerm(localSearch));
  };

  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages) {
      dispatch(setCurrentPage(page));
    }
  };

  const handlePageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    dispatch(setPageSize(Number(e.target.value)));
    dispatch(setCurrentPage(0));
  };

  const handleFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((current) => ({
      ...current,
      [name]:
        name === "price" ||
        name === "discountPercentage" ||
        name === "rating" ||
        name === "stock"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (formMode === "create") {
        await dispatch(createProduct(formData)).unwrap();
      } else if (formMode === "edit" && editingId) {
        await dispatch(updateProduct({ id: editingId, ...formData })).unwrap();
      }
      closeForm();
    } catch (submitError) {
      console.error(submitError);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this product permanently?")) {
      return;
    }

    try {
      await dispatch(deleteProduct(id)).unwrap();
    } catch (deleteError) {
      console.error(deleteError);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-teal-700">
              Product Catalog
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Manage your product list with create, edit, and delete actions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={openCreateForm}
              className="bg-teal-600 text-white px-5 py-3 rounded-lg shadow hover:bg-teal-700 transition cursor-pointer"
            >
              + New Product
            </button>
            <button
              onClick={() => navigate("/")}
              className="border border-teal-600 text-teal-700 px-5 py-3 rounded-lg shadow-sm hover:bg-teal-50 transition cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
            <p className="text-sm uppercase tracking-wide text-gray-500">
              Total Records
            </p>
            <p className="mt-3 text-4xl font-semibold text-teal-700">{total}</p>
            <p className="mt-2 text-sm text-gray-500">
              Products currently available in the catalog
            </p>
          </div>

          <ProductSearchPanel
            localSearch={localSearch}
            setLocalSearch={setLocalSearch}
            pageSize={pageSize}
            searchTerm={searchTerm}
            onSearch={handleSearch}
            onPageSizeChange={handlePageSizeChange}
            onClear={() => {
              setLocalSearch("");
              dispatch(setSearchTerm(""));
            }}
          />
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-4 border border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <p className="text-sm text-gray-600">
              Showing {products.length} of {total} total products
            </p>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage + 1 >= totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 text-center text-gray-500">
              Loading products...
            </div>
          ) : error ? (
            <div className="py-20 text-center text-red-600">{error}</div>
          ) : (
            <>
              <div className="grid gap-4 md:hidden">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={openEditForm}
                    onDelete={handleDelete}
                  />
                ))}
              </div>

              <ProductTable
                products={products}
                onEdit={openEditForm}
                onDelete={handleDelete}
              />
            </>
          )}
        </div>
      </main>

      <ProductFormModal
        isOpen={isFormOpen}
        formMode={formMode}
        formData={formData}
        onClose={closeForm}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Products;
