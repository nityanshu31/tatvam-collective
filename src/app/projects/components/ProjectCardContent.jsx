import { motion } from "framer-motion";

const ProjectCardContent = ({ project, isHovered, isMobile }) => {
  return (
    <div className="mt-4">
      <motion.h3
        className="text-xl font-semibold group-hover:text-[var(--accent)]"
        animate={{ x: isHovered && !isMobile ? 8 : 0 }}
      >
        {project.title}
      </motion.h3>

      <p className="text-sm text-[var(--muted)]">
        {project.location} | {project.year}
      </p>
    </div>
  );
};

export default ProjectCardContent;