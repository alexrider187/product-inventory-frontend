// src/pages/products/ProductList.tsx
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { productAPI } from "../../api/products";
import type { Product } from "../../types/product";

import { Button } from "../../components/ui/Button";
import { Card, CardBody } from "../../components/ui/Card";
import { Spinner } from "../../components/ui/Spinner";
import { useAuth } from "../../hooks/useAuth";

import { Search } from "lucide-react";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);

  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://product-inventory-backend-ug5k.onrender.com";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productAPI.getAll();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, products]);

  const handleSearch = () => {
    setSearching(true);
    setTimeout(() => setSearching(false), 600); // fake delay for UX
  };

  const handleDelete = async (productId: string, productName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) return;

    try {
      setDeletingProductId(productId);
      await productAPI.delete(productId);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete product. Try again.");
    } finally {
      setDeletingProductId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <Spinner size="md" colorClass="text-dashboard-primary" />
      </div>
    );
  }

  if (error) {
    return <p className="text-center p-6 text-dashboard-danger font-medium">{error}</p>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header + Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-dashboard-text">📦 Products</h1>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-start sm:items-center">
          <div className="flex items-center border border-dashboard-border rounded-md w-full sm:w-64 overflow-hidden">
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 w-full focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="p-2 bg-dashboard-primary text-white hover:brightness-110 transition"
            >
              {searching ? <Spinner size="sm" colorClass="text-white" /> : <Search size={18} />}
            </button>
          </div>

          {isAuthenticated && user?.role === "admin" && (
            <Button
              variant="success"
              size="md"
              onClick={() => navigate("/products/add")}
            >
              + Add Product
            </Button>
          )}
        </div>
      </div>

      {/* Products Table */}
      <Card className="overflow-x-auto">
        <CardBody>
          {filteredProducts.length === 0 ? (
            <p className="text-center p-6 text-dashboard-muted font-medium">
              Product not found.
            </p>
          ) : (
            <table className="w-full text-sm border-collapse">
              <thead className="bg-dashboard-card border-b border-dashboard-border text-dashboard-text uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">Image</th>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">SKU</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Quantity</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  {isAuthenticated && user?.role === "admin" && (
                    <th className="px-4 py-3 text-left">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product._id}
                    className="border-t border-dashboard-border hover:bg-dashboard-secondary transition"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="px-4 py-3">
                      {product.image ? (
                        <img
                          src={`${VITE_API_BASE_URL}/${product.image}`}
                          alt={product.name}
                          className="h-12 w-12 object-cover rounded-lg border border-dashboard-border"
                        />
                      ) : (
                        <span className="text-dashboard-muted italic">No image</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{product.name}</td>
                    <td className="px-4 py-3">{product.sku}</td>
                    <td className="px-4 py-3">{product.category}</td>
                    <td className="px-4 py-3">{product.quantity}</td>
                    <td className="px-4 py-3">
                      {typeof product.price === "number"
                        ? `$${product.price.toFixed(2)}`
                        : "N/A"}
                    </td>

                    {isAuthenticated && user?.role === "admin" && (
                      <td className="px-4 py-3 flex gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => navigate(`/products/edit/${product._id}`)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          disabled={deletingProductId === product._id}
                          onClick={() => handleDelete(product._id, product.name)}
                        >
                          {deletingProductId === product._id ? (
                            <Spinner size="md" colorClass="text-white" />
                          ) : (
                            "Delete"
                          )}
                        </Button>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
