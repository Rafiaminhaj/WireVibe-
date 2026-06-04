# 🤝 Contributing to WireVibe

First off, **thank you** for considering contributing to WireVibe! 🎉 Every contribution makes this project better for everyone.

## 📋 Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Pull Request Process](#pull-request-process)
- [Style Guide](#style-guide)

## 📜 Code of Conduct

This project follows our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold a welcoming, inclusive, and harassment-free environment.

## 💡 How Can I Contribute?

### 🐛 Reporting Bugs
- Check if the issue already exists in [Issues](https://github.com/Rafiaminhaj/WireVibe-/issues)
- If not, create a new issue with:
  - A clear, descriptive title
  - Steps to reproduce the bug
  - Expected vs actual behavior
  - Screenshots (if applicable)

### ✨ Suggesting Features
- Open an issue with the `enhancement` label
- Describe the feature and why it would be useful
- Include mockups or examples if possible

### 🔧 Code Contributions
Here are some areas where you can help:
- **UI/UX Improvements** — Better animations, responsive design, accessibility
- **Canvas Tools** — New drawing tools (shapes, text, undo/redo)
- **AI Integration** — Support for more AI models (Claude, GPT-4V, etc.)
- **Export Options** — Export to React, Vue, or other frameworks
- **Performance** — Optimize canvas rendering and API calls

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge)
- Git installed on your machine
- A code editor (VS Code recommended)

### Setup
1. **Fork** this repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/WireVibe-.git
   cd WireVibe-
   ```
3. Open `index.html` in your browser — that's it! No build tools needed.
4. (Optional) For AI features, get a free API key from [Google AI Studio](https://aistudio.google.com)

### Project Structure
```
WireVibe/
├── index.html      # Main HTML structure
├── style.css       # All styles (glassmorphism, animations, responsive)
├── script.js       # Core logic (canvas, API, UI interactions)
└── README.md       # Project documentation
```

## 🔀 Pull Request Process

1. Create a **feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes and **test** them thoroughly
3. Write clear, descriptive **commit messages**:
   ```bash
   git commit -m "feat: add undo/redo functionality to canvas"
   ```
4. **Push** to your fork and create a Pull Request
5. In the PR description, explain:
   - What changes you made and why
   - Screenshots/recordings of UI changes
   - Any breaking changes

### Commit Message Convention
We follow the [Conventional Commits](https://www.conventionalcommits.org/) standard:
- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `style:` — CSS/formatting changes
- `refactor:` — Code restructuring

## 🎨 Style Guide

### JavaScript
- Use `const` and `let` (no `var`)
- Use template literals for string interpolation
- Add comments for complex logic
- Use `async/await` for API calls

### CSS
- Follow the existing CSS variable system (`--primary-color`, etc.)
- Use `rem` units for spacing
- Keep glassmorphism effects consistent
- Ensure mobile responsiveness

### HTML
- Use semantic HTML5 elements
- Keep accessibility in mind (`aria-labels`, `alt` text)
- Use descriptive `id` and `class` names

---

## 🌟 Recognition

All contributors will be recognized in the README. Your contributions matter!

**Happy Coding!** ✨
