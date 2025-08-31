import { Routes, Route,  useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Spinner } from "./components/ui/Spinner";
import { useAuth } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ui/ProtectedRoute";
import { Sidebar } from "./components/ui/Sidebar";

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ProductList = lazy(() => import("./pages/products/ProductList"));
const AddProduct = lazy(() => import("./pages/products/AddProduct"));
const EditProduct = lazy(() => import("./pages/products/EditProduct"));

export default function App() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Pages where sidebar should NOT appear
  const noSidebarPages = ["/", "/login", "/register"];
  const showSidebar = isAuthenticated && !noSidebarPages.includes(location.pathname);

  return (
    <div className="flex min-h-screen bg-dashboard-bg text-dashboard-text">
      {showSidebar && <Sidebar />}

      <main className={`flex-1 transition-all duration-300 ${showSidebar ? "p-6" : "p-0"}`}>
        <Suspense
          fallback={
            <div className="flex justify-center items-center p-6">
              <Spinner size="md" colorClass="text-dashboard-primary" />
            </div>
          }
        >
          <Routes>
            {/* Public / Landing */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Admin / Protected */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Products */}
            <Route path="/products" element={<ProductList />} />

            {/* Admin-only product management */}
            <Route
              path="/products/add"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AddProduct />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/edit/:id"
              element={
                <ProtectedRoute requiredRole="admin">
                  <EditProduct />
                </ProtectedRoute>
              }
            />

            {/* Catch-all 404 */}
            <Route path="*" element={<p className="text-dashboard-danger text-center p-6">Page Not Found</p>} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
