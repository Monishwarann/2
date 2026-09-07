import React from "react";
import { motion, Variants } from "framer-motion";
import { Github, Linkedin, Instagram } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Footer: React.FC = () => {
  const socialLinks = [
    {
      icon: Github,
      href: "https://github.com/Monishwarann",
      label: "GitHub",
      color: "text-gray-500",
      bg: "gray-600",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/monishwaran-k-b463a3363/",
      label: "LinkedIn",
      color: "text-blue-500",
      bg: "blue-500",
    },
    {
      icon: Instagram,
      href: "https://www.instagram.com/k._.monish",
      label: "Instagram",
      color: "text-pink-500",
      bg: "pink-500",
    },
  ];

  const getTailwindColor = (color: string): string => {
    const colors: Record<string, string> = {
      "gray-600": "#4B5563",
      "blue-500": "#3B82F6",
      "pink-500": "#EC4899",
      "cyan-500": "#06b6d4",
    };
    return colors[color] || "#4B5563";
  };

  const navigate = useNavigate();

  const quickLinks = [
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Certifications", href: "/certifications" },
    { label: "Events", href: "/events" },
    { label: "Contact", href: "/contact" },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const email = "k.monishwaran123@gmail.com";

  return (
    <footer className="relative overflow-hidden bg-gray-900 border-t z-0 border-gray-800">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-violet-500/5" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
        >
          {/* Brand Section */}
          <motion.div
            variants={itemVariants}
            className="col-span-2 sm:col-span-2"
          >
            <div className="flex items-center mb-2">
              <img
                src="/logo.png"
                alt="Logo"
                loading="lazy"
                className="h-7 sm:h-8 md:h-9 w-auto object-contain object-left"
              />
            </div>
            <p className="text-gray-400 mb-3 sm:mb-4 max-w-md text-xs sm:text-sm md:text-base">
              Aspiring Software Developer & Meta Certified Front-End Developer
            </p>
            <div className="flex items-center gap-2 sm:gap-3">
              {socialLinks.map((social) => (
                <motion.div
                  key={social.label}
                  className="relative group"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.div
                    onClick={() => window.open(social.href, "_blank")}
                    className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gray-800/50 cursor-pointer backdrop-blur-sm border border-gray-700/50 rounded-lg flex items-center justify-center transition-all duration-300`}
                  >
                    <social.icon
                      className={`${social.color} w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-colors`}
                    />
                  </motion.div>

                  {/* Tooltip */}
                  <div
                    style={{ backgroundColor: getTailwindColor(social.bg) }}
                    className={`absolute -bottom-6 sm:-bottom-8 left-1/2 transform -translate-x-1/2 text-white text-xs font-medium px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 whitespace-nowrap`}
                  >
                    {social.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xs sm:text-sm md:text-lg font-semibold text-white mb-2 sm:mb-3">
              Quick Links
            </h3>
            <ul className="space-y-1">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <motion.a
                    onClick={() => navigate(link.href)}
                    whileHover={{ x: 5 }}
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 cursor-pointer text-xs sm:text-sm"
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h3 className="text-xs sm:text-sm md:text-lg font-semibold text-white mb-2 sm:mb-3">
              Contact
            </h3>
            <div className="space-y-1 text-gray-400 text-xs sm:text-sm">
              <p>No:25/45, South 3rd Street,</p>
              <p>Triplicane, Chennai - 600005</p>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  navigator.clipboard.writeText(email);
                  toast.success("Email copied!");
                }}
                className="text-cyan-400 cursor-pointer font-semibold block mt-1"
              >
                {email}
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
