# 🚀 Deployment Guide

## 🔒 Environment Variables Security

### Required Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

#### Clerk Authentication
```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
```

#### Firebase Configuration
```bash
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

#### ImageKit Configuration
```bash
IMAGEKIT_API_KEY=your_imagekit_api_key
```

## 🛡️ Security Best Practices

### 1. Environment Variables
- ✅ **Never commit `.env` files** to version control
- ✅ **Use different keys** for development and production
- ✅ **Rotate keys regularly** for security
- ✅ **Use environment-specific** configurations

### 2. Production Deployment
- ✅ **Set environment variables** in your hosting platform
- ✅ **Use production keys** (not development keys)
- ✅ **Enable security rules** in Firebase
- ✅ **Configure CORS** properly

### 3. Firebase Security Rules
```javascript
// Firestore rules example
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own documents
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Projects can be read by owner, written by owner
    match /projects/{projectId} {
      allow read, write: if request.auth != null && 
        resource.data.createdBy == request.auth.token.email;
    }
  }
}
```

## 🌐 Deployment Platforms

### Vercel
```bash
# Set environment variables in Vercel dashboard
vercel env add VITE_CLERK_PUBLISHABLE_KEY
vercel env add VITE_FIREBASE_API_KEY
# ... add all other variables
```

### Netlify
```bash
# Set environment variables in Netlify dashboard
# or use netlify.toml for build environment
```

### Docker
```dockerfile
# Dockerfile example
ENV VITE_CLERK_PUBLISHABLE_KEY=${VITE_CLERK_PUBLISHABLE_KEY}
ENV VITE_FIREBASE_API_KEY=${VITE_FIREBASE_API_KEY}
# ... other variables
```

## 🚦 Pre-Deployment Checklist

- [ ] Environment variables are set in production
- [ ] Firebase security rules are configured
- [ ] CORS settings are properly configured
- [ ] SSL certificates are valid
- [ ] Build process works without errors
- [ ] All API keys are production keys (not dev keys)
- [ ] Error monitoring is set up
- [ ] Analytics are configured

## 🔧 Environment Setup Script

Run the setup script to verify your environment:
```bash
node setup-env.js
```

## 📱 Development vs Production

| Variable | Development | Production |
|----------|-------------|------------|
| Clerk Key | `pk_test_` | `pk_live_` |
| Firebase | Development Project | Production Project |
| API Endpoints | Local/Dev | Production URLs |
| Analytics | Disabled | Enabled |

## 🚨 Important Notes

1. **API Keys in Frontend**: Since these are Vite environment variables, they will be exposed in the frontend bundle. This is normal for client-side applications.

2. **Firebase Security**: Always implement proper Firebase security rules to protect your data.

3. **Domain Whitelisting**: Configure allowed domains in both Clerk and Firebase for additional security.

4. **Regular Audits**: Regularly audit your API keys and rotate them if needed.

## 🆘 Troubleshooting

### Common Issues
- **Missing Environment Variables**: Run `node setup-env.js` to check
- **Clerk Development Warning**: Use production keys in production
- **Firebase Permission Denied**: Check security rules
- **Build Failures**: Verify all environment variables are set

### Support
- Check browser console for detailed error messages
- Verify environment variables are properly set
- Ensure Firebase project is properly configured
