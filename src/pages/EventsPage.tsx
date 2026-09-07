import React, { useState } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import {
  Calendar,
  Trophy,
  Search,
  Sparkles,
  LayoutGrid,
  Star,
  Timer,
  Award,
  Briefcase,
  GraduationCap,
  MapPin,
  X,
  ExternalLink,
} from "lucide-react";
import SearchBar from "../components/SearchBar";
import events from "../data/events.json";

interface EventItem {
  id: number;
  title: string;
  type: string;
  role: string;
  date: string;
  location: string;
  description: string;
  achievement?: string;
  image: string;
  technologies: string[];
  duration?: string;
  prize?: string;
  featured?: boolean;
  certificateUrl?: string;
}

const EventsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [showModal, setShowModal] = useState(false);

  const openModal = (event: EventItem) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const categories = [
    { id: "all", label: "All Events", icon: LayoutGrid },
    { id: "hackathon", label: "Hackathons", icon: Trophy },
    { id: "Club Event", label: "Club Events", icon: Briefcase },
    { id: "workshop", label: "Workshops", icon: GraduationCap },
    { id: "competition", label: "Competitions", icon: Award },
  ];

  const filteredEvents = events.filter((event) => {
    const matchesCategory =
      selectedCategory === "all" || event.type === selectedCategory;
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.technologies.some((tech) =>
        tech.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    return matchesCategory && matchesSearch;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Participant":
        return "from-indigo-500 to-purple-600";
      case "Co-Ordinator":
        return "from-sky-500 to-blue-600";
      case "Winner":
        return "from-yellow-500 to-orange-500";
      default:
        return "from-slate-500 to-gray-600";
    }
  };

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

  const stats = [
    {
      label: "Events Attended",
      value: "15+",
      icon: Calendar,
      gradient: "from-cyan-500 to-blue-600",
    },
    {
      label: "Hackathons Won",
      value: "1",
      icon: Trophy,
      gradient: "from-yellow-500 to-orange-600",
    },
    {
      label: "Total Events",
      value: "13+",
      icon: Award,
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      label: "Prize Money Won",
      value: "₹500",
      icon: Star,
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-500/30 mb-6"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-cyan-300">
                Experiences & Achievements
              </span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-pink-400 bg-clip-text text-transparent bg-[length:200%] animate-gradient">
                Events & Competitions
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Participating in hackathons, conferences, and tech events to grow
              and learn
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
            placeholder="Search events by name or technology..."
            scrollTargetId="events-grid"
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
                    ? "bg-gradient-to-r from-cyan-600 via-violet-600 to-purple-600 text-white shadow-lg shadow-cyan-500/25"
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

      {/* Events Grid */}
      <section
        id="events-grid"
        className="pt-8 pb-24 relative [overflow-anchor:none]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <AnimatePresence mode="popLayout">
            {filteredEvents.map((event) => (
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
                key={event.id}
                onClick={() => openModal(event)}
                className="group relative cursor-pointer"
              >
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500" />

                {/* Card */}
                <div className="relative h-full bg-gradient-to-br from-gray-800/80 via-gray-800/60 to-gray-900/80 rounded-2xl border border-gray-700/50 group-hover:border-cyan-500/40 backdrop-blur-xl overflow-hidden transition-all duration-300">
                  {/* Winner Badge */}
                  {event.role === "Winner" && (
                    <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-yellow-500/90 to-orange-500/90 text-white text-xs font-semibold rounded-full shadow-lg">
                      <Trophy size={12} className="fill-current" />
                      Winner
                    </div>
                  )}

                  {/* Featured Badge */}
                  {event.featured && event.role !== "Winner" && (
                    <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-500/90 to-violet-500/90 text-white text-xs font-semibold rounded-full shadow-lg">
                      <Star size={12} className="fill-current" />
                      Featured
                    </div>
                  )}

                  {/* Image */}
                  <div className="relative h-48 lg:h-52 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />

                    {/* Type Badge */}
                    <div className="absolute bottom-4 left-4 px-3 py-1 bg-gray-900/80 backdrop-blur-sm rounded-lg text-xs font-medium text-cyan-400 border border-cyan-500/30">
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </div>

                    {/* Role Badge */}
                    <div
                      className={`absolute bottom-4 right-4 px-3 py-1 bg-gradient-to-r ${getRoleColor(
                        event.role,
                      )} rounded-lg text-xs font-medium text-white`}
                    >
                      {event.role}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 lg:p-6">
                    <h3 className="text-lg lg:text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300 line-clamp-1">
                      {event.title}
                    </h3>

                    <div className="flex items-center gap-4 text-gray-400 text-sm mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {event.date}
                      </div>
                      {event.duration && (
                        <div className="flex items-center gap-1">
                          <Timer size={14} />
                          {event.duration}
                        </div>
                      )}
                    </div>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2">
                      {event.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-500/20 text-cyan-300 group-hover:border-cyan-400/40 transition-colors duration-300"
                        >
                          {tech}
                        </span>
                      ))}
                      {event.technologies.length > 3 && (
                        <span className="text-xs px-3 py-1.5 rounded-lg bg-gray-800/60 border border-gray-700/50 text-gray-400">
                          +{event.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Decorative Corner */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-500/10 to-transparent" />
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
          </motion.div>

          {filteredEvents.length === 0 && (
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
                No events found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Event Details Modal */}
      <AnimatePresence>
        {showModal && selectedEvent && (
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
                  <div className="px-3 py-1 bg-gray-900/80 rounded-lg text-xs font-medium text-cyan-400 border border-cyan-500/30">
                    {selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
                  </div>
                  <div className={`px-3 py-1 bg-gradient-to-r ${getRoleColor(selectedEvent.role)} rounded-lg text-xs font-medium text-white`}>
                    {selectedEvent.role}
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

              {/* Modal Banner Image */}
              <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-gray-950">
                <img
                  src={selectedEvent.certificateUrl || selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-full object-contain sm:object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">
                    {selectedEvent.title}
                  </h2>
                  {selectedEvent.achievement && (
                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 text-sm font-semibold">
                      <Trophy size={14} className="text-yellow-400" />
                      {selectedEvent.achievement}
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* Meta Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-gray-800/50 border border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="text-xs text-gray-400">Date</p>
                      <p className="text-sm font-medium text-white">{selectedEvent.date}</p>
                    </div>
                  </div>
                  {selectedEvent.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-violet-400" />
                      <div>
                        <p className="text-xs text-gray-400">Location</p>
                        <p className="text-sm font-medium text-white">{selectedEvent.location}</p>
                      </div>
                    </div>
                  )}
                  {selectedEvent.duration && (
                    <div className="flex items-center gap-3">
                      <Timer className="w-5 h-5 text-pink-400" />
                      <div>
                        <p className="text-xs text-gray-400">Duration</p>
                        <p className="text-sm font-medium text-white">{selectedEvent.duration}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Overview */}
                <div>
                  <h4 className="text-white font-semibold mb-2 text-base">Overview</h4>
                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                    {selectedEvent.description}
                  </p>
                </div>

                {/* Technologies */}
                <div>
                  <h4 className="text-cyan-400 font-semibold mb-3 text-sm">Technologies & Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 text-xs bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-500/20 text-cyan-300 rounded-lg"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certificate Link / View Button */}
                {selectedEvent.certificateUrl && (
                  <div className="pt-2 flex justify-end">
                    <a
                      href={selectedEvent.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white text-sm font-semibold transition-all duration-300 shadow-lg shadow-cyan-500/20"
                    >
                      <ExternalLink size={16} />
                      View Certificate / Media
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventsPage;
