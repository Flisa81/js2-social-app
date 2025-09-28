# JS2 Social App

A simple social media app built with **vanilla JavaScript**, HTML, and CSS.  
Users can register, log in, create posts, comment, react, and manage their profile.  
This project was built as part of my FED2 JavaScript course assignment.

---

## 🌍 Live Demo
👉 [View on Netlify](https://symphonious-gumdrop-d3f219.netlify.app)

---

## ✨ Features
- 🔐 **Authentication**: Register and log in with secure session handling
- 📰 **Feed**: Browse all posts in a styled feed
- ✍️ **Posts**: Create, edit, and delete posts
- 💬 **Comments**: Add comments to posts
- 😀 **Reactions**: React to posts
- 👤 **Profiles**: View and update your profile and avatar
- 📱 **Responsive**: Mobile-friendly design

---

## 🛠️ Tech Stack
- **HTML5**
- **CSS3** (custom styles, responsive layout)
- **JavaScript (ES Modules)**  
- **Netlify** (deployment/hosting)

---

## 📂 Project Structure
├── feed.html
├── index.html
├── login.html
├── post.html
├── profile.html
├── register.html
├── src
│   ├── api        # API functions (auth, posts, profiles)
│   ├── pages      # Page-specific JS
│   ├── styles     # main.css
│   └── ui         # UI helpers (router, nav, templates)
└── README.md

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/Flisa81/js2-social-app.git
cd js2-social-app

### 2. Open in browser
No build step is required — just open `index.html` in your browser  
(or serve with Live Server in VS Code).
## References & Acknowledgements

During the development of this project I consulted several resources:

- **Books**
  - *JavaScript: The Definitive Guide* (David Flanagan) – for deep understanding of JavaScript syntax, ES6 modules, and debugging practices.
  - *HTML & CSS: Design and Build Websites* (Jon Duckett) – for HTML structure and styling fundamentals.

- **Documentation**
  - [Noroff API Documentation](https://docs.noroff.dev/docs/v2) – for authentication, posts, and profiles endpoints.
  - [MDN Web Docs](https://developer.mozilla.org/) – for JavaScript language features, `fetch`, and DOM APIs.
  - [Tailwind CSS Documentation](https://tailwindcss.com/docs) – for styling reference and utility classes.

- **AI Assistance**
  - AI – used as a guide for setting up login logic, structuring upload functionality, and clarifying Tailwind usage.  All final design and implementation decisions were my own.
