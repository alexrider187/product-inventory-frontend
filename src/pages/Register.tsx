// src/pages/Register.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthContext } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Card, CardBody } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Spinner } from "../components/ui/Spinner";
import type { RegisterData } from "../types/auth";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    role: "user", // fixed role for security
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuthContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
     await register(form); // register returns User

      // Redirect user after registration
      navigate("/products"); // all users go to products page
    } catch (err: unknown) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Registration failed");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

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
            <h2 className="text-3xl font-bold text-center text-dashboard-text">
              Sign Up
            </h2>

            {error && <p className="text-dashboard-danger text-center">{error}</p>}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="focus:scale-105 focus:shadow-md"
              />

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
                variant="success"
                size="md"
                className="w-full hover:brightness-110"
                disabled={loading}
              >
                {loading ? <Spinner size="md" colorClass="text-white" /> : "Sign Up"}
              </Button>
            </form>

            <div className="text-center space-y-2">
              <p className="text-sm text-dashboard-text">
                Already have an account?{" "}
                <span
                  className="text-dashboard-primary cursor-pointer hover:underline"
                  onClick={() => navigate("/login")}
                >
                  Login
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
