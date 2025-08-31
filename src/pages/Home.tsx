// src/pages/Home.tsx
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { Package, BarChart, Search, Users, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

const testimonials = [
  { name: "Sarah Johnson", role: "Shop Owner", img: "https://i.pravatar.cc/100?img=1" },
  { name: "Michael Smith", role: "Retail Manager", img: "https://i.pravatar.cc/100?img=2" },
  { name: "Emily Davis", role: "Entrepreneur", img: "https://i.pravatar.cc/100?img=3" },
  { name: "David Wilson", role: "Wholesaler", img: "https://i.pravatar.cc/100?img=4" },
  { name: "Sophia Martinez", role: "E-commerce Owner", img: "https://i.pravatar.cc/100?img=5" },
];

export default function Home() {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  // Carousel state
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Rotate testimonials
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % testimonials.length), 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Logout user if authenticated
  useEffect(() => {
    if (isAuthenticated) logout();
  }, [logout, isAuthenticated]);

  return (
    <div className="flex flex-col min-h-screen bg-dashboard-bg text-dashboard-text">
      {/* Hero Section */}
      <section className="flex flex-col justify-center items-center text-center flex-1 px-6 py-20">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold mb-6"
        >
          Welcome to MyStore
        </motion.h1>

        {/* Moving marquee */}
        <div className="relative w-full max-w-xl mx-auto mb-6 overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-dashboard-bg to-transparent z-10" />
          <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-dashboard-bg to-transparent z-10" />
          <motion.div
            className="whitespace-nowrap flex"
            initial={{ x: 0 }}
            animate={{ x: ["0%", "-100%"] }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          >
            <span className="text-xl md:text-2xl text-dashboard-primary font-semibold mr-10">
              Fast • Reliable • Secure • Smart • Scalable •
            </span>
            <span className="text-xl md:text-2xl text-dashboard-primary font-semibold mr-10">
              Fast • Reliable • Secure • Smart • Scalable •
            </span>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-lg md:text-xl mb-8 max-w-2xl"
        >
          Manage your products, track inventory, and grow your business with ease.
        </motion.p>

        <div className="flex gap-4 flex-wrap justify-center">
          <Button variant="primary" size="lg" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button variant="success" size="lg" onClick={() => navigate("/register")}>
            Sign Up
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-dashboard-card py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
          {[
            { icon: <Search className="w-10 h-10 text-dashboard-primary" />, title: "Smart Search", desc: "Quickly find products with filters and advanced search." },
            { icon: <Package className="w-10 h-10 text-dashboard-primary" />, title: "Inventory Tracking", desc: "Monitor stock levels in real-time with ease." },
            { icon: <BarChart className="w-10 h-10 text-dashboard-primary" />, title: "Analytics", desc: "View sales reports and business insights instantly." },
            { icon: <Users className="w-10 h-10 text-dashboard-primary" />, title: "User Roles", desc: "Assign roles for admins, staff, and managers securely." },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center space-y-3"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
            >
              {feature.icon}
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-dashboard-muted">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10">Trusted by Businesses</h2>
        <div
          className="max-w-lg mx-auto relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center text-center space-y-3 bg-dashboard-card p-6 rounded-xl shadow-lg"
            >
              <img
                src={testimonials[index].img}
                alt={testimonials[index].name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <h4 className="font-semibold">{testimonials[index].name}</h4>
              <p className="text-sm text-dashboard-muted">{testimonials[index].role}</p>
              <div className="flex gap-1">
                {Array(5).fill(0).map((_, j) => (
                  <Star
                    key={j}
                    className="w-5 h-5 text-yellow-400 fill-yellow-400 stroke-yellow-400"
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex justify-center mt-6 gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-3 h-3 rounded-full ${i === index ? "bg-dashboard-primary" : "bg-dashboard-muted"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-16 px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to manage your store smarter?
        </h2>
        <Button variant="success" size="lg" onClick={() => navigate("/register")}>
          Get Started for Free
        </Button>
      </section>

      {/* Footer */}
      <footer className="bg-dashboard-card py-6 text-center text-dashboard-muted text-sm">
        <p>
          © {new Date().getFullYear()} MyStore. All rights reserved. |{" "}
          <span onClick={() => navigate("/")} className="cursor-pointer hover:underline">Home</span> |{" "}
          <span onClick={() => navigate("/login")} className="cursor-pointer hover:underline">Login</span> |{" "}
          <span onClick={() => navigate("/register")} className="cursor-pointer hover:underline">Register</span>
        </p>
      </footer>
    </div>
  );
}
