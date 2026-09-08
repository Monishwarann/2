import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutGroup, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

// Prefetch imports for instant navigation
const prefetchModules: Record<string, () => Promise<any>> = {
  "/": () => import("../pages/HomePage"),
  "/about": () => import("../pages/AboutPage"),
  "/projects": () => import("../pages/ProjectsPage"),
  "/certifications": () => import("../pages/CertificationsPage"),
  "/events": () => import("../pages/EventsPage"),
  "/stats": () => import("../pages/StatsPage"),
  "/contact": () => import("../pages/ContactPage"),
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/projects", label: "Projects" },
    { path: "/certifications", label: "Certifications" },
    { path: "/events", label: "Events" },
    { path: "/stats", label: "Stats" },
    { path: "/contact", label: "Contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  const handlePrefetch = (path: string) => {
    const prefetch = prefetchModules[path];
    if (prefetch) {
      prefetch().catch(() => {});
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`fixed top-3 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-md" : "backdrop-blur"
      }`}
    >
      <LayoutGroup id="tubelight">
        <div className="px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20 w-full max-w-7xl mx-auto rounded-full bg-gray-900/70 border border-cyan-500/15 shadow-[0_0_26px_rgba(6,182,212,0.16)] px-3 sm:px-5 lg:px-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <Link to="/" className="flex items-center" onClick={() => setIsOpen(false)}>
                <img
                  src="/logo.png"
                  alt="Monishwaran K Logo"
                  loading="lazy"
                  className="h-6 sm:h-7 md:h-8 w-auto object-contain"
                />
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <div className="flex items-center space-x-4 rounded-full bg-gray-900/60 px-2 py-2 border border-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.08)]">
                {navItems.map((item) => {
                  const active = isActive(item.path);

                  return (
                    <motion.div key={item.path} className="relative">
                      <Link
                        to={item.path}
                        onMouseEnter={() => handlePrefetch(item.path)}
                        className={`relative block px-4 py-2 text-sm font-semibold tracking-wide rounded-full transition-colors duration-200 ${
                          active
                            ? "text-cyan-100"
                            : "text-gray-300 hover:text-cyan-200"
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="tubelight-desktop"
                            className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 via-cyan-400/10 to-violet-500/20 border border-cyan-400/25 shadow-[0_0_25px_rgba(6,182,212,0.25)]"
                            transition={{
                              type: "spring",
                              stiffness: 350,
                              damping: 30,
                            }}
                          />
                        )}
                        <span className="relative z-10">{item.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-300 hover:text-cyan-400 transition-colors w-11 h-11 flex items-center justify-center rounded-full"
                aria-label="Toggle navigation menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isOpen ? 1 : 0,
            height: isOpen ? "auto" : 0,
          }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
          className={`lg:hidden w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 overflow-hidden ${
            isOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          <div className="rounded-[28px] bg-gray-900/80 border border-cyan-500/25 shadow-[0_10px_40px_rgba(6,182,212,0.12)] backdrop-blur px-3 sm:px-4 py-3 space-y-1.5">
            {navItems.map((item) => {
              const active = isActive(item.path);

              return (
                <motion.div
                  key={item.path}
                  whileHover={{ x: 6 }}
                  className="relative block"
                >
                  <Link
                    to={item.path}
                    onMouseEnter={() => handlePrefetch(item.path)}
                    onTouchStart={() => handlePrefetch(item.path)}
                    onClick={() => setIsOpen(false)}
                    className={`relative block px-4 py-2.5 text-base font-semibold transition-colors duration-200 rounded-full overflow-hidden ${
                      active
                        ? "text-cyan-200"
                        : "text-gray-300 hover:text-cyan-200"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="tubelight-mobile"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 via-cyan-400/10 to-violet-500/20 border border-cyan-400/25 shadow-[0_0_25px_rgba(6,182,212,0.25)]"
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 30,
                        }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </LayoutGroup>
    </motion.nav>
  );
};

export default Navbar;
