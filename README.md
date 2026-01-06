# 🍅 Pomodoro Quest

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-orange)
![License](https://img.shields.io/badge/license-MIT-green)
![Made with](https://img.shields.io/badge/made%20with-❤️-red)

**Level up your productivity with retro gaming vibes!**

A Pomodoro timer application with retro pixel art aesthetics, gamification elements, and 8-bit sound effects.

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack)

</div>

---

## ✨ Features

### ⏱️ **Timer System**
- Customizable focus duration (1-120 minutes)
- Customizable rest duration (1-60 minutes)
- Start, pause, and reset controls
- Visual countdown display with retro styling
- Total focus time tracking

### 📋 **Quest Log (To-Do List)**
- Add and manage quests/tasks
- Check off completed quests with animated progress bar
- Progress bar animation with color transition (Red → Yellow → Green)
- Delete quests with one click

### 🎮 **Distractions Tracker**
- Track what distracts you during focus sessions
- Click to cross off overcome distractions
- Delete distractions when no longer relevant

### 🔊 **8-Bit Sound Effects**
All sounds are generated using Web Audio API:
| Action | Sound |
|--------|-------|
| Start Work | Energetic power-up (ascending) |
| Start Rest | Calm melody (descending) |
| Timer Complete | Victory fanfare |
| Quest Complete | Achievement sound |
| Add Item | Short blip |
| Delete Item | Cancel/error sound |
| Reset | System reset sound |

### 🎨 **Retro Design**
- Pixel art inspired UI
- CRT monitor overlay effect
- Custom scrollbar styling
- Dark/Light mode toggle
- Responsive layout (Desktop & Mobile)

---

## 🚀 Demo

Simply open `index.html` in your browser to run the application locally.

---

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pomodoro-quest.git
   ```

2. **Navigate to the project folder**
   ```bash
   cd pomodoro-quest
   ```

3. **Open in browser**
   - Double-click `index.html`, or
   - Use Live Server extension in VS Code

---

## 🎯 Usage

### Starting a Focus Session
1. Set your desired focus duration (default: 25 min)
2. Click **START WORK** button
3. Focus on your task until the timer completes
4. You'll hear a victory melody when done!

### Taking a Break
1. Set your rest duration (default: 5 min)
2. Click **REST** button
3. Relax until the timer ends

### Managing Quests
- Type a quest in the input field and click **+** or press **Enter**
- Click the checkbox to mark as complete (watch the animated progress bar!)
- Hover and click **×** to delete

### Tracking Distractions
- Add distractions that break your focus
- Click on the text to cross it off when you overcome it
- Delete when no longer needed

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **HTML5** | Structure |
| **Tailwind CSS** | Styling (via CDN) |
| **Vanilla JavaScript** | Logic & Interactivity |
| **Web Audio API** | 8-bit Sound Effects |
| **LocalStorage** | Data Persistence |
| **Google Fonts** | Press Start 2P, VT323 |
| **Material Icons** | UI Icons |

---

## 📁 Project Structure

```
pomodoro-quest/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Custom styles (scrollbar, CRT effect, animations)
├── js/
│   └── app.js          # Application logic
├── README.md           # This file
└── pomodoroPRD.md      # Product Requirements Document
```

---

## 🎵 Sound System

The application uses the **Web Audio API** to generate retro 8-bit sounds without any external audio files:

```javascript
// Example: Quest Complete Sound
SoundEffects.questComplete();
// Plays: C5 → E5 → G5 → C6 (ascending victory fanfare)
```

All sounds use **square wave** oscillators for authentic chiptune/8-bit feel.

---

## 💾 Data Persistence

All data is automatically saved to `localStorage`:
- Quest list
- Distractions list
- Timer settings
- Total focus minutes

Your progress is preserved even after closing the browser!

---

## 🌙 Dark Mode

Toggle between light and dark mode using the button in the bottom-right corner:
- ☀️ Light Mode - Clean, bright interface
- 🌙 Dark Mode - Eye-friendly, retro gaming aesthetic

---

## 📱 Responsive Design

The application adapts to different screen sizes:
- **Desktop**: 3-column layout (Distractions | Timer | Quest Log)
- **Mobile**: Single column, stacked layout

---

## 🙏 Credits

- **Fonts**: [Google Fonts](https://fonts.google.com/)
  - Press Start 2P (headings)
  - VT323 (body text)
- **Icons**: [Material Icons](https://fonts.google.com/icons)
- **CSS Framework**: [Tailwind CSS](https://tailwindcss.com/)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Alviana Nugraha**

© 2026 All Rights Reserved.

---

<div align="center">

**Made with 🍅 and ❤️**

*Stay focused, level up!*

</div>
