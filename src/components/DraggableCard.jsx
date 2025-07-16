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
    stiffness: 100,
    damping: 20,
    mass: 0.5,
  };

  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [25, -25]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-25, 25]), springConfig);

  const opacity = useSpring(useTransform(mouseX, [-300, 0, 300], [0.8, 1, 0.8]), springConfig);
  const glareOpacity = useSpring(useTransform(mouseX, [-300, 0, 300], [0.2, 0, 0.2]), springConfig);

  useEffect(() => {
    // Update constraints when component mounts or window resizes
    const updateConstraints = () => {
      if (typeof window !== "undefined") {
        setConstraints({
          top: -window.innerHeight / 2,
          left: -window.innerWidth / 2,
          right: window.innerWidth / 2,
          bottom: window.innerHeight / 2,
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
  }, []);

  return (
    <motion.div
      ref={cardRef}
      drag
      dragConstraints={constraints}
      onDragStart={() => {
        document.body.style.cursor = "grabbing";
      }}
      onDragEnd={(event, info) => {
        document.body.style.cursor = "default";

        controls.start({
          rotateX: 0,
          rotateY: 0,
          transition: {
            type: "spring",
            ...springConfig,
          },
        });
        
        const currentVelocityX = velocityX.get();
        const currentVelocityY = velocityY.get();

        const velocityMagnitude = Math.sqrt(currentVelocityX * currentVelocityX +
          currentVelocityY * currentVelocityY);
        
        const threshold = 100;
        const distance = Math.sqrt(info.offset.x ** 2 + info.offset.y ** 2);
        
        if (distance > threshold || velocityMagnitude > 500) {
          // Card is being swiped away
          const direction = {
            x: info.offset.x > 0 ? 1 : -1,
            y: info.offset.y > 0 ? 1 : -1
          };
          
          // Animate card away with physics
          controls.start({
            x: direction.x * 800,
            y: direction.y * 300 + 500,
            rotateZ: direction.x * 45,
            scale: 0.7,
            opacity: 0,
            transition: {
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94]
            }
          });
          
          if (onSwipe) {
            setTimeout(() => onSwipe(direction), 600);
          }
        } else {
          // Reset position
          resetCard();
        }
      }}
      style={{
        rotateX,
        rotateY,
        opacity,
        willChange: "transform",
      }}
      animate={controls}
      whileHover={{ scale: 1.02 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative min-h-96 w-80 overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 to-violet-500 shadow-2xl cursor-grab active:cursor-grabbing select-none",
        className
      )}
      {...props}
    >
      {children}
      <motion.div
        style={{
          opacity: glareOpacity,
        }}
        className="pointer-events-none absolute inset-0 bg-white/20 select-none rounded-3xl" 
      />
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
      className={cn("[perspective:3000px]", className)} 
      {...props}
    >
      {children}
    </div>
  );
};
