# 🎓 EduAI - AI Difficulty Analyzer Tool

A professional AI-powered education assessment tool for analyzing question difficulty and aligning assessments with global academic standards.

![Version](https://img.shields.io/badge/version-2.4.1-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🏠 Landing Page
- Modern hero section with gradient text
- Interactive mockup card with live chart
- Feature showcase with hover animations
- Testimonial section with glassmorphism
- Fully responsive design

### 🔍 Question Analyzer
- Real-time difficulty analysis (0-100 score)
- Automatic Bloom's Taxonomy detection
- AI-powered suggestions
- Circular progress visualization
- Subject-specific analysis
- Dark theme UI

### 📊 Analytics Dashboard
- Interactive Chart.js donut chart
- Real-time statistics cards
- Recent insights with color-coded alerts
- Questions table with filtering
- Sidebar navigation
- Theme toggle (dark/light)

## 🚀 Quick Start

### Option 1: Direct Open
1. Navigate to the project folder
2. Double-click `index.html` to open in your browser

### Option 2: Local Server (Recommended)
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

Then open: `http://localhost:8000`

## 📁 Project Structure

```
mini project/
├── index.html              # Landing page
├── analyzer.html           # Question analyzer
├── dashboard.html          # Analytics dashboard
├── css/
│   └── style.css          # All styles (2000+ lines)
└── js/
    └── script.js          # Interactive functionality
```

## 🎯 How to Use

### Analyze a Question

1. Open `analyzer.html`
2. Select a subject from the dropdown
3. Enter your question in the textarea
4. Click **"Analyze Difficulty"**
5. View the results:
   - Difficulty score (0-100)
   - Bloom's taxonomy level
   - AI confidence rating
   - Personalized suggestions

### View Analytics

1. Open `dashboard.html`
2. Explore:
   - Total analyzed questions
   - Average difficulty metrics
   - Difficulty distribution chart
   - Recent insights and trends
   - Question history table

## 🎨 Design Features

- **Modern Aesthetics**: Vibrant gradients and glassmorphism
- **Dark Theme**: Professional dark mode interface
- **Smooth Animations**: Micro-interactions for better UX
- **Responsive**: Works on desktop, tablet, and mobile
- **Accessible**: High contrast and semantic HTML

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Custom properties, Grid, Flexbox, Animations
- **JavaScript (ES6+)**: DOM manipulation, async operations
- **Chart.js**: Data visualization
- **Google Fonts**: Inter typeface

## 📱 Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+

## 🎓 Educational Use Cases

- **Teachers**: Analyze exam questions for difficulty balance
- **Curriculum Designers**: Ensure proper cognitive level distribution
- **Test Creators**: Align questions with learning objectives
- **Educational Institutions**: Standardize assessment quality

## 📊 Difficulty Classification

| Score Range | Difficulty | Bloom's Level | Description |
|-------------|-----------|---------------|-------------|
| 0-40 | Easy | Remember/Understand | Recall & Recognition |
| 41-75 | Medium | Apply/Analyze | Application & Analysis |
| 76-100 | Hard | Evaluate/Create | Synthesis & Evaluation |

## 🔧 Customization

### Change Colors
Edit CSS variables in `css/style.css`:
```css
:root {
    --primary-blue: #3B82F6;
    --success: #10B981;
    --warning: #F59E0B;
    --error: #EF4444;
}
```

### Modify Difficulty Ranges
Edit JavaScript in `js/script.js`:
```javascript
if (score <= 40) {
    difficulty = 'EASY';
} else if (score <= 75) {
    difficulty = 'MEDIUM';
} else {
    difficulty = 'HARD';
}
```

## 🐛 Troubleshooting

### Charts not showing?
- Check internet connection (Chart.js loads from CDN)
- Ensure JavaScript is enabled

### Fonts look different?
- Check internet connection (Google Fonts)
- Fallback fonts will load automatically

### Responsive issues?
- Clear browser cache
- Try a different browser
- Check viewport meta tag

## 📝 License

MIT License - feel free to use for educational purposes.

## 🤝 Contributing

This is an educational project. Feel free to:
- Fork the repository
- Add new features
- Improve the UI/UX
- Fix bugs
- Enhance documentation

## 📧 Support

For questions or issues, please refer to the walkthrough documentation.

## 🎉 Acknowledgments

- Design inspired by modern SaaS applications
- Icons: Custom SVG designs
- Charts: Chart.js library
- Fonts: Google Fonts (Inter)

---

**Built with ❤️ for better education**

Version 2.4.1 | © 2024 EduAI - AI Difficulty Analyzer Tool
