// Your custom images - replace these with your own image filenames
const imageUrls = [
    'image1.svg',         // Sample image 1
    'image2.svg',         // Sample image 2
    'image3.svg',         // Sample image 3
    'image4.svg',         // Sample image 4
    // Add more images by adding more lines like:
    // 'your-image1.jpg',
    // 'your-image2.png',
];

// Aceternity UI Card Stack Component
class CardStack {
    constructor(container, images) {
        this.container = container;
        this.images = images;
        this.cards = [];
        this.currentIndex = 0;
        this.init();
    }

    init() {
        this.container.innerHTML = '';
        this.container.className = 'aceternity-card-stack';
        
        // Create cards
        this.images.forEach((image, index) => {
            const card = this.createCard(image, index);
            this.cards.push(card);
            this.container.appendChild(card);
            
            // Add entrance animation with staggered delay
            setTimeout(() => {
                card.classList.add('entering');
            }, index * 150);
        });

        // Setup initial positions after a brief delay
        setTimeout(() => {
            this.updateCardPositions();
        }, 300);
    }

    createCard(imageSrc, index) {
        const card = document.createElement('div');
        card.className = 'aceternity-card';
        card.dataset.index = index;
        
        card.innerHTML = `
            <div class="card-content">
                <img src="${imageSrc}" alt="Card ${index + 1}" class="card-image" />
                <div class="card-overlay">
                    <div class="swipe-indicator left">PASS</div>
                    <div class="swipe-indicator right">LIKE</div>
                </div>
            </div>
        `;

        // Handle image load error with beautiful placeholder
        const img = card.querySelector('.card-image');
        img.onerror = () => {
            const cardContent = card.querySelector('.card-content');
            cardContent.innerHTML = `
                <div style="
                    width: 100%; 
                    height: 100%; 
                    background: ${getRandomColor()}; 
                    display: flex; 
                    flex-direction: column;
                    align-items: center; 
                    justify-content: center; 
                    color: white;
                    text-align: center;
                    font-family: 'Poppins', sans-serif;
                ">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🎁</div>
                    <div style="font-size: 1.2rem; font-weight: 600;">Image not found</div>
                    <div style="font-size: 0.9rem; opacity: 0.8; margin-top: 0.5rem;">Card ${index + 1}</div>
                </div>
                <div class="card-overlay">
                    <div class="swipe-indicator left">PASS</div>
                    <div class="swipe-indicator right">LIKE</div>
                </div>
            `;
        };

        // Add swipe functionality
        this.addSwipeListeners(card, index);
        return card;
    }

    addSwipeListeners(card, index) {
        let startX = 0;
        let startY = 0;
        let currentX = 0;
        let currentY = 0;
        let isDragging = false;
        let initialTransform = '';

        const onStart = (e) => {
            if (index !== this.currentIndex) return; // Only allow top card to be dragged
            
            isDragging = true;
            startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            startY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
            
            card.style.transition = 'none';
            card.style.zIndex = '1000';
            initialTransform = card.style.transform;
            
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onEnd);
            document.addEventListener('touchmove', onMove, { passive: false });
            document.addEventListener('touchend', onEnd);
            
            e.preventDefault();
        };

        const onMove = (e) => {
            if (!isDragging) return;
            
            e.preventDefault();
            
            const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
            const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
            
            currentX = clientX - startX;
            currentY = clientY - startY;
            
            // Calculate rotation and opacity
            const rotation = currentX * 0.1;
            const opacity = Math.max(0.7, 1 - Math.abs(currentX) / 300);
            
            // Apply transform
            card.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotation}deg)`;
            card.style.opacity = opacity;
            
            // Show swipe indicators
            this.updateSwipeIndicators(card, currentX);
        };

        const onEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            
            // Remove event listeners
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onEnd);
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('touchend', onEnd);
            
            const threshold = 100;
            card.style.zIndex = '';
            
            if (Math.abs(currentX) > threshold) {
                this.swipeCard(currentX > 0 ? 'right' : 'left', card);
            } else {
                this.resetCard(card);
            }
            
            this.hideSwipeIndicators(card);
        };

        // Mouse events
        card.addEventListener('mousedown', onStart);
        
        // Touch events
        card.addEventListener('touchstart', onStart, { passive: false });
    }

    updateSwipeIndicators(card, x) {
        const indicators = card.querySelectorAll('.swipe-indicator');
        const threshold = 50;
        
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        if (Math.abs(x) > threshold) {
            const indicator = x > 0 ? 
                card.querySelector('.swipe-indicator.right') : 
                card.querySelector('.swipe-indicator.left');
            
            if (indicator) {
                indicator.classList.add('active');
                indicator.style.opacity = Math.min(1, Math.abs(x) / 100);
            }
        }
    }

    hideSwipeIndicators(card) {
        const indicators = card.querySelectorAll('.swipe-indicator');
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
            indicator.style.opacity = '';
        });
    }

    swipeCard(direction, card) {
        const translateX = direction === 'right' ? '120vw' : '-120vw';
        const rotation = direction === 'right' ? '30deg' : '-30deg';
        
        // Add swipe class for CSS animation
        card.classList.add(`swiped-${direction}`);
        
        card.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        card.style.transform = `translateX(${translateX}) rotate(${rotation}) scale(0.8)`;
        card.style.opacity = '0';
        card.style.filter = 'blur(2px)';
        
        // Trigger celebration effect for right swipes
        if (direction === 'right') {
            this.createMiniConfetti(card);
        }
        
        setTimeout(() => {
            card.remove();
            this.currentIndex++;
            this.updateCardPositions();
            
            if (this.currentIndex >= this.images.length) {
                this.showEmptyState();
            }
        }, 600);
    }

    createMiniConfetti(card) {
        const rect = card.getBoundingClientRect();
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = (rect.left + rect.width / 2) + 'px';
            particle.style.top = (rect.top + rect.height / 2) + 'px';
            particle.style.width = '6px';
            particle.style.height = '6px';
            particle.style.backgroundColor = ['#ff6b6b', '#ffd700', '#74b9ff', '#55efc4'][i % 4];
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1000';
            
            const angle = (i / 10) * Math.PI * 2;
            const distance = 50 + Math.random() * 50;
            const endX = Math.cos(angle) * distance;
            const endY = Math.sin(angle) * distance;
            
            particle.style.transition = 'all 0.8s ease-out';
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.style.transform = `translate(${endX}px, ${endY}px) scale(0)`;
                particle.style.opacity = '0';
            }, 10);
            
            setTimeout(() => particle.remove(), 800);
        }
    }

    resetCard(card) {
        card.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        card.style.transform = '';
        card.style.opacity = '1';
        
        setTimeout(() => {
            card.style.transition = '';
        }, 300);
    }

    updateCardPositions() {
        this.cards.forEach((card, index) => {
            const relativeIndex = index - this.currentIndex;
            
            if (relativeIndex < 0) return; // Already swiped
            
            card.style.transition = 'transform 0.4s ease-out, opacity 0.4s ease-out';
            
            switch (relativeIndex) {
                case 0:
                    card.style.transform = 'scale(1) translateY(0px)';
                    card.style.zIndex = '10';
                    card.style.opacity = '1';
                    break;
                case 1:
                    card.style.transform = 'scale(0.95) translateY(10px)';
                    card.style.zIndex = '9';
                    card.style.opacity = '0.8';
                    break;
                case 2:
                    card.style.transform = 'scale(0.9) translateY(20px)';
                    card.style.zIndex = '8';
                    card.style.opacity = '0.6';
                    break;
                default:
                    card.style.transform = 'scale(0.85) translateY(30px)';
                    card.style.zIndex = '7';
                    card.style.opacity = '0.4';
                    break;
            }
        });
    }

    showEmptyState() {
        const emptyState = document.createElement('div');
        emptyState.className = 'aceternity-empty-state';
        emptyState.innerHTML = `
            <div class="empty-icon">🎉</div>
            <h3>All cards viewed!</h3>
            <p>Click reset to see them again</p>
            <button class="reset-button" onclick="resetCardStack()">Reset Cards</button>
        `;
        
        this.container.appendChild(emptyState);
        
        // Trigger show animation
        setTimeout(() => {
            emptyState.classList.add('show');
        }, 100);
    }

    // Public method to swipe programmatically
    swipeCurrentCard(direction) {
        const currentCard = this.cards[this.currentIndex];
        if (currentCard) {
            this.swipeCard(direction, currentCard);
        }
    }

    reset() {
        this.currentIndex = 0;
        this.init();
    }
}

// Global variables
let cardStackInstance;

// Get DOM elements
const giftContainer = document.getElementById('giftContainer');
const giftBox = document.getElementById('giftBox');
const imagesContainer = document.getElementById('imagesContainer');
const confettiContainer = document.getElementById('confettiContainer');

let isGiftOpened = false;
let currentCards = [];
let currentCardIndex = 0;

// Gift click event
giftContainer.addEventListener('click', function() {
    if (isGiftOpened) return;
    
    isGiftOpened = true;
    
    // Add opened class to trigger lid animation
    giftBox.classList.add('gift-opened');
    
    // Wait a bit for the lid animation, then show cards
    setTimeout(() => {
        showSwipeCards();
        createConfetti();
    }, 800);
});

// Function to show swipe cards with Aceternity UI
function showSwipeCards() {
    // Show images container
    imagesContainer.classList.add('active');
    
    // Create main container
    const cardContainer = document.createElement('div');
    cardContainer.className = 'aceternity-main-container';
    cardContainer.id = 'cardContainer';
    
    // Create control buttons
    const controls = document.createElement('div');
    controls.className = 'aceternity-controls';
    controls.innerHTML = `
        <button class="control-button reject" onclick="swipeCurrentCard('left')">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
        <button class="control-button like" onclick="swipeCurrentCard('right')">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
        </button>
    `;
    
    // Clear container and add new elements
    imagesContainer.innerHTML = '';
    imagesContainer.appendChild(cardContainer);
    imagesContainer.appendChild(controls);
    
    // Initialize Aceternity Card Stack
    cardStackInstance = new CardStack(cardContainer, imageUrls);
}

// Global functions for controls
function swipeCurrentCard(direction) {
    if (cardStackInstance) {
        cardStackInstance.swipeCurrentCard(direction);
    }
}

function resetCardStack() {
    if (cardStackInstance) {
        cardStackInstance.reset();
    }
}

// Additional utility functions
function getRandomColor() {
    const colors = [
        'linear-gradient(45deg, #ff6b6b, #ee5a24)',
        'linear-gradient(45deg, #74b9ff, #0984e3)',
        'linear-gradient(45deg, #55efc4, #00b894)',
        'linear-gradient(45deg, #fd79a8, #e84393)',
        'linear-gradient(45deg, #fdcb6e, #e17055)'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Confetti creation function
function createConfetti() {
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confettiContainer.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Sparkle effects
function createSparkle() {
    const sparkle = document.createElement('div');
    sparkle.innerHTML = '✨';
    sparkle.style.position = 'fixed';
    sparkle.style.fontSize = '20px';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '100';
    sparkle.style.left = Math.random() * window.innerWidth + 'px';
    sparkle.style.top = Math.random() * window.innerHeight + 'px';
    sparkle.style.animation = 'sparkleFloat 3s ease-out forwards';
    
    // Add sparkle animation
    if (!document.querySelector('#sparkle-styles')) {
        const style = document.createElement('style');
        style.id = 'sparkle-styles';
        style.textContent = `
            @keyframes sparkleFloat {
                0% {
                    opacity: 0;
                    transform: translateY(0) scale(0);
                }
                50% {
                    opacity: 1;
                    transform: translateY(-20px) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translateY(-40px) scale(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(sparkle);
    
    // Remove sparkle after animation
    setTimeout(() => {
        sparkle.remove();
    }, 3000);
}

// Keyboard and accessibility
document.addEventListener('keydown', function(e) {
    if (!isGiftOpened) {
        // Gift box controls
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            giftContainer.click();
        }
    } else {
        // Card swipe controls
        switch(e.key) {
            case 'ArrowLeft':
                swipeCurrentCard('left');
                break;
            case 'ArrowRight':
                swipeCurrentCard('right');
                break;
            case 'r':
            case 'R':
                resetCardStack();
                break;
        }
    }
});

// Initialize sparkles on page load
window.addEventListener('load', function() {
    setInterval(createSparkle, 3000);
});

// Accessibility setup
giftContainer.setAttribute('tabindex', '0');
giftContainer.setAttribute('role', 'button');
giftContainer.setAttribute('aria-label', 'Click to open gift and reveal swipeable image cards');
