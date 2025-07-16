import React, { useState, useRef, useEffect } from 'react';
import { DraggableCardContainer, DraggableCardBody } from './DraggableCard.jsx';
import { cn } from '../utils/cn.js';

const CardStack = () => {
  const [cards, setCards] = useState([
    {
      id: 1,
      image: '/image1.svg',
      title: 'Gift Card 1',
      subtitle: 'Special Offer',
      description: 'Get 20% off on your next purchase'
    },
    {
      id: 2,
      image: '/image2.svg',
      title: 'Gift Card 2',
      subtitle: 'Premium Deal',
      description: 'Exclusive access to premium features'
    },
    {
      id: 3,
      image: '/image3.svg',
      title: 'Gift Card 3',
      subtitle: 'Limited Time',
      description: 'Flash sale - 50% off everything'
    },
    {
      id: 4,
      image: '/image4.svg',
      title: 'Gift Card 4',
      subtitle: 'VIP Access',
      description: 'Join our VIP membership program'
    }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRefs = useRef([]);

  // Confetti effect
  const createConfetti = () => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'];
    const confettiContainer = document.getElementById('confetti-container');
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-piece';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.animationDelay = Math.random() * 3 + 's';
      confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
      confettiContainer.appendChild(confetti);
      
      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti);
        }
      }, 5000);
    }
  };

  // Sparkle effect
  const createSparkles = () => {
    const sparkleContainer = document.getElementById('sparkle-container');
    
    for (let i = 0; i < 20; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.left = Math.random() * 100 + '%';
      sparkle.style.top = Math.random() * 100 + '%';
      sparkle.style.animationDelay = Math.random() * 2 + 's';
      sparkleContainer.appendChild(sparkle);
      
      setTimeout(() => {
        if (sparkle.parentNode) {
          sparkle.parentNode.removeChild(sparkle);
        }
      }, 3000);
    }
  };

  const handleSwipe = (direction) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    createConfetti();
    createSparkles();
    
    setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
      setIsAnimating(false);
    }, 300);
  };

  const resetCards = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentIndex(0);
    
    // Reset all card positions
    cardRefs.current.forEach(cardRef => {
      if (cardRef && cardRef.resetCard) {
        cardRef.resetCard();
      }
    });
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const nextCard = () => {
    if (currentIndex < cards.length - 1 && !isAnimating) {
      handleSwipe({ x: 1, y: 0 });
    }
  };

  const prevCard = () => {
    if (currentIndex > 0 && !isAnimating) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextCard();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevCard();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        resetCards();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isAnimating]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-4">
      {/* Effects containers */}
      <div id="confetti-container" className="fixed inset-0 pointer-events-none z-50"></div>
      <div id="sparkle-container" className="fixed inset-0 pointer-events-none z-40"></div>
      
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          Gift Card Stack
        </h1>
        <p className="text-lg text-white/80 mb-2">
          Swipe, drag, or use arrow keys to navigate
        </p>
        <p className="text-sm text-white/60">
          Card {currentIndex + 1} of {cards.length}
        </p>
      </div>

      {/* Card Stack Container */}
      <div className="relative">
        <DraggableCardContainer className="w-80 h-96 md:w-96 md:h-[450px]">
          {cards.map((card, index) => {
            const isVisible = index >= currentIndex;
            const stackIndex = index - currentIndex;
            
            if (!isVisible) return null;
            
            return (
              <DraggableCardBody
                key={card.id}
                ref={el => cardRefs.current[index] = el}
                className={cn(
                  "absolute inset-0 transition-all duration-300",
                  stackIndex > 0 && "pointer-events-none"
                )}
                style={{
                  zIndex: cards.length - stackIndex,
                  transform: `translateY(${stackIndex * 8}px) scale(${1 - stackIndex * 0.05})`,
                  opacity: 1 - stackIndex * 0.2,
                }}
                onSwipe={stackIndex === 0 ? handleSwipe : undefined}
              >
                <div className="w-full h-full p-6 flex flex-col items-center justify-center text-white">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-24 h-24 md:w-32 md:h-32 mb-6 object-contain"
                    draggable={false}
                  />
                  <h3 className="text-2xl md:text-3xl font-bold mb-2 text-center">
                    {card.title}
                  </h3>
                  <p className="text-lg md:text-xl text-white/80 mb-4 text-center">
                    {card.subtitle}
                  </p>
                  <p className="text-sm md:text-base text-white/70 text-center">
                    {card.description}
                  </p>
                </div>
              </DraggableCardBody>
            );
          })}
        </DraggableCardContainer>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={prevCard}
          disabled={currentIndex === 0 || isAnimating}
          className="px-6 py-3 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:opacity-50 text-white rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/20"
          aria-label="Previous card"
        >
          ← Previous
        </button>
        
        <button
          onClick={resetCards}
          disabled={isAnimating}
          className="px-6 py-3 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:opacity-50 text-white rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/20"
          aria-label="Reset cards"
        >
          ↻ Reset
        </button>
        
        <button
          onClick={nextCard}
          disabled={currentIndex === cards.length - 1 || isAnimating}
          className="px-6 py-3 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:opacity-50 text-white rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/20"
          aria-label="Next card"
        >
          Next →
        </button>
      </div>

      {/* Instructions */}
      <div className="text-center mt-6 text-white/60 text-sm max-w-md">
        <p className="mb-2">
          <strong>Desktop:</strong> Click and drag cards or use arrow keys
        </p>
        <p>
          <strong>Mobile:</strong> Swipe cards in any direction
        </p>
      </div>
    </div>
  );
};

export default CardStack;
