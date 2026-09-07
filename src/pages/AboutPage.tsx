import React, { useState } from "react";
import { motion, Variants } from "framer-motion";

import TechStackRadar from "../components/TechStackRadar";
import InteractiveJourney from "../components/InteractiveJourney";
import InteractiveAbout from "../components/InteractiveAbout";
import { CodeIcon, Rocket, Users, BookOpen, Zap } from "lucide-react";

interface SkillIconProps {
  src: string;
  name: string;
  categoryColor: string;
}

const SkillIcon: React.FC<SkillIconProps> = ({ src, name, categoryColor }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    const firstLetter = name.charAt(0).toUpperCase();
    return (
      <div
        className={`absolute inset-0 bg-gradient-to-br ${categoryColor} flex items-center justify-center`}
      >
        <span className="text-white font-extrabold text-xl sm:text-2xl drop-shadow-md">
          {firstLetter}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      className="w-9 h-9 sm:w-11 sm:h-11 object-contain drop-shadow-md group-hover/skill:drop-shadow-xl transition-transform duration-300 group-hover/skill:scale-110 relative z-10"
      onError={() => setHasError(true)}
    />
  );
};

const AboutPage: React.FC = () => {
  const skillsCategories = [
    {
      title: "Programming Languages",
      color: "from-blue-500 to-cyan-500",
      skills: [
        { name: "JavaScript", image: "/js.webp" },
        { name: "TypeScript", image: "/typescript.webp" },
        { name: "Python", image: "/python.webp" },
        { name: "Java", image: "/java.webp" },
      ],
    },
    {
      title: "Frameworks & Libraries",
      color: "from-purple-500 to-pink-500",
      skills: [
        { name: "React.js", image: "/react.webp" },
        { name: "Next.js", image: "/next.webp" },
        { name: "Node.js", image: "/nodejs.webp" },
        { name: "Express.js", image: "/express.webp" },
      ],
    },
    {
      title: "Databases & ORM",
      color: "from-green-500 to-emerald-500",
      skills: [
        { name: "PostgreSQL", image: "/postgre.webp" },
        { name: "Firestore", image: "/firestore.webp" },
        { name: "MongoDB", image: "/mongodb.webp" },

      ],
    },
    {
      title: "Cloud Platforms",
      color: "from-red-500 to-pink-500",
      skills: [
        { name: "Google Cloud", image: "/google-cloud.webp" },
        { name: "Vercel", image: "/vercel.webp" },
        { name: "Netlify", image: "/netlify.svg" },
        { name: "Firebase", image: "/firebase.webp" },
        { name: "Cloudflare", image: "/cloudflare.webp" },
        { name: "Render", image: "/render.svg" },
      ],
    },
    {
      title: "DevOps & Containers",
      color: "from-indigo-500 to-blue-500",
      skills: [
        { name: "GitHub Actions", image: "/github_actions.webp" },
        { name: "GitLab CI", image: "/gitlab.webp" },
        { name: "Vercel", image: "/vercel.webp" },
        { name: "Firebase Deployment", image: "/firebase_deployment.webp" },
      ],
    },
    {
      title: "Tools & Systems",
      color: "from-indigo-500 to-blue-500",
      skills: [
        { name: "Git", image: "/git.webp" },
        { name: "GitHub", image: "/github.webp" },
        { name: "VS Code", image: "/vscode.webp" },
        { name: "Linux", image: "/linux.webp" },
        { name: "Bash", image: "/bash.webp" },
      ],
    },
  ];

  const hardwareCategories = [
    {
      title: "Design",
      color: "from-amber-500 to-orange-500",
      skills: [
        { name: "SOLIDWORKS", image: "/icons/solidworks (1).svg" },
        { name: "CAD Design", image: "/icons/solidworks (1).svg" },
        { name: "Autodesk Fusion 360", image: "/icons/fusion.svg" },
        { name: "CATIA", image: "/icons/catia.svg" },
      ],
    },
    {
      title: "IoT Systems",
      color: "from-cyan-500 to-teal-500",
      skills: [
        { name: "esp32", image: "/icons/esp32.svg" },
        { name: "Arduino", image: "/icons/arduino.svg" },
      ],
    },
    {
      title: "Simulator",
      color: "from-violet-500 to-purple-500",
      skills: [
        { name: "Simulations", image: "/icons/simulation.svg" },
        { name: "MATLAB", image: "/icons/matlab.svg" },
        { name: "Vehicle Dynamics", image: "/icons/dynamics.svg" },
      ],
    },
  ];

  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen pt-16 lg:pt-20">
      {/* Hero Section with Profile Image */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-16 lg:mb-24"
          >
            {/* Left Side - Profile Image */}
            <motion.div
              variants={itemVariants}
              className="relative flex justify-center lg:justify-start order-2 lg:order-1 w-full"
            >
              <div className="relative w-full max-w-[320px] sm:max-w-[400px] md:max-w-[440px] lg:max-w-[480px] aspect-square rounded-[2rem] overflow-hidden border border-gray-700/30 bg-gray-900/20 backdrop-blur-sm group shadow-2xl">
                {/* Loading Spinner */}
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/60 z-10 backdrop-blur-sm">
                    <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                  </div>
                )}

                {/* Optimized image with smooth loading fade-in */}
                <motion.img
                  src="/creator.webp"
                  alt="Monishwaran K"
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  initial={{ opacity: 0, scale: 0.98, filter: "blur(6px)" }}
                  animate={
                    imageLoaded
                      ? { opacity: 1, scale: 1, filter: "blur(0px)" }
                      : {}
                  }
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  onLoad={() => setImageLoaded(true)}
                />
              </div>
            </motion.div>

            {/* Right Side - Hero Content */}
            <motion.div
              variants={containerVariants}
              className="text-center lg:text-left space-y-6 lg:space-y-8 order-2 lg:order-2"
            >
              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-6xl lg:text-7xl font-bold"
              >
                <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                  About Me
                </span>
              </motion.h1>

              <motion.div variants={itemVariants} className="space-y-2">
                <h2 className="text-2xl lg:text-3xl font-semibold text-white">
                  Monishwaran K
                </h2>
                <p className="text-xl lg:text-[16.5px] text-slate-400 leading-relaxed font-medium">
                  Aspiring Software Developer | Design Engineer
                  <br />
                  Vibe Coder
                </p>
              </motion.div>

              <motion.p
                variants={itemVariants}
                className="text-lg lg:text-base text-gray-300 leading-relaxed max-w-2xl"
              >
                Mechanical Engineering student and aspiring Software Developer skilled in React.js, Next.js, Python, and Java, passionate about building innovative solutions across engineering and technology.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-wrap flex-row gap-4 justify-center lg:justify-start"
              >
                {[
                  {
                    icon: BookOpen,
                    label: "Self Learner",
                    color: "from-cyan-600 to-teal-700",
                  },
                  {
                    icon: Rocket,
                    label: "Creative Thinker",
                    color: "from-pink-700 to-red-800",
                  },
                  {
                    icon: Users,
                    label: "Team Worker",
                    color: "from-amber-700 to-lime-800",
                  },
                  {
                    icon: Zap,
                    label: "Quick Learner",
                    color: "from-rose-600 to-indigo-800",
                  },
                  {
                    icon: CodeIcon,
                    label: "Vibe Coder",
                    color: "from-orange-600 to-pink-700",
                  },
                ].map((badge, index) => (
                  <motion.div
                    key={badge.label}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${badge.color} bg-opacity-20 border border-white/10 backdrop-blur-sm`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 1 }}
                  >
                    <badge.icon size={16} className="text-white" />
                    <span className="text-sm font-medium text-white">
                      {badge.label}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-start">
            {/* Left Side - About Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="w-full"
            >
              <InteractiveAbout />
            </motion.div>

            {/* Right Side - Interactive Journey */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6 sm:space-y-8 lg:space-y-12"
            >
              <InteractiveJourney />
            </motion.div>
          </div>

          {/* Full Width Developer Skills Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative py-12 sm:py-16 mt-8 sm:mt-12"
          >
            {/* Immersive Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] max-w-5xl h-[120%] max-h-[1000px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
              variants={itemVariants}
              className="relative z-10 text-center mb-12 sm:mb-16"
            >
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 mb-6 inline-block tracking-tight">
                Developer Skills
              </h3>
              <div className="h-1.5 w-32 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full mx-auto" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 xl:gap-12 relative z-10">
              {skillsCategories.map((category, categoryIndex) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    delay: categoryIndex * 0.1,
                    duration: 0.7,
                    type: "spring",
                  }}
                  className="relative group rounded-[2rem] p-6 sm:p-8 bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 hover:border-cyan-500/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(6,182,212,0.15)] transition-all duration-500 flex flex-col"
                >
                  {/* Hover Gradient Background */}
                  <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Category Title */}
                  <div className="flex items-center gap-4 mb-8 relative z-10">
                    <div
                      className={`h-12 w-1.5 bg-gradient-to-b ${category.color} rounded-full`}
                    />
                    <h4 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                      {category.title}
                    </h4>
                  </div>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-3 gap-4 sm:gap-5 relative z-10 flex-1 content-start">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: categoryIndex * 0.1 + skillIndex * 0.05,
                          duration: 0.5,
                          type: "spring",
                        }}
                        whileHover={{
                          scale: 1.1,
                          rotateZ: skillIndex % 2 === 0 ? 3 : -3,
                          zIndex: 50,
                        }}
                        className="relative group/skill flex flex-col items-center gap-2.5"
                      >
                        {/* Skill Icon Container */}
                        <div className="relative flex justify-center items-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gray-800/80 border border-gray-700/50 group-hover/skill:border-cyan-400/50 shadow-inner group-hover/skill:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 overflow-hidden shrink-0">
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover/skill:opacity-15 transition-opacity duration-300`}
                          />

                          <SkillIcon
                            src={skill.image}
                            name={skill.name}
                            categoryColor={category.color}
                          />
                        </div>

                        {/* Skill Name */}
                        <span className="text-[11px] sm:text-[13px] font-medium text-gray-400 group-hover/skill:text-cyan-300 text-center transition-colors duration-300 h-8 sm:h-9 flex items-start justify-center leading-snug w-full px-0.5">
                          {skill.name}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Full Width Hardware Skills Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative py-12 sm:py-16 mt-4 sm:mt-8"
          >
            {/* Immersive Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] max-w-5xl h-[120%] max-h-[1000px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
              variants={itemVariants}
              className="relative z-10 text-center mb-12 sm:mb-16"
            >
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 mb-6 inline-block tracking-tight">
                Hardware Skills
              </h3>
              <div className="h-1.5 w-32 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mx-auto" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 xl:gap-12 relative z-10">
              {hardwareCategories.map((category, categoryIndex) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    delay: categoryIndex * 0.1,
                    duration: 0.7,
                    type: "spring",
                  }}
                  className="relative group rounded-[2rem] p-6 sm:p-8 bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 hover:border-amber-500/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(245,158,11,0.15)] transition-all duration-500 flex flex-col"
                >
                  {/* Hover Gradient Background */}
                  <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Category Title */}
                  <div className="flex items-center gap-4 mb-8 relative z-10">
                    <div
                      className={`h-12 w-1.5 bg-gradient-to-b ${category.color} rounded-full`}
                    />
                    <h4 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                      {category.title}
                    </h4>
                  </div>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-3 gap-4 sm:gap-5 relative z-10 flex-1 content-start">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: categoryIndex * 0.1 + skillIndex * 0.05,
                          duration: 0.5,
                          type: "spring",
                        }}
                        whileHover={{
                          scale: 1.1,
                          rotateZ: skillIndex % 2 === 0 ? 3 : -3,
                          zIndex: 50,
                        }}
                        className="relative group/skill flex flex-col items-center gap-2.5"
                      >
                        {/* Skill Icon Container */}
                        <div className="relative flex justify-center items-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gray-800/80 border border-gray-700/50 group-hover/skill:border-amber-400/50 shadow-inner group-hover/skill:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 overflow-hidden shrink-0">
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover/skill:opacity-15 transition-opacity duration-300`}
                          />

                          <SkillIcon
                            src={skill.image}
                            name={skill.name}
                            categoryColor={category.color}
                          />
                        </div>

                        {/* Skill Name */}
                        <span className="text-[11px] sm:text-[13px] font-medium text-gray-400 group-hover/skill:text-amber-300 text-center transition-colors duration-300 h-8 sm:h-9 flex items-start justify-center leading-snug w-full px-0.5">
                          {skill.name}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Radar Chart */}
      <section className="py-16 lg:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-violet-500/5" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 lg:mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                Tech Stack Visualization
              </span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <TechStackRadar />

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                {[
                  {
                    area: "Frontend Development",
                    percentage: 90,
                    description:
                      "React, Next.js, React Native, Tailwind CSS, Bootstrap, JavaScript, TypeScript",
                  },
                  {
                    area: "Backend Development",
                    percentage: 40,
                    description: "Node.js, Python (Flask), APIs",
                  },
                  {
                    area: "Database Management",
                    percentage: 75,
                    description:
                      "MySQL, PostgreSQL, Firebase, Supabase, Convex, Strapi CMS",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.area}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gray-800/30 rounded-lg"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-white">
                        {item.area}
                      </span>
                      <span className="text-cyan-400 font-bold">
                        {item.percentage}%
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                      {item.description}
                    </p>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                        className="bg-gradient-to-r from-cyan-500 to-violet-500 h-2 rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Additional Stats Section */}
      <section className="py-16 lg:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-violet-500/5" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 lg:mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
                Quick Facts
              </span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { label: "Current Year", value: "3rd Year" },
              { label: "CGPA", value: "7.75" },
              { label: "Programming Languages", value: "2" },
              { label: "Open Source Contributions", value: "5+" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04, duration: 0.3 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center p-6 lg:p-8 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300"
              >
                <div className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent mb-2 lg:mb-4">
                  {stat.value}
                </div>
                <div className="text-sm lg:text-base text-gray-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
