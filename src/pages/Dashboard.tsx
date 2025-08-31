// src/pages/Dashboard.tsx
import { useEffect, useState, useMemo } from "react";
import { productAPI } from "../api/products";
import type { Product } from "../types/product";
import { Spinner } from "../components/ui/Spinner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

const Dashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await productAPI.getAll();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch products", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Prepare chart data using useMemo for performance
  const productsOverTime = useMemo(
    () =>
      products.map((p) => ({
        name: new Date(p.createdAt ?? Date.now()).toLocaleDateString(),
        products: 1,
      })),
    [products]
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      const category = p.category || "Uncategorized";
      counts[category] = (counts[category] || 0) + 1;
    });
    return counts;
  }, [products]);

  const categoryData = useMemo(
    () =>
      Object.entries(categoryCounts).map(([name, value]) => ({
        name,
        value,
      })),
    [categoryCounts]
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner size="md" colorClass="text-dashboard-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-dashboard-card p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
          <p className="text-sm text-gray-500">Total Products</p>
          <h2 className="text-2xl font-bold">{products.length}</h2>
        </div>
        <div className="bg-dashboard-card p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
          <p className="text-sm text-gray-500">Total Categories</p>
          <h2 className="text-2xl font-bold">{Object.keys(categoryCounts).length}</h2>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dashboard-card p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Products Over Time</h3>
          {productsOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={productsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <ChartTooltip />
                <Line
                  type="monotone"
                  dataKey="products"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12">No product data available</p>
          )}
        </div>

        <div className="bg-dashboard-card p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Category Distribution</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {categoryData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <ChartTooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-12">No categories found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
