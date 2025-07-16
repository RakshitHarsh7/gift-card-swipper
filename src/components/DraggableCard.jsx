import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
  useVelocity,
  useAnimationControls,
} from "motion/react";
import { cn } from "../utils/cn.js";

export const DraggableCardBody = ({
  className,
  children,
  onSwipe,
  onReset,
  ...props
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardRef = useRef(null);
  const controls = useAnimationControls();
  const [constraints, setConstraints] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });

  // Physics
  const velocityX = useVelocity(mouseX);
  const velocityY = useVelocity(mouseY);

  const springConfig = {
    stiffness: 120,
    damping: 25,
    mass: 0.4,
  };

  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-15, 15]), springConfig);
  const rotateZ = useSpring(useTransform(mouseX, [-200, 200], [-8, 8]), springConfig);

  const opacity = useSpring(useTransform(mouseX, [-400, 0, 400], [0.7, 1, 0.7]), springConfig);
  const glareOpacity = useSpring(useTransform(mouseX, [-300, 0, 300], [0.3, 0, 0.3]), springConfig);
  const glareX = useSpring(useTransform(mouseX, [-300, 300], [-50, 50]), springConfig);

  useEffect(() => {
    // Update constraints when component mounts or window resizes
    const updateConstraints = () => {
      if (typeof window !== "undefined") {
        setConstraints({
          top: -window.innerHeight / 3,
          left: -window.innerWidth / 3,
          right: window.innerWidth / 3,
          bottom: window.innerHeight / 3,
        });
      }
    };

    updateConstraints();

    // Add resize listener
    window.addEventListener("resize", updateConstraints);

    // Clean up
    return () => {
      window.removeEventListener("resize", updateConstraints);
    };
  }, []);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { width, height, left, top } =
      cardRef.current?.getBoundingClientRect() ?? {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
      };
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    mouseX.set(deltaX);
    mouseY.set(deltaY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const resetCard = () => {
    controls.start({
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        ...springConfig,
        duration: 0.6,
      },
    });
    
    if (onReset) {
      onReset();
    }
  };

  // Expose reset function to parent via ref
  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.resetCard = resetCard;
    }
    
    // Initial entrance animation
    controls.start({
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: 0.1
      }
    });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      drag
      dragConstraints={constraints}
      dragElastic={0.2}
      onDragStart={() => {
        document.body.style.cursor = "grabbing";
      }}
      onDragEnd={(event, info) => {
        document.body.style.cursor = "default";

        const currentVelocityX = velocityX.get();
        const currentVelocityY = velocityY.get();

        const velocityMagnitude = Math.sqrt(currentVelocityX * currentVelocityX +
          currentVelocityY * currentVelocityY);
        
        const threshold = 120;
        const distance = Math.sqrt(info.offset.x ** 2 + info.offset.y ** 2);
        
        if (distance > threshold || velocityMagnitude > 600) {
          // Card is being swiped away
          const direction = {
            x: info.offset.x > 0 ? 1 : -1,
            y: info.offset.y > 0 ? 1 : -1
          };
          
          // Enhanced exit animation
          controls.start({
            x: direction.x * 1000,
            y: direction.y * 400 + 600,
            rotateZ: direction.x * 30,
            scale: 0.8,
            opacity: 0,
            transition: {
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94]
            }
          });
          
          if (onSwipe) {
            setTimeout(() => onSwipe(direction), 400);
          }
        } else {
          // Enhanced return animation
          controls.start({
            x: 0,
            y: 0,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
            scale: 1,
            opacity: 1,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 30,
              mass: 0.8,
            },
          });
        }
      }}
      style={{
        rotateX,
        rotateY,
        rotateZ,
        opacity,
        willChange: "transform",
      }}
      initial={{ 
        scale: 0.9, 
        opacity: 0,
        y: 50
      }}
      animate={controls}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative overflow-hidden rounded-3xl shadow-2xl cursor-grab active:cursor-grabbing select-none",
        "backdrop-blur-sm border border-white/20",
        "hover:shadow-purple-500/25 transition-shadow duration-300",
        className
      )}
      {...props}
    >
      {children}
      
      {/* Enhanced glare effect */}
      <motion.div
        style={{
          opacity: glareOpacity,
          x: glareX,
        }}
        className="pointer-events-none absolute inset-0 select-none rounded-3xl"
        initial={false}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform rotate-12 scale-150" />
      </motion.div>
      
      {/* Subtle border animation */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-500/20 via-pink-500/20 to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
};

export const DraggableCardContainer = ({
  className,
  children,
  ...props
}) => {
  return (
    <div 
      className={cn(
        "[perspective:3000px] transform-gpu", 
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};
