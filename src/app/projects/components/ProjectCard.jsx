import { motion } from "framer-motion";
import ProjectImageSlider from "./ProjectImageSlider";
import ProjectCardContent from "./ProjectCardContent";
import ProjectCardEffects from "./ProjectCardEffects";
import { useProjectCard } from "./hooks/useProjectCard";

const ProjectCard = ({ project, index, onClick }) => {
  const {
    cardRef,
    rotateX,
    rotateY,
    glareX,
    glareY,
    isHovered,
    setIsHovered,
    currentImageIndex,
    allImages,
    hasMultipleImages,
    isMobile,
    handleMouseMove,
    reset,
  } = useProjectCard(project);

  return (
    <motion.div className="cursor-pointer h-full" onClick={() => onClick(project._id)}>
      <div
        ref={cardRef}
        className="relative group h-full flex flex-col"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={reset}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        }}
      >
        <ProjectImageSlider
          images={allImages}
          currentImageIndex={currentImageIndex}
          isHovered={isHovered}
          isMobile={isMobile}
          hasMultipleImages={hasMultipleImages}
          index={index}
        />

        <ProjectCardEffects
          isHovered={isHovered}
          isMobile={isMobile}
          glareX={glareX}
          glareY={glareY}
        />

        <ProjectCardContent
          project={project}
          isHovered={isHovered}
          isMobile={isMobile}
        />
      </div>
    </motion.div>
  );
};

export default ProjectCard;