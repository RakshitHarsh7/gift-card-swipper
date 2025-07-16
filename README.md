# 🎁 Gift Card Swiper - Aceternity UI Style

A beautiful, interactive gift box that reveals swipeable image cards with smooth Aceternity UI-style animations and effects.

## ✨ Features

- **Interactive Gift Box** - Click to reveal the surprise
- **Aceternity UI Card Stack** - Professional draggable card component
- **Smooth Swipe Gestures** - Left/right only with natural physics
- **Beautiful Animations** - 3D entrance effects and smooth transitions
- **Swipe Indicators** - Visual feedback during drag interactions
- **Mini Confetti** - Celebration effects on card likes
- **Responsive Design** - Works on desktop and mobile
- **Keyboard Controls** - Arrow keys for swiping, R for reset
- **Accessibility** - Screen reader friendly with proper ARIA labels

## 🚀 Live Demo

[View Live Demo](https://your-username.github.io/gift-card-swiper)

## 🎮 How to Use

1. **Click the gift box** to start the experience
2. **Drag cards left or right** to swipe through images
3. **Use control buttons** for manual swiping
4. **Keyboard shortcuts**:
   - `←` Arrow Left: Swipe left (Pass)
   - `→` Arrow Right: Swipe right (Like)
   - `R`: Reset cards

## 🛠️ Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/gift-card-swiper.git
   cd gift-card-swiper
   ```

2. **Add your own images**:
   - Place your images in the project folder
   - Update the `imageUrls` array in `script.js`:
   ```javascript
   const imageUrls = [
       'your-photo1.jpg',
       'your-photo2.png',
       'your-photo3.gif',
       // Add more images...
   ];
   ```

3. **Open `index.html`** in your browser to enjoy!

## 📁 Project Structure

```
gift-card-swiper/
├── index.html          # Main HTML file
├── styles.css          # Aceternity UI styles and animations
├── script.js           # CardStack class and interaction logic
├── image1.svg          # Sample images (replace with your own)
├── image2.svg
├── image3.svg
├── image4.svg
└── README.md           # This file
```

## 🎨 Customization

### Adding Your Images
Replace the sample SVG files with your own images and update the `imageUrls` array:

```javascript
const imageUrls = [
    'family-photo1.jpg',
    'vacation-pic.png',
    'pet-video.gif',
    'memories.webp',
];
```

### Styling
The project uses CSS custom properties for easy theming. Key variables are in `styles.css`.

## 🔧 Technical Details

- **Pure JavaScript** - No frameworks required
- **CSS3 Animations** - Smooth 60fps animations
- **Touch Support** - Full mobile compatibility  
- **Modern Browser Support** - Uses latest web standards
- **Accessibility** - WCAG compliant with keyboard navigation

## 🎊 Effects Included

- **Gift Box Animation** - 3D lid opening effect
- **Card Stack Physics** - Realistic card layering
- **Swipe Animations** - Smooth drag and release
- **Confetti System** - Celebration particles
- **Sparkle Effects** - Ambient floating animations
- **Glassmorphism** - Modern frosted glass effects

## 📱 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🤝 Contributing

Feel free to submit issues and pull requests to improve the project!

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

Made with ❤️ using Aceternity UI design principles
