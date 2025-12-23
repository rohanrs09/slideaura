# SlideAura 🚀

Transform your ideas into stunning presentations in minutes with AI-powered slide generation. Create, edit, and export professional PPT decks effortlessly.

## Overview

SlideAura is a modern web application that leverages artificial intelligence to automatically generate presentation slides. Users can create decks from scratch, customize designs, edit slides, and export them as PowerPoint files.

**Key Features:**
- ⚡ AI-powered slide generation from prompts
- 📝 Real-time slide editing and customization
- 🎨 Modern, responsive UI with dark mode support
- 🔐 Secure authentication with Clerk
- 📊 Project management and slide organization
- 💾 Cloud storage with Firebase
- 📥 PPT export functionality
- 🎯 Usage-based pricing model

## Tech Stack

### Frontend
- **React 19** - UI framework with latest features
- **TypeScript** - Type safety and better DX
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **React Router v7** - Client-side routing
- **React Hook Form** - Efficient form management
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library

### Backend & Services
- **Firebase** - Real-time database, authentication, and storage
- **Clerk** - Modern authentication platform
- **ImageKit** - Image optimization and hosting
- **pptxgenjs** - PowerPoint file generation
- **html-to-image** - Convert HTML to image for slide thumbnails

### Development
- **ESLint** - Code linting
- **TypeScript Compiler** - Type checking

## Project Structure

```
slideaura/
├── src/
│   ├── components/
│   │   ├── custom/          # App-specific components
│   │   │   ├── Hero.tsx     # Landing page hero section
│   │   │   ├── Header.tsx   # Navigation header
│   │   │   ├── MyProjects.tsx
│   │   │   ├── PromptBox.tsx
│   │   │   └── ...
│   │   └── ui/              # Reusable UI components (Radix-based)
│   │       ├── button.tsx
│   │       ├── dialog.tsx
│   │       ├── card.tsx
│   │       └── ...
│   ├── workspace/           # Main application workspace
│   │   ├── project/
│   │   │   ├── editor/      # Slide editor interface
│   │   │   └── outline/     # Slide outline view
│   │   ├── pricing/         # Pricing page
│   │   └── index.tsx        # Workspace layout
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   ├── context/             # React context for state
│   ├── config/              # Configuration files (Firebase)
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── config/
│   └── FirebaseConfig.ts    # Firebase initialization
├── public/                  # Static assets
├── .env.example             # Environment variables template
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript config
└── package.json             # Dependencies
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Clerk account (for authentication)
- Firebase project
- ImageKit account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd slideaura
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` and add your credentials:
   ```env
   # Clerk Authentication
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here

   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key_here

   # ImageKit Configuration
   IMAGEKIT_API_KEY=your_imagekit_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5173`

## Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint
```

## Environment Variables

The application requires the following environment variables:

| Variable | Description | Source |
|----------|-------------|--------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk public key for authentication | [Clerk Dashboard](https://dashboard.clerk.com) |
| `VITE_FIREBASE_API_KEY` | Firebase API key | Firebase Console |
| `IMAGEKIT_API_KEY` | ImageKit endpoint/API key | ImageKit Dashboard |

**Security Note:** Never commit `.env` to version control. Use `.env.example` as a template and keep actual credentials local.

## Architecture

### Authentication Flow
1. User visits the app and authenticates via Clerk
2. Clerk verifies identity and issues tokens
3. User context is stored in React Context (`UserDetailContext`)
4. Protected routes require valid authentication

### Presentation Creation Flow
1. User enters a prompt in the PromptBox
2. Frontend sends request to backend API
3. AI generates slide content and structure
4. Slides are stored in Firebase
5. User can edit slides in the Editor component
6. Export generates PPT file using pptxgenjs

### State Management
- **React Context** - User details and global state
- **React Hook Form** - Form state management
- **Firebase** - Persistent data storage

## Key Components

### `Hero.tsx`
Landing page component with:
- Call-to-action buttons
- Video tutorial embed
- Authentication integration (Sign in / Go to Workspace)

### `PromptBox.tsx`
User input for AI slide generation:
- Text input for presentation prompts
- Credit/usage tracking
- Pricing dialog trigger

### Editor (`workspace/project/editor/`)
Main slide editing interface:
- Slide canvas
- Style customization
- Real-time preview
- PPT export

### MyProjects.tsx
Project dashboard showing:
- List of user's presentations
- Project metadata
- Quick actions (edit, delete, export)

## Database Schema (Firebase)

```
Users/
├── [userId]/
│   ├── email
│   ├── credits
│   └── subscription_tier

Projects/
├── [projectId]/
│   ├── userId
│   ├── title
│   ├── description
│   ├── slides[]
│   ├── created_at
│   └── updated_at

Slides/
├── [slideId]/
│   ├── projectId
│   ├── content
│   ├── style
│   └── order
```

## Development Guidelines

### Code Style
- Follow ESLint rules defined in `eslint.config.js`
- Use TypeScript for all new files
- Component files should be `.tsx`
- Utility files should be `.ts`

### Component Guidelines
- Keep components small and focused
- Use Radix UI primitives for accessibility
- Export components as default exports
- Use React Hook Form for forms
- Leverage Tailwind CSS for styling

### Naming Conventions
- Components: PascalCase (e.g., `MyProjects.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useMobile.ts`)
- Utils: camelCase (e.g., `utils.ts`)

## Deployment

### Build for Production
```bash
npm run build
```

Outputs optimized files to `dist/` directory.

### Deployment Checklist
- [ ] All environment variables are set
- [ ] `.env` is NOT committed to git
- [ ] Dependencies are up to date
- [ ] Linting passes (`npm run lint`)
- [ ] Build completes without errors (`npm run build`)
- [ ] Test on production build (`npm run preview`)

### Common Hosting Options
- **Vercel** - Optimal for Vite projects
- **Netlify** - Easy deployment from GitHub
- **AWS S3 + CloudFront** - Scalable solution
- **Firebase Hosting** - Integrated with Firebase backend

## Troubleshooting

### Environment Variables Not Loading
- Ensure `.env` file is in project root
- Variables must start with `VITE_` to be accessible in frontend
- Restart dev server after changing `.env`

### Firebase Connection Issues
- Verify Firebase credentials in `.env`
- Check Firebase project permissions
- Ensure Firebase rules allow read/write access

### Clerk Authentication Failing
- Verify Clerk key is correct
- Check Clerk dashboard for allowed URLs
- Clear browser cache and cookies

### Build Errors
```bash
# Clear cache and rebuild
rm -rf dist node_modules/.vite
npm run build
```

## Performance Tips

1. **Code Splitting** - React Router automatically code-splits components
2. **Lazy Loading** - Use React.lazy() for heavy components
3. **Image Optimization** - Use ImageKit for responsive images
4. **CSS** - Tailwind only includes used styles in production
5. **Bundle Analysis** - Use Vite's visualization tools to analyze bundle

## Security Considerations

1. **Credentials** - Never commit `.env` to version control
2. **CORS** - Configure Firebase CORS properly
3. **Rate Limiting** - Implement on backend to prevent abuse
4. **Validation** - Always validate user input server-side
5. **Dependencies** - Regularly update packages (`npm audit`)

## Contributing

1. Create a feature branch from `main`
2. Make changes and test locally
3. Run `npm run lint` to check code style
4. Commit with clear, descriptive messages
5. Push to feature branch and create a pull request

## License

Layfirto License - All rights reserved. Proprietary software.

## Support

For issues, questions, or feature requests, please:
- Create an issue on GitHub
- Check existing documentation
- Review component Storybook (if available)

## Roadmap

- [ ] Collaborative editing
- [ ] Template library
- [ ] Custom branding options
- [ ] Analytics dashboard
- [ ] Mobile app
- [ ] API for third-party integrations
- [ ] Team/workspace management

---

**Built with ❤️ using React, TypeScript, and Vite**
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
