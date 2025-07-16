import React, { useState, useRef, useEffect } from 'react';
import { DraggableCardContainer, DraggableCardBody } from './DraggableCard.jsx';
import { cn } from '../utils/cn.js';

const CardStack = () => {
  const [cards, setCards] = useState([
    {
      id: 1,
      image: '/image1.svg',
      title: 'Premium Gift Card',
      subtitle: 'Exclusive Offer',
      description: 'Get 25% off on your next premium purchase',
      gradient: 'from-violet-600 via-purple-600 to-blue-600'
    },
    {
      id: 2,
      image: '/image2.svg',
      title: 'VIP Experience',
      subtitle: 'Limited Access',
      description: 'Unlock exclusive VIP features and benefits',
      gradient: 'from-pink-500 via-red-500 to-yellow-500'
    },
    {
      id: 3,
      image: '/image3.svg',
      title: 'Flash Sale',
      subtitle: 'Time Limited',
      description: 'Amazing discounts for the next 24 hours',
      gradient: 'from-green-400 via-blue-500 to-purple-600'
    },
    {
      id: 4,
      image: '/image4.svg',
      title: 'Collector\'s Edition',
      subtitle: 'Rare & Special',
      description: 'Limited edition items available now',
      gradient: 'from-yellow-400 via-orange-500 to-red-500'
    }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const cardRefs = useRef([]);

  // Enhanced confetti effect
  const createConfetti = () => {
    setShowCelebration(true);
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8', '#fd79a8', '#fdcb6e'];
    const confettiContainer = document.getElementById('confetti-container');
    
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-piece';
      confetti.style.cssText = `
        position: fixed;
        width: ${Math.random() * 8 + 4}px;
        height: ${Math.random() * 8 + 4}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}%;
        top: -10px;
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
        animation-delay: ${Math.random() * 0.5}s;
      `;
      confettiContainer.appendChild(confetti);
      
      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti);
        }
      }, 5000);
    }
    
    setTimeout(() => setShowCelebration(false), 3000);
  };

  // Enhanced sparkle effect
  const createSparkles = () => {
    const sparkleContainer = document.getElementById('sparkle-container');
    
    for (let i = 0; i < 30; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.innerHTML = ['✨', '⭐', '💫', '🌟'][Math.floor(Math.random() * 4)];
      sparkle.style.cssText = `
        position: fixed;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        font-size: ${Math.random() * 10 + 15}px;
        pointer-events: none;
        z-index: 999;
        animation: sparkle ${Math.random() * 2 + 1}s ease-out forwards;
        animation-delay: ${Math.random() * 1}s;
      `;
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
    }, 600);
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
    
    // Add a celebration for reset
    createSparkles();
    
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Effects containers */}
      <div id="confetti-container" className="fixed inset-0 pointer-events-none z-50"></div>
      <div id="sparkle-container" className="fixed inset-0 pointer-events-none z-40"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-purple-400 mb-6 tracking-tight">
            Gift Card Stack
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-4 font-light">
            Swipe, drag, or use arrow keys to navigate
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="h-2 w-2 bg-violet-400 rounded-full animate-pulse"></div>
            <p className="text-lg text-white/60">
              Card {currentIndex + 1} of {cards.length}
            </p>
            <div className="h-2 w-2 bg-pink-400 rounded-full animate-pulse animation-delay-500"></div>
          </div>
        </div>

        {/* Card Stack Container */}
        <div className="relative mb-12">
          <DraggableCardContainer className="w-80 h-[500px] md:w-96 md:h-[600px]">
            {cards.map((card, index) => {
              const isVisible = index >= currentIndex;
              const stackIndex = index - currentIndex;
              
              if (!isVisible) return null;
              
              return (
                <DraggableCardBody
                  key={card.id}
                  ref={el => cardRefs.current[index] = el}
                  className={cn(
                    "absolute inset-0 transition-all duration-500 backdrop-blur-sm border border-white/10",
                    `bg-gradient-to-br ${card.gradient}`,
                    stackIndex > 0 && "pointer-events-none"
                  )}
                  style={{
                    zIndex: cards.length - stackIndex,
                    transform: `translateY(${stackIndex * 12}px) scale(${1 - stackIndex * 0.04})`,
                    opacity: Math.max(0.3, 1 - stackIndex * 0.15),
                  }}
                  onSwipe={stackIndex === 0 ? handleSwipe : undefined}
                >
                  <div className="w-full h-full p-8 flex flex-col items-center justify-center text-white relative">
                    {/* Card content with better error handling */}
                    <div className="w-32 h-32 md:w-40 md:h-40 mb-8 relative">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-full object-contain drop-shadow-2xl"
                        draggable={false}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full hidden items-center justify-center text-6xl bg-white/10 rounded-2xl backdrop-blur-sm">
                        🎁
                      </div>
                    </div>
                    
                    <div className="text-center space-y-4">
                      <h3 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
                        {card.title}
                      </h3>
                      <p className="text-xl md:text-2xl text-white/90 font-medium">
                        {card.subtitle}
                      </p>
                      <p className="text-base md:text-lg text-white/80 leading-relaxed max-w-sm">
                        {card.description}
                      </p>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute top-4 right-4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-4 left-4 w-2 h-2 bg-white/20 rounded-full animate-pulse animation-delay-1000"></div>
                  </div>
                </DraggableCardBody>
              );
            })}
          </DraggableCardContainer>

          {/* Stack indicator */}
          {currentIndex < cards.length - 1 && (
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {cards.slice(currentIndex).map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    index === 0 ? "bg-white" : "bg-white/30"
                  )}
                />
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Control Buttons */}
        <div className="flex gap-6 mb-8">
          <button
            onClick={prevCard}
            disabled={currentIndex === 0 || isAnimating}
            className="px-8 py-4 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 disabled:from-slate-900 disabled:to-slate-800 disabled:opacity-50 text-white rounded-2xl transition-all duration-300 backdrop-blur-sm border border-white/10 shadow-2xl hover:shadow-purple-500/25 hover:scale-105 disabled:hover:scale-100 font-medium text-lg"
            aria-label="Previous card"
          >
            ← Previous
          </button>
          
          <button
            onClick={resetCards}
            disabled={isAnimating}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-purple-800 disabled:to-pink-800 disabled:opacity-50 text-white rounded-2xl transition-all duration-300 backdrop-blur-sm border border-white/10 shadow-2xl hover:shadow-purple-500/50 hover:scale-105 disabled:hover:scale-100 font-medium text-lg"
            aria-label="Reset cards"
          >
            ↻ Reset
          </button>
          
          <button
            onClick={nextCard}
            disabled={currentIndex === cards.length - 1 || isAnimating}
            className="px-8 py-4 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 disabled:from-slate-900 disabled:to-slate-800 disabled:opacity-50 text-white rounded-2xl transition-all duration-300 backdrop-blur-sm border border-white/10 shadow-2xl hover:shadow-purple-500/25 hover:scale-105 disabled:hover:scale-100 font-medium text-lg"
            aria-label="Next card"
          >
            Next →
          </button>
        </div>

        {/* Instructions */}
        <div className="text-center max-w-2xl">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <p className="text-white/80 text-lg mb-2 font-medium">
              <span className="text-violet-400 font-semibold">Desktop:</span> Click and drag cards or use arrow keys
            </p>
            <p className="text-white/80 text-lg">
              <span className="text-pink-400 font-semibold">Mobile:</span> Swipe cards in any direction
            </p>
          </div>
        </div>

        {/* Celebration overlay */}
        {showCelebration && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-30">
            <div className="text-6xl animate-bounce">🎉</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardStack;
