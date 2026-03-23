# 💡 Jugaad Idea Generator

> Enter a problem and get a low-cost, creative **"jugaad"** (hack) solution — powered by AI.

**Jugaad** (जुगाड़) is the Hindi word for a flexible, frugal approach to problem-solving using limited resources in innovative ways. This app brings that spirit to the web: describe any everyday problem and receive a fun, resourceful, and culturally authentic hack to solve it.

---

## ✨ Features

- **AI-Powered Solutions** — Uses Meta's Llama 3.1 405B model (via NVIDIA NIM API) to generate creative, step-by-step jugaad solutions with materials lists and instructions.
- **Google Sign-In** — Authenticate with Google to unlock saved ideas.
- **Save & Manage Ideas** — Bookmark your favourite jugaad solutions to Firestore and revisit or delete them anytime.
- **Markdown Rendering** — Solutions are beautifully rendered with full Markdown & GFM support (tables, lists, bold, etc.).
- **Smooth Animations** — Polished UI transitions powered by Framer Motion.
- **Responsive Design** — Looks great on mobile and desktop.

---

## 🛠️ Tech Stack

| Layer        | Technology                                                    |
|:------------ |:------------------------------------------------------------- |
| Framework    | [Next.js 15](https://nextjs.org/) (App Router, React 19)     |
| Language     | TypeScript                                                    |
| Styling      | Tailwind CSS 4                                                |
| Animations   | [Motion](https://motion.dev/) (Framer Motion)                |
| AI Backend   | NVIDIA NIM API — `meta/llama-3.1-405b-instruct`              |
| Auth         | Firebase Authentication (Google provider)                     |
| Database     | Cloud Firestore                                               |
| Icons        | [Lucide React](https://lucide.dev/)                           |
| Markdown     | `react-markdown` + `remark-gfm`                              |

---

## 📁 Project Structure

```
jugaad-idea-generator/
├── app/
│   ├── api/
│   │   └── generate-jugaad/
│   │       └── route.ts          # NVIDIA AI API endpoint
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout with fonts & AuthProvider
│   └── page.tsx                  # Main page — input form & results
├── components/
│   ├── AuthProvider.tsx          # Firebase Auth context provider
│   └── SavedIdeas.tsx            # Saved jugaad list with delete
├── hooks/
│   └── use-mobile.ts             # Mobile viewport detection hook
├── lib/
│   ├── firestore-error.ts        # Firestore error handling utility
│   └── utils.ts                  # General utilities (cn helper)
├── firebase.ts                   # Firebase app initialisation
├── firestore.rules               # Firestore security rules
├── firebase-blueprint.json       # Firestore data model schema
├── next.config.ts                # Next.js configuration
├── package.json
└── .env                          # Environment variables (not committed)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** or **yarn**
- An **NVIDIA NIM API key** ([get one here](https://build.nvidia.com/))
- A **Firebase project** with Authentication (Google) and Firestore enabled

### 1. Clone the repository

```bash
git clone https://github.com/sujalvishwakarma/Jugaad-Idea-Generator.git
cd Jugaad-Idea-Generator
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
NVIDIA_API_KEY=your_nvidia_api_key_here
```

### 4. Configure Firebase

Update `firebase-applet-config.json` with your Firebase project credentials:

```json
{
  "projectId": "your-project-id",
  "appId": "your-app-id",
  "apiKey": "your-api-key",
  "authDomain": "your-project.firebaseapp.com",
  "firestoreDatabaseId": "your-firestore-db-id",
  "storageBucket": "your-project.firebasestorage.app",
  "messagingSenderId": "your-sender-id",
  "measurementId": ""
}
```

### 5. Deploy Firestore security rules

```bash
npx firebase-tools deploy --only firestore:rules
```

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Command         | Description                         |
|:--------------- |:----------------------------------- |
| `npm run dev`   | Start development server            |
| `npm run build` | Create production build              |
| `npm run start` | Start production server              |
| `npm run lint`  | Run ESLint                           |
| `npm run clean` | Clean `.next` build cache            |

---

## 🔒 Firestore Security

The app uses per-user subcollections (`users/{userId}/savedJugaads`) with security rules that ensure:

- Only authenticated users can read/write their **own** data
- All required fields are validated on `create` and `update`
- Immutable fields (`createdAt`, `userId`) cannot be modified after creation
- String lengths are bounded (problem: 1–1000 chars, solution: 1–10000 chars)

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
