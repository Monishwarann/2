import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Rocket, Terminal, Heart, Zap } from "lucide-react";

const InteractiveAbout: React.FC = () => {
  const [activeCard, setActiveCard] = useState<string>("journey");

  const cards = [
    {
      id: "journey",
      title: "My Journey",
      icon: Brain,
      color: "from-cyan-400 to-blue-600",
      bgGlow: "bg-cyan-500/20",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed">
           I’m a III-year Mechanical Engineering student at Meenakshi Sundararajan Engineering College, passionate about software and hardware development. I enjoy combining engineering knowledge with technology to build innovative, practical, and user-focused solutions.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {["React.js", "Next.js", "AI", "SaaS", "Full Stack"].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "drive",
      title: "What Drives Me",
      icon: Rocket,
      color: "from-violet-400 to-fuchsia-600",
      bgGlow: "bg-violet-500/20",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed">
           I’m driven by the passion to combine software and hardware to create innovative solutions that solve real-world problems through engineering, technology, and meaningful innovation.
          </p>
          <div className="flex items-center gap-3 pt-2 text-violet-300">
            <Zap size={18} />
            <span className="text-sm font-medium">
              Building technology that matters
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "philosophy",
      title: "Philosophy",
      icon: Heart,
      color: "from-rose-400 to-orange-500",
      bgGlow: "bg-rose-500/20",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300 leading-relaxed">
            I believe great software is built on simplicity, security, and
            scalability. Every product should solve real problems while
            delivering intuitive and meaningful user experiences.
          </p>
          <div className="w-full bg-gray-800 rounded-full h-1.5 mt-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, delay: 0.2 }}
              className="h-full bg-gradient-to-r from-rose-400 to-orange-500"
            />
          </div>
        </div>
      ),
    },
    {
      id: "vibe",
      title: "Founder Mode",
      icon: Terminal,
      color: "from-emerald-400 to-teal-600",
      bgGlow: "bg-emerald-500/20",
      content: (
        <div className="space-y-3 font-mono text-sm">
          <div className="flex gap-2 items-center text-gray-400">
            <span className="text-emerald-400">~</span>
            <span>./launch_startup.sh</span>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-emerald-300"
          >
            &gt; Initializing DANK Technologies... ✓
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-300"
          >
            &gt; Building privacy-first AI products, leading development, and
            turning ideas into impactful software.
          </motion.p>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Interactive Tabs */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {cards.map((card) => {
          const isActive = activeCard === card.id;
          const Icon = card.icon;

          return (
            <motion.button
              key={card.id}
              onClick={() => setActiveCard(card.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-4 rounded-xl text-left overflow-hidden transition-all duration-300 ${
                isActive
                  ? "bg-gray-800/80 border-gray-600 shadow-lg"
                  : "bg-gray-900/40 border-gray-800 hover:bg-gray-800/50"
              } border backdrop-blur-sm group`}
            >
              {/* Background Highlight */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeTabBackground"
                    className={`absolute inset-0 opacity-20 bg-gradient-to-br ${card.color}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.2 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </AnimatePresence>

              <div className="relative z-10 flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg transition-colors duration-300 ${
                    isActive ? `bg-gradient-to-br ${card.color} text-white` : "bg-gray-800 text-gray-400 group-hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                </div>
                <span
                  className={`font-semibold text-sm sm:text-base transition-colors duration-300 ${
                    isActive ? "text-white" : "text-gray-400 group-hover:text-gray-200"
                  }`}
                >
                  {card.title}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Active Content Area */}
      <div className="relative min-h-[220px] p-6 sm:p-8 rounded-2xl bg-gray-900/60 border border-gray-700/50 backdrop-blur-xl overflow-hidden">
        <AnimatePresence mode="wait">
          {cards.map(
            (card) =>
              activeCard === card.id && (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="relative z-10 h-full flex flex-col"
                >
                  {/* Decorative glowing orb */}
                  <div className={`absolute -top-10 -right-10 w-32 h-32 blur-3xl rounded-full ${card.bgGlow} opacity-60 pointer-events-none`} />
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`h-8 w-1.5 rounded-full bg-gradient-to-b ${card.color}`} />
                    <h3 className={`text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${card.color}`}>
                      {card.title}
                    </h3>
                  </div>
                  
                  <div className="flex-grow">
                    {card.content}
                  </div>
                </motion.div>
              )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InteractiveAbout;
