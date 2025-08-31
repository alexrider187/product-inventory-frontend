// src/components/ui/Sidebar.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Package, PlusCircle, Menu, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "./ToolTip";
import { useAuth } from "../../hooks/useAuth";
import React from "react";

interface LinkItem {
  name: string;
  to: string;
  icon: React.ReactNode;
  roles?: ("admin" | "user")[];
}

// Sidebar links
const links: LinkItem[] = [
  { name: "Home", to: "/", icon: <Home /> },
  { name: "Products", to: "/products", icon: <Package /> }, // visible to all
  { name: "Dashboard", to: "/dashboard", icon: <LayoutDashboard />, roles: ["admin"] },
  { name: "Add Product", to: "/products/add", icon: <PlusCircle />, roles: ["admin"] },
];

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  // Hide sidebar on Home, Login, Register
  const hideSidebar = ["/", "/login", "/register"].includes(location.pathname);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isMobile && mobileOpen && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, mobileOpen]);

  const sidebarWidth = isMobile ? 250 : isOpen ? 208 : 64;

  // Filter role-based links
  const filteredLinks = links.filter((link) => {
    if (!link.roles) return true;
    if (!isAuthenticated) return false;
    return user?.role ? link.roles.includes(user.role) : false;
  });

  if (hideSidebar) return null; // Hide sidebar on Home, Login, Register

  return (
    <>
      {isMobile && !mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed top-4 left-4 z-[1000] w-14 h-14 flex items-center justify-center 
                     bg-white dark:bg-dashboard-card rounded-md shadow-md hover:bg-dashboard-secondary 
                     transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={28} className="text-dashboard-text" />
        </button>
      )}

      <AnimatePresence>
        <motion.aside
          ref={sidebarRef}
          initial={{ x: isMobile ? -sidebarWidth : 0 }}
          animate={{ x: isMobile ? (mobileOpen ? 0 : -sidebarWidth) : 0, width: sidebarWidth }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className={`fixed top-0 left-0 h-screen bg-dashboard-card border-r border-dashboard-border flex flex-col p-4 z-50 overflow-y-auto ${isMobile ? "shadow-lg" : "relative"}`}
        >
          {!isMobile && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-center mb-6 w-14 h-14 rounded-md hover:bg-dashboard-secondary transition-colors"
            >
              <Menu size={28} className="text-dashboard-text" />
            </button>
          )}

          <nav className="flex flex-col gap-3 mt-2 flex-1">
            {filteredLinks.map((link) => {
              const isActive = location.pathname === link.to;
              const icon = React.isValidElement(link.icon)
                ? React.cloneElement(link.icon as React.ReactElement<{ size?: number; className?: string }>, {
                    size: 24,
                    className: isActive ? "text-dashboard-primary" : "text-dashboard-text",
                  })
                : link.icon;

              return (
                <motion.button
                  key={link.name}
                  onClick={() => {
                    // Log out if going to Home
                    if (link.to === "/") logout();
                    navigate(link.to);
                    if (isMobile) setMobileOpen(false);
                  }}
                  whileHover={{ backgroundColor: "rgba(59,130,246,0.2)" }}
                  className={`flex items-center gap-3 p-2 rounded w-full text-left transition-colors duration-200 ${isActive ? "bg-dashboard-primary/20 text-dashboard-text" : "text-dashboard-text hover:text-dashboard-text"}`}
                >
                  {!isMobile && !isOpen ? (
                    <Tooltip text={link.name}>{icon}</Tooltip>
                  ) : (
                    icon
                  )}
                  {(isOpen || isMobile) && <span className="font-medium">{link.name}</span>}
                </motion.button>
              );
            })}
          </nav>
        </motion.aside>
      </AnimatePresence>

      {isMobile && mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
};
