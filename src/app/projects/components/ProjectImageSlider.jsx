import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const ProjectImageSlider = ({
  images,
  currentImageIndex,
  isHovered,
  isMobile,
  hasMultipleImages,
  index,
}) => {
  return (
    <div className="overflow-hidden rounded-2xl relative w-full aspect-[4/3] bg-[#f5f5f5]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-full"
        >
          <Image
            src={images[currentImageIndex]}
            alt=""
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority={index < 4}
            unoptimized
          />
        </motion.div>
      </AnimatePresence>

      {!isMobile && hasMultipleImages && isHovered && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, idx) => (
            <div
              key={idx}
              className={`rounded-full ${
                currentImageIndex === idx
                  ? "w-2 h-2 bg-white"
                  : "w-1.5 h-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectImageSlider;