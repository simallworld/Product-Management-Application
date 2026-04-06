import type { ChangeEvent, FormEvent } from "react";

interface ProductSearchPanelProps {
  localSearch: string;
  setLocalSearch: (value: string) => void;
  pageSize: number;
  searchTerm: string;
  onSearch: (event: FormEvent<HTMLFormElement>) => void;
  onPageSizeChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onClear: () => void;
}

const ProductSearchPanel = ({
  localSearch,
  setLocalSearch,
  pageSize,
  searchTerm,
  onSearch,
  onPageSizeChange,
  onClear,
}: ProductSearchPanelProps) => (
  <div className="md:col-span-2 flex flex-col gap-4 bg-white rounded-3xl p-6 shadow-sm border border-gray-200 justify-center">
    <form
      onSubmit={onSearch}
      className="flex flex-col sm:flex-row gap-3 items-stretch"
    >
      <input
        type="text"
        placeholder="Search products by title, brand, or category"
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        className="flex-1 min-w-0 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
      <button
        type="submit"
        className="w-full sm:w-auto bg-teal-600 text-white px-6 py-3 rounded-2xl hover:bg-teal-700 transition cursor-pointer"
      >
        Search
      </button>
      <select
        value={pageSize}
        onChange={onPageSizeChange}
        className="w-full sm:w-auto rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
      >
        <option value={5}>5 / page</option>
        <option value={10}>10 / page</option>
        <option value={20}>20 / page</option>
        <option value={30}>30 / page</option>
      </select>
      {searchTerm && (
        <button
          type="button"
          onClick={onClear}
          className="w-full sm:w-auto bg-gray-200 text-gray-700 px-6 py-3 rounded-2xl hover:bg-gray-300 transition"
        >
          Clear
        </button>
      )}
    </form>
  </div>
);

export default ProductSearchPanel;
