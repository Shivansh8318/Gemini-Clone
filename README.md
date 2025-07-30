# Gemini Chat App

[![Netlify Status](https://api.netlify.com/api/v1/badges/deployed/deploys.svg)](https://shivansh-gemini.netlify.app/) [![Live Demo](https://img.shields.io/badge/Live%20Demo-Online-success)](https://shivansh-gemini.netlify.app/)

A fully functional, responsive, and visually appealing frontend that **exactly replicates Google Gemini's actual chat interface design**. Built with React, TypeScript, and modern web technologies to match the authentic Gemini user experience.

## 🚀 **Live Demo**

### 🌐 **Try It Live**
**[🔗 Open Gemini Chat App](https://shivansh-gemini.netlify.app/)**

*Experience the pixel-perfect Gemini replica directly in your browser!*

**Quick Demo Login:**
- 📱 Use any phone number (min 5 digits)
- 🔑 OTP: `123456`
- 🚀 Instant access to the Gemini interface


## 🎯 **Google Gemini Replica**

This app is a **100% accurate recreation** of Google's official Gemini chat interface, built from detailed analysis of the real application:

### 🔍 **Research-Based Design**
- ✅ **Direct UI analysis** of gemini.google.com
- ✅ **Dark theme implementation** matching Google's current design
- ✅ **Sidebar-based layout** exactly like the official app
- ✅ **Authentic component positioning** and spacing
- ✅ **Real color palette** extracted from official interface
- ✅ **Proper typography** and icon usage

### 🎨 **Interface Accuracy**
- ✅ **Collapsible sidebar** with chat history list
- ✅ **"Gemini 2.5 Pro" header** with dropdown indicator
- ✅ **"Hello, [Name]" greeting** in blue text
- ✅ **Canvas, Image, and Mic buttons** in exact positions
- ✅ **Upgrade button** with sparkle icon
- ✅ **Settings and help** section placement
- ✅ **Message bubble styling** matching real app

*Built by studying the actual Google Gemini interface and recreating every visual detail.*

## 🌟 Features

### 🔐 Authentication
- **OTP-based Login/Signup** with country code selection
- **Country data** fetched from `restcountries.com` API
- **Form validation** using React Hook Form + Zod
- **Simulated OTP** verification (use `123456` for demo)

### 📱 Dashboard
- **Chatroom management** - Create, view, and delete chatrooms
- **Debounced search** to filter chatrooms by title
- **Toast notifications** for all major actions
- **Responsive design** for all screen sizes

### 💬 Authentic Gemini Chat Interface
- **🎯 EXACT Google Gemini UI replica** - Pixel-perfect recreation of the official interface
- **🌙 Dark theme design** matching Google's current Gemini appearance
- **📱 Sidebar navigation** with collapsible chat history (exactly like real Gemini)
- **⚡ "Hello, [Name]" welcome screen** with blue greeting text
- **🎨 Official color scheme** - Dark grays, blues, and authentic Gemini branding
- **✨ Gemini avatars** with sparkle icons and gradient backgrounds
- **💬 Real message bubbles** - User messages in gray, AI messages with avatar
- **🔄 "Gemini is thinking..." indicator** with authentic styling
- **📋 Canvas & Image buttons** matching the real interface
- **🎙️ Microphone button** with proper positioning
- **⚙️ Settings and help** section in sidebar
- **📊 "2.5 Pro" model indicator** with dropdown styling
- **🔍 Search and Upgrade buttons** in top navigation
- **👤 User avatar** in top-right corner

### 🎨 UX/UI Features
- **Dark/Light mode** toggle with persistent settings
- **Mobile-first responsive design**
- **Loading skeletons** for better perceived performance
- **Smooth animations** and transitions
- **Keyboard accessibility** for all interactions
- **Toast notifications** for user feedback

### 🛠 Technical Features
- **Zustand** for state management
- **LocalStorage** persistence for auth and chat data
- **Client-side pagination** for message handling
- **Debounced search** implementation
- **Image compression** for uploaded files
- **TypeScript** for type safety
- **Netlify deployment** for instant global access

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- Modern web browser

### Installation

1. **Download or clone the project**
   ```bash
   # If cloning from a repository:
   git clone <repository-url>
   cd gemini-chat-app
   
   # Or extract downloaded files and navigate to project folder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### 📁 Project Setup
- ✅ **Git initialized** with comprehensive `.gitignore`
- ✅ **Node modules excluded** from version control
- ✅ **Environment files protected** (`.env` files ignored)
- ✅ **Build outputs ignored** (`dist/`, cache files)

### Demo Usage

1. **Authentication**
   - Select any country from the dropdown
   - Enter any phone number (minimum 5 digits)
   - Use OTP: `123456` to verify and login

2. **Gemini Interface**
   - Start with the "Hello, [Name]" welcome screen
   - Use the sidebar to view chat history
   - Click "New chat" to start new conversations
   - Toggle sidebar with the hamburger menu

3. **Chat Features**
   - Type in the "Ask Gemini" input box
   - Upload images using the Image button
   - Use Canvas and Mic buttons (UI elements)
   - Copy messages by hovering over them
   - Scroll up to load older messages
   - Experience authentic Gemini responses

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Main application pages
│   ├── Auth.tsx        # Authentication page
│   ├── Dashboard.tsx   # Chatrooms dashboard
│   └── Chat.tsx        # Chat interface
├── store/              # Zustand state management
│   └── useStore.ts     # Global app state
├── utils/              # Utility functions
│   └── index.ts        # Helper functions
├── App.tsx             # Main app component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## 🛠 Technical Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 18 with Vite |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **State Management** | Zustand |
| **Form Handling** | React Hook Form + Zod |
| **Routing** | React Router DOM |
| **Notifications** | React Hot Toast |
| **Icons** | Lucide React |
| **Build Tool** | Vite |

## 🎯 Key Implementation Details

### Authentication Flow
- Fetches countries from `restcountries.com` API
- Validates phone numbers with country codes
- Simulates OTP sending with `setTimeout`
- Persists user session in localStorage

### AI Response Simulation
- Throttled responses (2-4 second delay)
- Context-aware responses based on keywords
- Realistic typing indicator animation
- Message persistence across sessions

### State Management
- Zustand store with localStorage persistence
- Optimistic UI updates for better UX
- Centralized state for auth, chatrooms, and messages
- Automatic state hydration on app load

### Performance Optimizations
- Lazy loading with React.lazy
- Image compression for uploads
- Debounced search functionality
- Virtual scrolling for large message lists
- Memoized components and callbacks

## 🎨 Design Philosophy

### Mobile-First Approach
- Responsive breakpoints for all screen sizes
- Touch-friendly interface elements
- Optimized for mobile interaction patterns

### Accessibility
- Keyboard navigation support
- Screen reader friendly
- High contrast color schemes
- Focus management for modals

### User Experience
- Immediate feedback for all actions
- Loading states for async operations
- Error handling with user-friendly messages
- Intuitive navigation patterns

## 🔧 Build & Deployment

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Production Build
```bash
npm run build
```
The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## 🌟 Features Showcase

### Authentication
- ✅ Country selector with flags and dial codes
- ✅ Phone number validation
- ✅ OTP simulation with countdown timer
- ✅ Persistent login state

### Dashboard
- ✅ Chatroom creation and deletion
- ✅ Real-time search with debouncing
- ✅ Last message preview
- ✅ Confirmation dialogs for destructive actions

### Chat Interface
- ✅ Bi-directional messaging
- ✅ Image upload with preview
- ✅ Copy message functionality
- ✅ Infinite scroll pagination
- ✅ AI typing simulation
- ✅ Auto-scroll to new messages

### Global Features
- ✅ Dark/Light theme toggle
- ✅ Responsive design
- ✅ Toast notifications
- ✅ Loading skeletons
- ✅ Keyboard shortcuts
- ✅ Data persistence

## 🎉 Demo Tips

1. **Try the OTP**: Use `123456` as the verification code
2. **Test Image Upload**: Upload any image file (max 5MB)
3. **Experience AI Responses**: Type different keywords like "hello", "weather", "code"
4. **Mobile Testing**: Resize browser or use dev tools mobile view
5. **Dark Mode**: Toggle between light and dark themes
6. **Search**: Try searching for chatroom names
7. **Copy Messages**: Hover over any message to see copy button

This application demonstrates modern React development practices, responsive design principles, and meticulous attention to UI/UX authenticity. It's a pixel-perfect recreation of Google's Gemini interface that showcases advanced frontend development skills and could easily be connected to real backend services.

## 🚀 **Interface Transformation**

**From Generic Chat App → Authentic Google Gemini Clone**

This project evolved from a standard chat application to a **pixel-perfect replica** of Google's official Gemini interface through:

- 🔬 **Detailed research** of the real Gemini interface
- 🎨 **Complete UI overhaul** to match Google's design system
- 🌙 **Dark theme implementation** with authentic colors
- 📱 **Sidebar architecture** matching the official layout
- ✨ **Micro-interaction details** for genuine feel

The result is an interface so accurate it's virtually indistinguishable from the real Gemini app.
