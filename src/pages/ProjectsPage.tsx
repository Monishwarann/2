import React, { useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import {
  Github,
  ExternalLink,
  Search,
  Sparkles,
  Code2,
  Layers,
  Cpu,
  Gamepad2,
  LayoutGrid,
  Rocket,
  Star,
  GitFork,
  X,
} from "lucide-react";
import SearchBar from "../components/SearchBar";
import projects from "../data/projects.json";

const ProjectsPage: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const categories = [
    { id: "all", label: "All Projects", icon: LayoutGrid },
    { id: "web", label: "Full Stack", icon: Code2 },
    { id: "ai", label: "Machine Learning", icon: Cpu },
    { id: "iot", label: "IoT", icon: Layers },
    { id: "entertainment", label: "Entertainment", icon: Gamepad2 },
  ];

  const filteredProjects = projects.filter((project) => {
    const matchesCategory =
      selectedCategory === "all" || project.category === selectedCategory;
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.shortDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.technologies.some((tech) =>
        tech.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    return matchesCategory && matchesSearch;
  });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
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

  const totalProjects = projects.length;
  const featuredCount = projects.filter((p) => p.featured).length;
  const openSourceCount = projects.filter((p) => p.githubUrl).length;
  const uniqueTechs = new Set(projects.flatMap((p) => p.technologies));
  const techStacksCount = uniqueTechs.size;

  const stats = [
    {
      label: "Total Projects",
      value: String(totalProjects),
      icon: Rocket,
      gradient: "from-cyan-500 to-blue-600",
    },
    {
      label: "Featured",
      value: String(featuredCount),
      icon: Star,
      gradient: "from-yellow-500 to-orange-600",
    },
    {
      label: "Open Source",
      value: String(openSourceCount),
      icon: GitFork,
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      label: "Tech Stacks",
      value: String(techStacksCount),
      icon: Layers,
      gradient: "from-violet-500 to-purple-600",
    },
  ];

  return (
    <div className="min-h-screen pt-16 lg:pt-20 bg-gray-900 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/5 to-cyan-500/5 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 lg:mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 mb-6"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">
                Innovative Solutions
              </span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent bg-[length:200%] animate-gradient">
                My Projects
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Showcasing innovative solutions and cutting-edge technologies that
              solve real-world problems
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-12"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative group"
              >
                <div className="text-center p-5 lg:p-6 rounded-2xl bg-gray-800/60 border border-gray-700/50 backdrop-blur-xl hover:border-purple-500/50 transition-all duration-500">
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
            placeholder="Search projects by name or technology..."
            scrollTargetId="projects-grid"
            gradientFrom="purple-500"
            gradientTo="cyan-500"
            iconColor="purple-400"
            focusBorderColor="focus:border-purple-500/50"
            focusRingColor="focus:ring-purple-500/20"
          />

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="flex flex-wrap justify-center gap-3 lg:gap-4"
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
                    ? "bg-gradient-to-r from-purple-600 via-pink-600 to-violet-600 text-white shadow-lg shadow-purple-500/25"
                    : "bg-gray-800/60 text-gray-400 hover:text-purple-300 hover:bg-gray-700/60 border border-gray-700/50 hover:border-purple-500/30"
                }`}
              >
                <category.icon size={18} />
                {category.label}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section
        id="projects-grid"
        className="pt-8 pb-24 relative [overflow-anchor:none]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  layout="position"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    layout: { type: "spring", stiffness: 400, damping: 30 },
                    opacity: { duration: 0.15 },
                    scale: { duration: 0.15 },
                  }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  key={project.id}
                  onClick={() => setSelectedProject(project.id)}
                  className="group relative cursor-pointer"
                >
                  {/* Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500" />

                  {/* Card */}
                  <div className="relative h-full bg-gradient-to-br from-gray-800/80 via-gray-800/60 to-gray-900/80 rounded-2xl border border-gray-700/50 group-hover:border-purple-500/40 backdrop-blur-xl overflow-hidden transition-all duration-300">
                    {/* Featured Badge */}
                    {project.featured && (
                      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-yellow-500/90 to-orange-500/90 text-white text-xs font-semibold rounded-full shadow-lg">
                        <Star size={12} className="fill-current" />
                        Featured
                      </div>
                    )}

                    {/* Image */}
                    <div className="relative h-48 lg:h-52 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />

                      {/* Category Badge */}
                      <div className="absolute bottom-4 left-4 px-3 py-1 bg-gray-900/80 backdrop-blur-sm rounded-lg text-xs font-medium text-purple-400 border border-purple-500/30">
                        {
                          categories.find((c) => c.id === project.category)
                            ?.label
                        }
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 lg:p-6">
                      <h3 className="text-lg lg:text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300 line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {project.shortDesc}
                      </p>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 text-purple-300 group-hover:border-purple-400/40 transition-colors duration-300"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="text-xs px-3 py-1.5 rounded-lg bg-gray-800/60 border border-gray-700/50 text-gray-400">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Decorative Corner */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/10 to-transparent" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredProjects.length === 0 && (
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
                No projects found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center px-4 pt-[6.5rem] pb-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700/50"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const project = projects.find((p) => p.id === selectedProject);
                if (!project) return null;

                return (
                  <>
                    {/* Close Button */}
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur border border-white/10 text-gray-300 hover:text-white flex items-center justify-center transition-all duration-200"
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5" strokeWidth={2.5} />
                    </button>

                    {/* Banner */}
                    <div className="relative h-50 sm:h-[18rem] overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />

                      {/* Title Overlay */}
                      <div className="absolute bottom-6 left-6 right-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
                          {project.title}
                        </h2>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="px-6 py-6 sm:px-8 sm:py-8 space-y-6">
                      <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                        {project.longDesc}
                      </p>

                      <div>
                        <h4 className="text-purple-400 font-semibold mb-4 text-lg flex items-center gap-2">
                          <Code2 size={20} />
                          Tech Stack
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-4 py-2 text-sm bg-gray-800/80 text-purple-300 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-colors"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="flex flex-wrap gap-4 pt-2">
                        <motion.a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 px-6 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm font-medium hover:bg-gray-700 hover:border-gray-600 transition-all"
                        >
                          <Github size={18} className="text-gray-400" />
                          View Code
                        </motion.a>

                        <motion.a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-violet-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-purple-500/25"
                        >
                          <ExternalLink size={18} />
                          Live Demo
                        </motion.a>
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsPage;
