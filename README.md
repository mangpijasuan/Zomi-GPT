# ZomiGPT - AI-Powered Intelligence Platform 🚀

![ZomiGPT Logo](https://img.shields.io/badge/Zomi-GPT-blue?style=for-the-badge&logo=cpu)
![Version](https://img.shields.io/badge/version-1.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

**Live Demo:** [https://mangpijasuan.github.io/Zomi-GPT/](https://mangpijasuan.github.io/Zomi-GPT/)

ZomiGPT is a comprehensive AI-powered platform dedicated to the Zomi community, integrating Google's latest Gemini models to provide advanced linguistic tools, creative generation, and real-time search capabilities.

---

## ✨ Features

### 🧠 Smart AI Chat
Advanced conversational AI with multi-modal support (text + image analysis) powered by Gemini 3 Flash/Pro models. Get intelligent responses with context awareness and visual understanding.

### 📚 Zomi Lexicon
Comprehensive dictionary for Zomi (Tedim dialect) and English with detailed definitions, example sentences, and cultural notes.

### 🌐 Neural Translate
Professional AI translation between Zomi and multiple global languages with context-aware accuracy.

### 🎨 Art Studio
Generate stunning 4K images from text descriptions using Gemini's advanced image generation models. Create visual content for any purpose.

### 🎬 Motion Synthesis
Generate 720p/1080p videos from text prompts powered by Veo 3.1. Create dynamic video content with AI.

### 🎙️ Voice Engine
Natural text-to-speech synthesis with multiple voice personas for professional audio generation.

### 📡 Grounded Search
Real-time web search with verified citations and source grounding. Get current information with direct links to sources.

### 📍 Location Intelligence
Smart Maps integration for local business insights, discovery, and location-based information.

---

## 🛠️ Technology Stack

- **Frontend:** React 19 with TypeScript
- **Styling:** Tailwind CSS with modern dark-mode aesthetic
- **Icons:** Lucide React
- **AI Engine:** Google Gemini API (@google/genai)
- **Build Tool:** Vite 6.0
- **Deployment:** GitHub Pages with GitHub Actions

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- A Google Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

### Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mangpijasuan/Zomi-GPT.git
   cd Zomi-GPT
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_KEY=your_gemini_api_key_here
   ```
   
   Or copy from the example:
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and add your Gemini API key.

4. **Start development server:**
   ```bash
   npm run dev
   ```
   
   The app will open at `http://localhost:3000`

5. **Build for production:**
   ```bash
   npm run build
   ```

6. **Preview production build:**
   ```bash
   npm run preview
   ```

---

## 🌐 Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Automated Deployment (Recommended)

1. **Enable GitHub Pages:**
   - Go to your repository Settings
   - Navigate to Pages section
   - Under "Build and deployment", select "GitHub Actions" as the source

2. **Add API Key Secret:**
   - Go to repository Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `VITE_API_KEY`
   - Value: Your Gemini API key
   - Click "Add secret"

3. **Deploy:**
   - Push to the `master` branch
   - GitHub Actions will automatically build and deploy
   - Your site will be live at: `https://[username].github.io/Zomi-GPT/`

### Manual Deployment

If you prefer manual deployment:

```bash
npm run deploy
```

This will build the project and push it to the `gh-pages` branch.

---

## 📝 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_KEY` | Google Gemini API key | Yes |
| `API_KEY` | Alternative variable name (both work) | Yes |

### Vite Configuration

The project is configured for GitHub Pages deployment in [vite.config.ts](vite.config.ts):
- Base URL set to `/Zomi-GPT/` (matches repository name)
- Optimized build with code splitting
- Environment variable injection

---

## 🎯 Usage Features

### Free Tier
- 5 requests per day across all features
- Access to Gemini Flash models
- All core features available

### Pro Features (Coming Soon)
- Unlimited daily requests
- Access to premium Gemini Pro models
- Higher quality image generation (4K)
- Faster video generation
- Priority support

---

## 🏗️ Project Structure

```
Zomi-GPT/
├── components/          # React components
│   ├── AudioView.tsx    # Text-to-speech interface
│   ├── AuthView.tsx     # Authentication
│   ├── ChatView.tsx     # AI chat interface
│   ├── DictionaryView.tsx  # Dictionary lookup
│   ├── ImageView.tsx    # Image generation
│   ├── MapsView.tsx     # Maps integration
│   ├── ProfileView.tsx  # User profile
│   ├── SearchView.tsx   # Web search
│   ├── Sidebar.tsx      # Navigation sidebar
│   ├── TranslateView.tsx # Translation
│   ├── UpgradeView.tsx  # Subscription
│   └── VideoView.tsx    # Video generation
├── services/            # API services
│   ├── gemini.ts        # Gemini API integration
│   └── translations.ts  # i18n translations
├── App.tsx              # Main application
├── types.ts             # TypeScript definitions
├── vite.config.ts       # Vite configuration
└── package.json         # Dependencies

```

---

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Manual deploy to GitHub Pages

### Code Quality

- TypeScript for type safety
- React 19 with modern hooks
- Responsive design with Tailwind CSS
- Error boundaries for graceful error handling
- Optimized bundle size with code splitting

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Google Gemini team for the powerful AI models
- The Zomi community for inspiration and support
- All contributors who help improve this project

---

## 📧 Contact & Support

- **GitHub Issues:** [Report bugs or request features](https://github.com/mangpijasuan/Zomi-GPT/issues)
- **Repository:** [https://github.com/mangpijasuan/Zomi-GPT](https://github.com/mangpijasuan/Zomi-GPT)

---

Built with ❤️ for the Zomi Community

---

## 🔄 Recent Updates

- ✅ Fixed TypeScript build errors
- ✅ Configured GitHub Pages deployment
- ✅ Added automated CI/CD with GitHub Actions
- ✅ Optimized bundle size with code splitting
- ✅ Updated to React 19 and Vite 6

