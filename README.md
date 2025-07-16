# Gift Card Swiper 🎁

A beautiful, interactive swipeable card stack built with **React**, **Motion**, and **Aceternity UI** design patterns. Features smooth drag/swipe physics, stunning visual effects, and responsive design for both desktop and mobile.

## 🌟 Features

- **Modern React Implementation**: Built with React 19 and Vite for optimal performance
- **Motion Physics**: Powered by Motion library for fluid drag/swipe interactions
- **Aceternity UI Design**: Implements the renowned Aceternity UI draggable card component pattern
- **Smooth Animations**: 3D transforms, spring physics, and realistic drag behavior
- **Mobile Optimized**: Touch-friendly with responsive design and mobile-specific optimizations
- **Visual Effects**: Confetti celebrations and sparkle animations
- **Keyboard Accessible**: Full keyboard navigation support (arrow keys, spacebar, 'R' for reset)
- **Tailwind Styled**: Clean, modern UI with Tailwind CSS utility classes

## 🚀 Live Demo

Visit the live demo: [https://rakshitharsh7.github.io/gift-card-swipper/](https://rakshitharsh7.github.io/gift-card-swipper/)

## 🛠️ Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Animation**: Motion (Framer Motion successor)
- **Styling**: Tailwind CSS + Custom CSS
- **Utilities**: clsx, tailwind-merge
- **Deployment**: GitHub Pages with GitHub Actions

## 🎮 How to Use

### Desktop
- **Drag**: Click and drag cards in any direction
- **Keyboard**: Use arrow keys to navigate, 'R' to reset
- **Hover**: Cards respond with 3D tilt effects

### Mobile
- **Swipe**: Touch and swipe cards in any direction
- **Tap**: Use the control buttons for navigation

## � Development Setup

### Prerequisites
- Node.js 18+ 
- npm

### Installation
```bash
# Clone the repository
git clone https://github.com/RakshitHarsh7/gift-card-swipper.git
cd gift-card-swipper

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production  
npm run preview  # Preview production build
```

## 🎨 Components

### DraggableCardBody
The main draggable card component that implements:
- Physics-based drag interactions
- 3D rotation and tilt effects
- Velocity-based swipe detection
- Spring animations for natural movement

### DraggableCardContainer  
Container component that provides:
- 3D perspective context
- Proper positioning and constraints
- Stack management

### CardStack
Main application component featuring:
- Card state management
- Swipe handling and effects
- Reset functionality
- Control buttons and accessibility

## 🎯 Key Features in Detail

### Physics & Interactions
- **Spring Animations**: Realistic bounce and settle effects
- **Velocity Detection**: Swipe sensitivity based on speed and distance
- **3D Transforms**: Rotation, tilt, and perspective effects
- **Constraint System**: Intelligent drag boundaries

### Visual Effects
- **Glare Effect**: Dynamic lighting based on mouse position
- **Confetti Burst**: Celebration effect on successful swipes
- **Sparkle Animation**: Ambient particle effects
- **Stack Preview**: Subtle depth visualization for upcoming cards

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Friendly**: Proper ARIA labels and semantic HTML
- **Focus Management**: Clear focus indicators
- **Reduced Motion**: Respects user motion preferences

## 🔧 Customization

### Adding New Cards
Edit `src/components/CardStack.jsx` to add more cards:

```jsx
const [cards, setCards] = useState([
  {
    id: 1,
    image: '/your-image.svg',
    title: 'Your Title',
    subtitle: 'Your Subtitle', 
    description: 'Your description'
  },
  // Add more cards...
]);
```

### Styling
- Modify `src/index.css` for global styles
- Update `tailwind.config.js` for custom Tailwind configuration
- Customize component styles in individual `.jsx` files

### Physics Tuning
Adjust motion parameters in `DraggableCard.jsx`:

```jsx
const springConfig = {
  stiffness: 100,    // Spring stiffness
  damping: 20,       // Spring damping
  mass: 0.5,         // Mass for physics
};
```

## 📱 Mobile Optimization

- **Touch Events**: Optimized touch handling with preventDefault
- **Responsive Design**: Fluid scaling across device sizes  
- **Performance**: Efficient rendering and animation optimization
- **Gesture Recognition**: Natural swipe gesture detection

## 🚀 Deployment

The project auto-deploys to GitHub Pages using GitHub Actions when pushing to the main branch.

For manual deployment:
```bash
npm run build
# Deploy the dist/ folder to your hosting service
```

## 🎭 Aceternity UI Integration

This implementation follows the Aceternity UI draggable card component pattern:
- Physics-based interactions with `useMotionValue` and `useSpring`
- Velocity tracking with `useVelocity`
- Animation controls with `useAnimationControls`  
- Proper constraint handling and 3D perspective
- Mouse tracking for interactive tilt effects

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- **Aceternity UI** for the incredible draggable card design patterns
- **Motion** (Framer Motion) for the outstanding animation library
- **Tailwind CSS** for the utility-first styling approach
- **Vite** for the blazing fast development experience
