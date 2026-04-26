const ProjectCardEffects = ({ isHovered, isMobile, glareX, glareY }) => {
  return (
    <>
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-500 ${
          isHovered && !isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      />

      {!isMobile && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity"
          style={{
            background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.8), transparent 60%)`,
          }}
        />
      )}
    </>
  );
};

export default ProjectCardEffects;