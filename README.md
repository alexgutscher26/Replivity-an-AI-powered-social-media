# AI Social Media Replier - SaaS Platform

A powerful AI-powered social media response generator that helps users create engaging posts and reply to comments faster. This SaaS platform includes both a web dashboard and browser extensions for Chrome and Firefox.

## 🚀 Features

### Core Features
- **AI-Powered Responses**: Generate human-like interactions and responses using advanced AI models
- **Fast Response Time**: Quick AI-generated replies to boost engagement
- **Social Media Growth**: Guaranteed follower growth through intelligent interactions
- **Advanced Analytics**: Detailed insights and analytics for your social media performance
- **Multi-Platform Support**: Works with major social media platforms

### Browser Extension
- **Chrome Extension**: Seamless integration with Chrome browser
- **Firefox Extension**: Full Firefox support
- **Real-time Integration**: Works directly within social media platforms
- **User-Friendly Interface**: Clean and intuitive design

### SaaS Platform
- **User Dashboard**: Complete management interface
- **Subscription Management**: Multiple pricing tiers with Stripe and PayPal integration
- **Usage Analytics**: Track your AI response usage and performance
- **Account Management**: User profiles, settings, and preferences
- **Admin Panel**: Administrative tools for user and product management

## 🛠️ Tech Stack

### Web Platform
- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth with social providers
- **Styling**: Tailwind CSS with Radix UI components
- **API**: tRPC for type-safe APIs
- **Payments**: Stripe and PayPal integration
- **File Storage**: UploadThing for file management
- **Email**: Resend for transactional emails

### Browser Extension
- **Framework**: WXT (Web Extension Toolkit)
- **UI**: React 19 with Tailwind CSS
- **State Management**: TanStack Query
- **Communication**: tRPC Chrome adapter
- **Build System**: TypeScript with ESLint

### AI Integration
- **Providers**: OpenAI, Google AI, Mistral AI, Anthropic (Claude)
- **SDK**: Vercel AI SDK for unified AI model access

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- API keys for AI providers (OpenAI, Google, Mistral, Anthropic)
- Stripe and/or PayPal accounts for payments

### Web Platform Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd web-v6.0.0
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   Create a `.env.local` file with required environment variables:
   ```env
   # Database
   DATABASE_URL="postgresql://..."
   
   # AI Providers
   OPENAI_API_KEY="sk-..."
   GOOGLE_AI_API_KEY="..."
   MISTRAL_API_KEY="..."
   
   # Authentication
   BETTER_AUTH_SECRET="..."
   
   # Payments
   STRIPE_SECRET_KEY="sk_..."
   PAYPAL_CLIENT_ID="..."
   PAYPAL_CLIENT_SECRET="..."
   
   # Email
   RESEND_API_KEY="..."
   
   # File Storage
   UPLOADTHING_SECRET="..."
   ```

4. **Database setup**
   ```bash
   npm run db:push
   npm run db:generate
   npm run db:migrate
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

### Browser Extension Setup

1. **Navigate to extension directory**
   ```bash
   cd extension-v6.0.0
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build extension**
   ```bash
   # For Chrome
   npm run build
   
   # For Firefox
   npm run build:firefox
   ```

4. **Development mode**
   ```bash
   # Chrome development
   npm run dev
   
   # Firefox development
   npm run dev:firefox
   ```

## 🚦 Available Scripts

### Web Platform
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript checks
- `npm run db:push` - Push database schema
- `npm run db:studio` - Open Drizzle Studio

### Browser Extension
- `npm run dev` - Start development (Chrome)
- `npm run dev:firefox` - Start development (Firefox)
- `npm run build` - Build for production
- `npm run zip` - Create distribution zip
- `npm run submit` - Submit to store

## 🏗️ Project Structure

```
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── (frontend)/        # Public pages
│   │   ├── (backend)/         # Dashboard pages
│   │   └── api/               # API routes
│   ├── components/            # Reusable UI components
│   ├── server/                # Server-side code
│   │   ├── api/               # tRPC routers
│   │   ├── auth/              # Authentication config
│   │   └── db/                # Database schema
│   ├── trpc/                  # tRPC client setup
│   └── utils/                 # Utility functions
├── extension-v6.0.0/          # Browser extension
└── public/                    # Static assets
```

## 💳 Payment Integration

The platform supports multiple payment providers:

- **Stripe**: Credit card processing with webhook support
- **PayPal**: PayPal payment processing
- **Subscription Management**: Handle recurring subscriptions
- **Usage-based Billing**: Track and bill based on AI usage

## 🔐 Authentication

Built-in authentication system with:
- **Email/Password**: Traditional authentication
- **Social Logins**: Google, Facebook, Twitter integration
- **Session Management**: Secure session handling
- **User Roles**: Admin and user role management

## 📊 Analytics & Reporting

- **Usage Tracking**: Monitor AI response generation
- **Performance Metrics**: Track engagement and growth
- **User Analytics**: Understand user behavior
- **Revenue Reports**: Financial performance tracking

## 🔧 Configuration

### AI Model Configuration
Configure AI providers in the admin dashboard:
1. Navigate to Settings → General
2. Configure API keys for each provider
3. Test connections
4. Set default models and parameters

### Payment Setup
1. Configure Stripe/PayPal credentials
2. Set up webhooks for payment notifications
3. Configure subscription plans
4. Test payment flows

## 📱 Browser Extension Features

- **Auto-detection**: Automatically detects social media platforms
- **Context-aware Responses**: Generates relevant responses based on context
- **Customizable Settings**: User preferences and response styles
- **Offline Support**: Works with cached responses when offline

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Support

For support and bug reports:
- Create an issue on GitHub
- Contact support through the dashboard
- Check the documentation

## 🚀 Deployment

### Web Platform
1. Build the application: `npm run build`
2. Deploy to your hosting platform (Vercel, Netlify, etc.)
3. Configure environment variables
4. Set up database migrations

### Browser Extension
1. Build the extension: `npm run build`
2. Create distribution package: `npm run zip`
3. Submit to Chrome Web Store and Firefox Add-ons

## 📈 Roadmap

- [ ] Additional AI provider support
- [ ] Mobile app development
- [ ] Advanced analytics features
- [ ] Team collaboration tools
- [ ] Multi-language support
- [ ] API for third-party integrations

## ⚡ Performance

- **Fast Response Times**: Optimized AI response generation
- **Efficient Database Queries**: Drizzle ORM with query optimization
- **Caching Strategy**: Redis caching for frequently accessed data
- **CDN Integration**: Static asset optimization

---

Built with ❤️ using Next.js, React, and modern web technologies.
