import React, { useState } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import {
  Calendar,
  X,
  GraduationCap,
  CircuitBoard,
  BadgeCheck,
  Rocket,
  NotebookPen,
  Sparkles,
  Search,
  LayoutGrid,
  Trophy,
  Briefcase,
} from "lucide-react";
import SearchBar from "../components/SearchBar";
import certifications from "../data/certifications.json";
import projects from "../data/projects.json";

interface Certification {
  id: number;
  title: string;
  issuer: string;
  date: string;
  logo: string;
  verifyUrl: string;
  skills: string[];
  category: string;
  fullSize?: boolean;
}

const CertificationsPage: React.FC = () => {
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // Filter certifications based on category and search
  const filteredCertifications = certifications.filter((cert) => {
    const matchesCategory =
      selectedCategory === "all" || cert.category === selectedCategory;
    const matchesSearch =
      cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.issuer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    return matchesCategory && matchesSearch;
  });

  const openModal = (cert: Certification) => {
    setSelectedCert(cert);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCert(null);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const categories = [
    { id: "all", label: "All", icon: LayoutGrid },
    { id: "hackathon", label: "Hackathons", icon: Trophy },
    { id: "internship", label: "Internships", icon: Briefcase },
    { id: "course", label: "Courses", icon: GraduationCap },
  ];

  // Calculate stats dynamically
  const stats = [
    {
      label: "Total Certifications",
      value: `${certifications.length}`,
      icon: BadgeCheck,
      gradient: "from-cyan-500 to-blue-600",
    },
    {
      label: "Hackathons",
      value: `${certifications.filter((c) => c.category === "hackathon").length}`,
      icon: CircuitBoard,
      gradient: "from-purple-500 to-pink-600",
    },
    {
      label: "Internships",
      value: `${certifications.filter((c) => c.category === "internship").length}`,
      icon: Briefcase,
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      label: "Courses",
      value: `${certifications.filter((c) => c.category === "course").length}`,
      icon: NotebookPen,
      gradient: "from-orange-500 to-red-600",
    },
    {
      label: "Deployed Projects",
      value: `${projects.length}`,
      icon: Rocket,
      gradient: "from-violet-500 to-purple-600",
    },
  ];

  return (
    <div className="min-h-screen pt-16 lg:pt-20 bg-gray-900 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/5 to-violet-500/5 rounded-full blur-3xl" />
      </div>

      {/* HERO */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-500/30 mb-6"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-300">
                Professional Achievements
              </span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent bg-[length:200%] animate-gradient">
                Certifications
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              A showcase of my professional growth through certifications,
              courses, and technical achievements
            </p>
          </motion.div>

          {/* STATS */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-6 mb-16"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl -z-10" />
                <div className="text-center p-5 lg:p-6 rounded-2xl bg-gray-800/60 border border-gray-700/50 backdrop-blur-xl hover:border-cyan-500/50 transition-all duration-500">
                  <div
                    className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">
                    {stat.value}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-400 mt-1">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Search Bar */}
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            placeholder="Search certifications by title, issuer, or skill..."
            scrollTargetId="certifications-grid"
            gradientFrom="cyan-500"
            gradientTo="violet-500"
            iconColor="cyan-400"
            focusBorderColor="focus:border-cyan-500/50"
            focusRingColor="focus:ring-cyan-500/20"
          />

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="flex flex-wrap justify-center gap-3 lg:gap-4 mt-8"
          >
            {categories.map((category) => (
              <motion.button
                key={category.id}
                type="button"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedCategory(category.id);
                }}
                className={`flex items-center gap-2 px-5 lg:px-6 py-2.5 lg:py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-cyan-600 via-violet-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25"
                    : "bg-gray-800/60 text-gray-400 hover:text-cyan-300 hover:bg-gray-700/60 border border-gray-700/50 hover:border-cyan-500/30"
                }`}
              >
                <category.icon size={18} />
                {category.label}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CERT CARDS - Bento Grid Style */}
      <section
        id="certifications-grid"
        className="pt-16 pb-24 relative [overflow-anchor:none]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <AnimatePresence mode="popLayout">
            {filteredCertifications.map((cert) => (
              <motion.div
                layout="position"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ 
                  layout: { type: "spring", stiffness: 400, damping: 30 },
                  opacity: { duration: 0.15 },
                  scale: { duration: 0.15 }
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                key={cert.id}
                onClick={() => openModal(cert)}
                className="group relative cursor-pointer"
              >
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-cyan-500 rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500" />

                {/* Card */}
                <div className="relative h-full bg-gradient-to-br from-gray-800/80 via-gray-800/60 to-gray-900/80 rounded-2xl border border-gray-700/50 group-hover:border-cyan-500/40 backdrop-blur-xl overflow-hidden transition-all duration-300">
                  {/* Content */}
                  <div className="relative p-6 lg:p-7">
                    {/* Header with Logo */}
                    <div className="flex items-start gap-4 mb-5">
                      <div className="relative flex-shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-xl blur-md opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
                        <div
                          className={`relative w-14 h-14 rounded-xl bg-gray-900 border border-gray-700 overflow-hidden ${
                            cert.fullSize
                              ? "p-0"
                              : "flex items-center justify-center p-1.5"
                          }`}
                        >
                          <img
                            src={cert.logo}
                            alt={cert.issuer}
                            loading="lazy"
                            className={`w-full h-full ${
                              cert.fullSize ? "object-cover" : "object-contain"
                            }`}
                          />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white leading-tight line-clamp-2 group-hover:text-cyan-300 transition-colors duration-300">
                          {cert.title}
                        </h3>
                        <p className="text-cyan-400 text-sm font-medium mt-1 truncate">
                          {cert.issuer}
                        </p>
                      </div>
                    </div>

                    {/* Date Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900/60 border border-gray-700/50 mb-5">
                      <Calendar size={14} className="text-violet-400" />
                      <span className="text-sm text-gray-300">{cert.date}</span>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2">
                      {cert.skills.slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-500/20 text-cyan-300 group-hover:border-cyan-400/40 transition-colors duration-300"
                        >
                          {skill}
                        </span>
                      ))}
                      {cert.skills.length > 4 && (
                        <span className="text-xs px-3 py-1.5 rounded-lg bg-gray-800/60 border border-gray-700/50 text-gray-400">
                          +{cert.skills.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Decorative Corner */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-cyan-500/10 to-transparent" />
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
          </motion.div>

          {filteredCertifications.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 lg:py-24"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gray-800/60 border border-gray-700/50 flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-400 mb-4">
                No certifications found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search criteria
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* MODAL */}
      <AnimatePresence>
        {showModal && selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center px-4 pt-20 pb-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto border border-gray-700/50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative flex justify-between items-center px-6 py-4 bg-gradient-to-r from-gray-800/80 to-gray-900/80 border-b border-gray-700/50 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-lg blur-sm opacity-50" />
                    <div
                      className={`relative w-10 h-10 rounded-lg bg-gray-900 border border-gray-700 overflow-hidden ${
                        selectedCert.fullSize
                          ? "p-0"
                          : "flex items-center justify-center p-1"
                      }`}
                    >
                      <img
                        src={selectedCert.logo}
                        alt={selectedCert.issuer}
                        className={`w-full h-full ${
                          selectedCert.fullSize ? "object-cover" : "object-contain"
                        }`}
                      />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-white text-lg font-semibold line-clamp-1">
                      {selectedCert.title}
                    </h2>
                    <p className="text-cyan-400 text-sm">
                      {selectedCert.issuer}
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={closeModal}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-xl bg-red-500/20 hover:bg-red-500 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-white flex items-center justify-center transition-all duration-300"
                >
                  <X className="w-5 h-5" strokeWidth={2.5} />
                </motion.button>
              </div>

              {/* Certificate Image */}
              <div className="flex justify-center items-center bg-gradient-to-b from-gray-900 to-gray-800 p-6 overflow-auto">
                <motion.img
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  src={selectedCert.verifyUrl}
                  alt="Certificate"
                  loading="lazy"
                  className="max-w-full max-h-[65vh] rounded-xl shadow-2xl shadow-black/50 object-contain border border-gray-700/30"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CertificationsPage;
