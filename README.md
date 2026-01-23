<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License: MIT" />
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen.svg" alt="PRs Welcome" />
  <img src="https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F-red.svg" alt="Made with Love" />
</p>

<h1 align="center">🕊️ Nidal Al-Rouh</h1>

<p align="center">
  <strong>نضال الروح — The Soul's Struggle</strong>
</p>

<p align="center">
  A compassionate mental health support platform connecting those seeking help with volunteer peer supporters.
  <br />
  <em>Culturally-sensitive. Privacy-first. Community-driven.</em>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-contributing">Contributing</a> •
  <a href="#-license">License</a>
</p>

---

## 🌟 About

**Nidal Al-Rouh** ("نضال الروح" — The Soul's Struggle) is an open-source, nonprofit mental health support platform designed specifically for the Moroccan and broader MENA community. We bridge the gap between individuals seeking emotional support and compassionate volunteer helpers who provide peer-to-peer guidance in a safe, anonymous environment.

> ⚠️ **Important**: This platform provides peer support, not professional therapy. For mental health emergencies, please contact local crisis services.

### Why Nidal Al-Rouh?

- 🇲🇦 **Culturally Aware**: Built with deep understanding of Moroccan and Arabic-speaking communities
- 🌐 **Multilingual**: Full support for **Arabic**, **French**, and **English** — including RTL layouts
- 🔒 **Privacy-First**: Anonymous interactions with encrypted messaging
- 🤝 **Peer Support Model**: Trained volunteers offer empathetic listening, not clinical diagnosis
- 🆓 **Completely Free**: No fees, no ads, no monetization of user data

---

## ✨ Features

### For Seekers (Those Looking for Support)

| Feature                 | Description                                                                              |
| ----------------------- | ---------------------------------------------------------------------------------------- |
| 🔍 **Helper Discovery** | Browse verified volunteer helpers filtered by specialization, language, and availability |
| 📅 **Session Booking**  | Seamlessly schedule support sessions via Cal.com integration                             |
| 💬 **Real-time Chat**   | Encrypted messaging with helpers for ongoing support                                     |
| 📝 **Personal Journal** | Private mood tracking and reflective journaling with guided prompts                      |
| 📚 **Resource Library** | Curated self-help articles, videos, and educational content                              |
| 🗓️ **Community Events** | Join workshops, webinars, and peer support groups                                        |
| 💭 **Community Forum**  | Anonymous posting for shared experiences and community support                           |

### For Helpers (Volunteer Supporters)

| Feature                      | Description                                                  |
| ---------------------------- | ------------------------------------------------------------ |
| 📋 **Easy Onboarding**       | Guided registration with volunteer guidelines and disclaimer |
| ⏰ **Flexible Scheduling**   | Cal.com integration for managing availability                |
| 📊 **Dashboard Analytics**   | Track sessions, ratings, and seeker feedback                 |
| 🏅 **Profile Customization** | Showcase specializations, languages, and bio                 |
| 💬 **Session Management**    | Complete session lifecycle with notes and history            |

### Platform Features

- 🌙 **Dark/Light Mode** — Comfortable viewing in any environment
- 📱 **Fully Responsive** — Optimized for mobile, tablet, and desktop
- 🔐 **Secure Authentication** — JWT-based auth with refresh tokens
- 🌍 **i18n Ready** — Complete internationalization infrastructure
- ⚡ **Real-time Updates** — Socket.io powered live features

---

## 🛠️ Tech Stack

### Frontend

| Technology                                                                | Purpose                                     |
| ------------------------------------------------------------------------- | ------------------------------------------- |
| [Next.js 15](https://nextjs.org/)                                         | React framework with App Router & Turbopack |
| [React 19](https://react.dev/)                                            | UI library                                  |
| [TypeScript](https://www.typescriptlang.org/)                             | Type safety                                 |
| [Tailwind CSS](https://tailwindcss.com/)                                  | Utility-first styling                       |
| [Radix UI](https://www.radix-ui.com/)                                     | Accessible component primitives             |
| [React Query](https://tanstack.com/query)                                 | Server state management                     |
| [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | Forms & validation                          |
| [next-intl](https://next-intl-docs.vercel.app/)                           | Internationalization                        |
| [Socket.io Client](https://socket.io/)                                    | Real-time communication                     |
| [Tiptap](https://tiptap.dev/)                                             | Rich text editor                            |
| [Recharts](https://recharts.org/)                                         | Data visualization                          |
| [Cal.com Embed](https://cal.com/)                                         | Scheduling widget                           |

### Backend

| Technology                                           | Purpose                       |
| ---------------------------------------------------- | ----------------------------- |
| [NestJS](https://nestjs.com/)                        | Progressive Node.js framework |
| [Fastify](https://fastify.io/)                       | High-performance HTTP adapter |
| [Prisma](https://www.prisma.io/)                     | Type-safe ORM                 |
| [PostgreSQL](https://www.postgresql.org/)            | Relational database           |
| [Socket.io](https://socket.io/)                      | WebSocket server              |
| [Passport.js](http://www.passportjs.org/)            | Authentication                |
| [Zod](https://zod.dev/)                              | Runtime validation            |
| [Pino](https://getpino.io/)                          | Logging                       |
| [Argon2](https://github.com/P-H-C/phc-winner-argon2) | Password hashing              |

### DevOps & Tooling

| Technology                                                                                        | Purpose                    |
| ------------------------------------------------------------------------------------------------- | -------------------------- |
| [Yarn Workspaces](https://yarnpkg.com/features/workspaces)                                        | Monorepo management        |
| [Docker Compose](https://docs.docker.com/compose/)                                                | Local development services |
| [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/)                                  | Code quality               |
| [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/okonet/lint-staged) | Git hooks                  |
| [Railway](https://railway.app/)                                                                   | Deployment platform        |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** ≥ 20.17.0
- **Yarn** ≥ 1.19.0
- **Docker** & **Docker Compose** (for local PostgreSQL)
- **Git**

### Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/bben-aou/nidal-alrouh.git
cd nidal-alrouh
```

#### 2️⃣ Install Dependencies

```bash
yarn install
```

#### 3️⃣ Environment Setup

Copy the example environment file and configure your variables:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
POSTGRES_USER=mvp_user
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=mvp_db
POSTGRES_PORT=5432
DATABASE_URL=postgresql://mvp_user:your_secure_password@localhost:5432/mvp_db

# JWT Secrets (generate secure random strings)
JWT_ACCESS_SECRET=your-super-secret-access-key-at-least-32-characters
JWT_REFRESH_SECRET=your-super-secret-refresh-key-at-least-32-characters

# Cal.com (optional, for scheduling)
CAL_ORIGIN=https://cal.com
```

#### 4️⃣ Start Database Services

```bash
docker-compose up -d
```

This starts:

- **PostgreSQL** on port `5432`
- **pgAdmin** on port `5050` (optional, for database management)

#### 5️⃣ Initialize the Database

```bash
# Navigate to backend
cd apps/backend

# Generate Prisma client
yarn prisma:generate

# Run migrations
yarn prisma:migrate

# (Optional) Seed with sample data
yarn prisma:seed

# Return to root
cd ../..
```

#### 6️⃣ Start Development Servers

From the project root:

```bash
yarn dev
```

This concurrently starts:

- 🌐 **Frontend**: http://localhost:1999
- 🔌 **Backend API**: http://localhost:8080

---

## 📁 Project Structure

```
nidal-alrouh/
├── apps/
│   ├── frontend/                 # Next.js 15 application
│   │   ├── src/
│   │   │   ├── app/              # App Router pages
│   │   │   │   └── [locale]/     # i18n routing (en, fr, ar)
│   │   │   ├── components/       # React components
│   │   │   ├── hooks/            # Custom React hooks
│   │   │   ├── apis/             # API client functions
│   │   │   ├── messages/         # Translation files (en, fr, ar)
│   │   │   ├── lib/              # Utilities & helpers
│   │   │   └── types/            # TypeScript definitions
│   │   └── package.json
│   │
│   └── backend/                  # NestJS API server
│       ├── src/
│       │   ├── auth/             # Authentication module
│       │   ├── users/            # User management
│       │   ├── helpers/          # Helper profiles & verification
│       │   ├── sessions/         # Support sessions
│       │   ├── chat/             # Real-time messaging
│       │   ├── journal/          # Reflections & prompts
│       │   ├── resources/        # Educational content
│       │   ├── community/        # Posts, events, comments
│       │   └── prisma/           # Database service
│       ├── prisma/
│       │   └── schema.prisma     # Database schema
│       └── package.json
│
├── docker/                       # Docker configuration
├── docker-compose.yml            # Local services
├── package.json                  # Root workspace config
└── README.md
```

---

## 📜 Available Scripts

Run these from the project root:

| Command           | Description                                         |
| ----------------- | --------------------------------------------------- |
| `yarn dev`        | Start both frontend and backend in development mode |
| `yarn build`      | Build both applications for production              |
| `yarn lint`       | Run ESLint on all workspaces                        |
| `yarn lint:fix`   | Auto-fix linting issues                             |
| `yarn format`     | Format code with Prettier                           |
| `yarn type-check` | Run TypeScript type checking                        |
| `yarn test`       | Run test suites                                     |
| `yarn clean`      | Remove build artifacts and node_modules             |

### Backend-specific Commands

```bash
cd apps/backend

yarn prisma:generate   # Generate Prisma client
yarn prisma:migrate    # Run database migrations
yarn prisma:seed       # Seed database with sample data
```

---

## 🌍 Internationalization

The platform fully supports three languages with dedicated localization:

| Language   | Code | Direction |
| ---------- | ---- | --------- |
| 🇬🇧 English | `en` | LTR       |
| 🇫🇷 French  | `fr` | LTR       |
| 🇲🇦 Arabic  | `ar` | RTL       |

Translation files are located in `apps/frontend/src/messages/{locale}/`.

---

## 🔒 Security Considerations

This platform handles sensitive mental health data. We implement:

- ✅ **Encrypted messaging** — Messages are encrypted at rest
- ✅ **Secure authentication** — Argon2 password hashing, JWT with refresh rotation
- ✅ **Content moderation** — Profanity filters and post reporting
- ✅ **CORS & Helmet** — HTTP security headers
- ✅ **Rate limiting** — Throttling to prevent abuse
- ✅ **Input validation** — Zod schemas on all endpoints

---

## 🤝 Contributing

We welcome contributions from developers, designers, translators, and mental health advocates!

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

Please read our [Development Rules](./DEVELOPMENT_RULES.md) before contributing.

### Areas We Need Help

- 🌍 **Translations** — Expanding language support
- 🎨 **UI/UX Design** — Improving accessibility and aesthetics
- 📖 **Documentation** — Guides, tutorials, and API docs
- 🧪 **Testing** — Unit, integration, and E2E tests
- 🔐 **Security** — Auditing and vulnerability testing

---

## 📋 Roadmap

- [ ] Mobile app (React Native)
- [ ] AI-powered crisis detection
- [ ] Video call support sessions
- [ ] Gamification for helper engagement
- [ ] Professional therapist marketplace
- [ ] Multi-tenant deployment for other regions

---

## 👨‍💻 Author

**Bilal Ben Aouad**

- GitHub: [@bben-aou](https://github.com/bben-aou)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- All the volunteer helpers who dedicate their time
- The open-source community for the incredible tools
- Mental health advocates working to reduce stigma
- Everyone who believes that no one should struggle alone

---

<p align="center">
  <strong>🕊️ "You're not alone in your struggle" — نضال الروح</strong>
</p>

<p align="center">
  Made with ❤️ for the mental health community
</p>
