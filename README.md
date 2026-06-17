# TaskFlow Lite

A beautiful, modern task management application that runs entirely in your browser!

## Features

### Core Features
- ✅ Create tasks with unique IDs and timestamps
- ✅ Read and display all tasks
- ✅ Update tasks (toggle completion, edit text)
- ✅ Delete tasks with confirmation
- ✅ LocalStorage persistence
- ✅ Filter tasks (All/Active/Completed)
- ✅ Search tasks in real-time
- ✅ Task statistics
- ✅ Form validation
- ✅ Beautiful empty state

### Advanced Features
- 🌓 Dark/Light mode toggle
- ↩️ Undo last action
- 🖐️ Drag and drop to reorder
- ⌨️ Keyboard shortcuts
- ♿ Accessibility focused
- 🔒 XSS protection

## Tech Stack

- **HTML5**: Structure
- **CSS3**: Styling with glassmorphism, gradients, animations
- **Vanilla JavaScript (ES6+)**: Logic with modules
- **LocalStorage**: Data persistence

## Architecture

```
taskflow-lite/
├── index.html          # Main HTML file
├── app.js              # Main application logic
├── styles/
│   ├── main.css        # Main styles
│   └── utilities.css   # CSS utilities and variables
├── modules/
│   ├── storage.js      # LocalStorage operations
│   ├── render.js       # DOM rendering functions
│   └── validation.js   # Input validation & sanitization
└── README.md           # This file
```

## Getting Started

### Installation

No installation needed! Simply open `index.html` in your browser.

### Development

Just edit the files and refresh your browser!

## Deployment

### GitHub Pages

1. Create a new repository on GitHub
2. Upload all files
3. Go to Settings → Pages
4. Select "main" branch and save
5. Your app will be live at `https://[username].github.io/[repo-name]/`

### Netlify

1. Go to [netlify.com](https://www.netlify.com)
2. Drag and drop your project folder
3. That's it! Your app is deployed

## Keyboard Shortcuts

- **Enter**: Add task (when focused on input)
- **Escape**: Close modal
- **Delete**: Remove selected task

## Event Flow

1. User interacts with UI
2. Event listener captures action
3. State (`tasks` array) is updated
4. State is saved to LocalStorage
5. UI is re-rendered

## Browser Support

Works in all modern browsers that support ES6 modules and LocalStorage.

## License

MIT