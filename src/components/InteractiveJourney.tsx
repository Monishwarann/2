import React, { useCallback, useMemo, useRef, useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Code,
  Zap,
  ChevronRight,
} from "lucide-react";

interface TimelineItem {
  id: number;
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  details?: string[];
  color: string;
  bgGradient: string;
}

// Move journey data outside component to prevent recreation on every render
const JOURNEY_DATA: TimelineItem[] = [
  {
    id: 1,
    year: "2025",
    title: "Started Engineering",
    description:
      "Started B.E. Mechanical Engineering at Meenakshi Sundararajan Engineering College",
    icon: <GraduationCap size={32} />,
    details: [
      "Began Mechanical Engineering journey",
      "Explored software and hardware technologies",
      "Joined technical clubs and communities",
    ],
    color: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-600/10 to-cyan-600/10",
  },
  {
    id: 2,
    year: "2026",
    title: "Exploring Technology",
    description:
      "Started building projects combining mechanical engineering, software, and hardware",
    icon: <Code size={32} />,
    details: [
      "Developed software-based projects",
      "Worked with embedded and hardware systems",
      "Explored AI, IoT, and automation",
    ],
    color: "from-green-500 to-emerald-500",
    bgGradient: "from-green-600/10 to-emerald-600/10",
  },
  {
    id: 3,
    year: "2027",
    title: "Engineering & Innovation",
    description:
      "Expanded into real-world engineering projects through robotics, automotive, and digital technologies",
    icon: <Zap size={32} />,
    details: [
      "Worked on automotive technology projects",
      "Explored robotics and drones",
      "Built software and hardware solutions",
    ],
    color: "from-yellow-500 to-orange-500",
    bgGradient: "from-yellow-600/10 to-orange-600/10",
  },
  {
    id: 4,
    year: "2028",
    title: "Graduation",
    description:
      "Completing B.E. Mechanical Engineering and preparing for the next stage in technology and engineering",
    icon: <GraduationCap size={32} />,
    details: [
      "Complete B.E. Mechanical Engineering",
      "Build a strong software and hardware portfolio",
      "Pursue opportunities in engineering and technology",
    ],
    color: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-600/10 to-teal-600/10",
  },
];

const InteractiveJourney: React.FC = () => {
  const [activeId, setActiveId] = useState<number | null>(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Memoize active journey item to prevent unnecessary re-computation
  const activeJourney = useMemo(
    () => JOURNEY_DATA.find((item) => item.id === activeId),
    [activeId],
  );

  // Memoize click handler to prevent function recreation
  const handleItemClick = useCallback((id: number) => {
    setActiveId(id);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      ref={containerRef}
      className="w-full space-y-6 sm:space-y-8 lg:space-y-12"
    >
      <motion.h3
        variants={itemVariants}
        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 lg:mb-12 px-2"
      >
        <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
          My Journey
        </span>
      </motion.h3>

      {/* Journey Container - Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8 w-full">
        {/* Timeline Navigation - Responsive */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-1 order-1 lg:order-1"
        >
          <div className="space-y-2 sm:space-y-3">
            {/* Navigation Items - Always visible */}
            <div className="flex lg:flex-col space-x-2 sm:space-x-3 lg:space-x-0 lg:space-y-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
              {JOURNEY_DATA.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  whileHover={{ x: 4 }}
                  className={`flex-shrink-0 lg:flex-shrink w-28 h-24 lg:w-full lg:h-auto text-left p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl transition-all duration-300 group relative overflow-hidden will-change-transform ${
                    activeId === item.id
                      ? `bg-gradient-to-r ${item.color} shadow-lg sm:shadow-2xl`
                      : "bg-gray-800/50 hover:bg-gray-800/80"
                  }`}
                >
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-300" />
                  <div className="relative z-10 flex items-center justify-center h-full">
                    <p
                      className={`text-sm sm:text-base font-bold ${
                        activeId === item.id ? "text-white" : "text-gray-300"
                      }`}
                    >
                      {item.year}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Active Journey Card - Responsive */}
        <motion.div
          variants={itemVariants}
          className="col-span-1 lg:col-span-5 order-2 lg:order-2"
        >
          <AnimatePresence mode="wait">
            {activeJourney && (
              <motion.div
                key={activeJourney.id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="relative group will-change-transform"
              >
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl sm:rounded-3xl" />

                {/* Animated Gradient Border - Optimized */}
                <motion.div
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={`absolute inset-0 bg-gradient-to-r ${activeJourney.color} rounded-2xl sm:rounded-3xl p-0.5 opacity-20 group-hover:opacity-80 transition-opacity duration-700`}
                  style={{
                    backgroundSize: "200% 200%",
                    backgroundPosition: "0% 0%",
                    willChange: "background-position",
                  }}
                />

                {/* Content */}
                <div className="relative p-3 sm:p-4 lg:p-6 rounded-2xl sm:rounded-3xl bg-gray-900/95 backdrop-blur-md overflow-hidden">
                  {/* Icon - Removed rotation animation for performance */}
                  <motion.div
                    className={`relative inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br ${activeJourney.color} mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300 will-change-transform`}
                  >
                    <div className="text-white w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 flex items-center">
                      {activeJourney.icon}
                    </div>
                  </motion.div>

                  {/* Header */}
                  <div className="mb-2 sm:mb-3 lg:mb-4 relative z-10">
                    <span
                      className={`inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${activeJourney.color} mb-1 sm:mb-2`}
                    >
                      {activeJourney.year}
                    </span>
                    <h4 className="text-lg sm:text-xl lg:text-3xl font-bold text-white mb-1 sm:mb-2 leading-tight">
                      {activeJourney.title}
                    </h4>
                    <p className="text-xs sm:text-sm lg:text-base text-gray-300 leading-relaxed">
                      {activeJourney.description}
                    </p>
                  </div>

                  {/* Details Grid - Optimized */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5 mb-2 sm:mb-3 lg:mb-4 relative z-10">
                    {activeJourney.details?.map((detail, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 + 0.1 }}
                        className={`p-2 sm:p-2.5 rounded-md sm:rounded-lg bg-gradient-to-br ${activeJourney.bgGradient} border border-gray-700/50 hover:border-gray-600 transition-all duration-300 group/detail overflow-hidden`}
                      >
                        <div className="flex items-start gap-1.5 min-w-0">
                          <div className="flex-shrink-0 mt-0.5">
                            <ChevronRight size={14} className="text-cyan-400" />
                          </div>
                          <p className="text-xs text-gray-300 group-hover/detail:text-gray-200 transition-colors leading-snug break-words min-w-0">
                            {detail}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Progress Indicator - Optimized */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative z-10 mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-700/50 will-change-transform"
                  >
                    <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                      <span className="text-xs font-semibold text-gray-400">
                        Journey Progress
                      </span>
                      <span
                        className={`text-xs font-bold bg-gradient-to-r ${activeJourney.color} bg-clip-text text-transparent`}
                      >
                        {Math.round(
                          (activeJourney.id / JOURNEY_DATA.length) * 100,
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(activeJourney.id / JOURNEY_DATA.length) * 100}%`,
                        }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className={`h-full bg-gradient-to-r ${activeJourney.color} rounded-full`}
                      />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default InteractiveJourney;
