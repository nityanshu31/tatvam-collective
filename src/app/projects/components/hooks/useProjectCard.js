// /app/projects/components/hooks/useProjectCard.js

import { useState, useRef, useEffect, useMemo } from "react";

export const useProjectCard = (project) => {
  const cardRef = useRef(null);
  const autoRotateInterval = useRef(null);

  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glareX, setGlareX] = useState(50);
  const [glareY, setGlareY] = useState(50);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const allImages = useMemo(() => {
    const images = [];
    const set = new Set();

    if (project.image) {
      images.push(project.image);
      set.add(project.image);
    }

    if (project.gallery) {
      project.gallery.forEach((img) => {
        if (!set.has(img)) {
          images.push(img);
          set.add(img);
        }
      });
    }

    return images;
  }, [project]);

  const hasMultipleImages = allImages.length > 1;

  useEffect(() => {
    if (!isMobile && isHovered && hasMultipleImages) {
      autoRotateInterval.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
      }, 2000);
    } else {
      clearInterval(autoRotateInterval.current);
      if (!isHovered) setCurrentImageIndex(0);
    }

    return () => clearInterval(autoRotateInterval.current);
  }, [isHovered, isMobile, hasMultipleImages]);

  const handleMouseMove = (e) => {
    if (!cardRef.current || isMobile) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setRotateX(((y - centerY) / centerY) * -3);
    setRotateY(((x - centerX) / centerX) * 3);
    setGlareX((x / rect.width) * 100);
    setGlareY((y / rect.height) * 100);
  };

  const reset = () => {
    setRotateX(0);
    setRotateY(0);
    setGlareX(50);
    setGlareY(50);
    setIsHovered(false);
  };

  return {
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
  };
};