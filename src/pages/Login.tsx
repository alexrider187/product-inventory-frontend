// src/pages/Login.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthContext } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Card, CardBody } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Spinner } from "../components/ui/Spinner";
import type { LoginCredentials } from "../types/auth";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState<LoginCredentials>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuthContext();

  // Redirect authenticated users immediately
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === "admin" ? "/dashboard" : "/products", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log("Logging in with:", form);
      const loggedInUser = await login(form);
      console.log("Logged in user:", loggedInUser);
      // useEffect handles redirect after login
    } catch (err: unknown) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Login failed");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  // Show spinner while redirecting
  if (isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen bg-dashboard-bg">
        <Spinner size="lg" colorClass="text-dashboard-primary" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-dashboard-bg p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg hover:shadow-xl transition-transform duration-300">
          <CardBody className="space-y-6">
            <h2 className="text-3xl font-bold text-center text-dashboard-text">Login</h2>

            {error && <p className="text-dashboard-danger text-center">{error}</p>}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="focus:scale-105 focus:shadow-md"
              />
              <Input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="focus:scale-105 focus:shadow-md"
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full hover:brightness-110"
                disabled={loading}
              >
                {loading ? <Spinner size="md" colorClass="text-white" /> : "Login"}
              </Button>
            </form>

            <div className="text-center space-y-2">
              <p className="text-sm text-dashboard-text">
                Don’t have an account?{" "}
                <span
                  className="text-dashboard-primary cursor-pointer hover:underline"
                  onClick={() => navigate("/register")}
                >
                  Sign Up
                </span>
              </p>

              <p
                className="text-sm text-dashboard-muted cursor-pointer hover:underline"
                onClick={() => navigate("/")}
              >
                ⬅ Back to Home
              </p>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
