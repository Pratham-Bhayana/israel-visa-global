# Israel Visa Application - Frontend

Premium React application for Israel visa applications with app-like UI/UX.

## 🎨 Design Features

- **App-like UI**: PWA-style modern interface
- **Israel Theme**: Blue (#0038B8) and White color scheme
- **Cinematic Hero**: Full-screen video background
- **Smooth Animations**: Framer Motion powered transitions
- **Fully Responsive**: Mobile-first design
- **SEO Optimized**: Schema markup, meta tags, sitemap ready
- **Accessibility**: WCAG compliant with high contrast

## 🚀 Features

- ✨ Modern landing page with hero video
- 🔐 Authentication (Email, Google OAuth, Mobile OTP)
- 📝 Multi-step visa application form
- 👤 User profile with application tracking
- 📊 Real-time status updates
- 📱 Mobile-optimized experience
- 🎯 Lighthouse 100 score optimized

## 📦 Tech Stack

- React 18
- React Router DOM
- Framer Motion (animations)
- React Helmet Async (SEO)
- React Toastify (notifications)
- Axios (API calls)
- Socket.io Client (real-time updates)

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 📁 Project Structure

```
src/
├── components/      # Reusable components (Navbar, Footer)
├── pages/          # Page components (Home, Login, etc.)
├── styles/         # Global styles
├── services/       # API services
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── App.js          # Main app component
└── index.js        # App entry point
```

## 🎯 Pages

- **Home**: Landing page with hero video and features
- **Login**: User authentication
- **Signup**: New user registration
- **Application**: Multi-step visa application form
- **Profile**: User dashboard with application tracking
- **404**: Custom error page (returns HTTP 200)

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_SOCKET_URL=http://localhost:5000
```

## 🎨 Color Palette

```css
Primary Blue: #0038B8 (Israel flag blue)
Secondary Blue: #002B8F
Light Blue: #E6EEFF
White: #FFFFFF
```

## 📱 PWA Features

The app is configured as a Progressive Web App with:
- Service worker ready
- Installable on mobile devices
- Offline capability ready
- App-like experience

## 🔍 SEO Optimization

- Schema.org markup (Organization, FAQ)
- Open Graph tags
- Twitter Card tags
- Semantic HTML5
- Optimized images with alt tags
- XML sitemap ready
- robots.txt configured

## 🚀 Performance

Optimized for Lighthouse scores:
- Performance: 100
- Accessibility: 100
- Best Practices: 100
- SEO: 100

## 📄 License

MIT

## 👨‍💻 Development

```bash
# Run in development mode
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📞 Support

For support, please visit our contact page or email support@israelvisa.com

---

**Note**: Replace placeholder video URL with actual Israel tourism video for production.
