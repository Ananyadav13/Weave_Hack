# 🔁 SkillSwap — A Skill Exchange Platform

![SkillSwap Banner](./public/banner.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-13+-000000?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue.svg)](https://www.typescriptlang.org/)
[![ShadCN](https://img.shields.io/badge/UI-ShadCN-lightgrey)](https://ui.shadcn.com/)
[![Made with Python](https://img.shields.io/badge/MachineLearning-Python-blue.svg)](https://www.python.org/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-purple)](https://clerk.com/)

---

## 📌 Overview

**SkillSwap** is a full-stack application where users can **exchange skills directly with others** or use **tokens** to access services. It's designed to empower users to trade knowledge and abilities in a smart, AI-assisted environment.

---

## 🌟 Key Features

### 🔄 Skill-for-Skill & Token Exchange
- Directly connect and exchange skills (e.g., design for coding).
- Use platform-specific tokens to request or offer services.

### 🧠 Sentiment-Based Skill Recommendations
- Uses a Python-based **sentiment analysis model** to rank and recommend users based on feedback and tone.

### 💬 AI Chat Assistant (Gemini)
- Built-in assistant using **Gemini** for real-time help, suggestions, and onboarding queries.

### 👤 Rich Profile & Request System
- Add your skills, certifications, ratings, and availability.
- Make requests or post services openly on the marketplace.

### 🔐 Authentication System
- Secure and simple sign-up/sign-in flow using Clerk with Google authentication.
- Modern Next.js integration for seamless user experience.

### 🧪 Skill Test and Review Modules
- Analyze peer reviews and skill tests for objective growth tracking.

---

## 📂 Project Structure

```bash
app/
├── analyzesenti/            # Sentiment analysis logic and API
├── api/                     # Backend API handlers
├── dashboard/               # Dashboard for logged-in users
├── gemini/                  # Gemini-based AI assistant
├── home/                    # Home/Landing pages
├── marketplace/             # Token-based skill trading
├── onboarding/              # Step-by-step user onboarding
├── pages/                   # Routing structure
├── portal/                  # User interaction hub
├── profile/                 # User profile, settings, history
├── request/                 # Request posting/accepting system
├── sign-in / sign-up        # Authentication pages
├── test-review-analysis/    # Skill test results & feedback logic

components/                  # Reusable UI components (ShadCN-based)
types/                       # TypeScript interfaces and types
lib/                         # Custom utility functions
public/                      # Static files (images, fonts)
```

## ⚙️ Technologies Used

### Frontend:
- Next.js 13+
- TypeScript
- Tailwind CSS + ShadCN/UI
- Context API + Providers for State Management

### Backend:
- Next.js API Routes
- Python (for ML model integration)

### Authentication:
- Clerk with Google Authentication

### AI/NLP:
- Gemini for chat assistance
- Custom Python-based Sentiment Analysis Model

## 📸 Screenshots

![image](https://github.com/user-attachments/assets/d4ca9e12-b7fc-4918-a9be-57d9b0bd4ca5)
![image](https://github.com/user-attachments/assets/e7fa101e-ed12-48bb-96a1-52a0d5dbcf70)
![image](https://github.com/user-attachments/assets/967517f1-a521-43df-891e-5aaa63c61e0f)
![image](https://github.com/user-attachments/assets/8e04766e-aac7-4463-a2e2-434873ead059)
![image](https://github.com/user-attachments/assets/bff513ff-261a-4ccd-a5ab-a93b3b0fafb3)
![image](https://github.com/user-attachments/assets/474d0ada-a690-49c5-9f3a-e233635a1334)
![image](https://github.com/user-attachments/assets/e35abca7-3d13-4719-af50-6796369196af)
![image](https://github.com/user-attachments/assets/36623abd-70a5-46d0-a0f2-f8e6569fa4e0)
![image](https://github.com/user-attachments/assets/033e3e3e-e90e-4cd5-ba1f-451fbd6f81f9)
![image](https://github.com/user-attachments/assets/fd341abf-2975-4e41-9441-c6679360f5d8)
![image](https://github.com/user-attachments/assets/97eba2c1-81c1-4492-84c1-d65918845735)


## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/AnupamSingh2004/skill-swap.git
cd skill-swap
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up Environment Variables

Create a `.env.local` file at the root of your project:

```
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### 4. Start the Dev Server

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` in your browser.

## 🧠 AI Features in Detail

### Gemini Assistant
- Built using Google's Gemini API for natural chat.
- Responds to skill queries, profile help, matching requests.

### Sentiment Analysis Model
- Trained on peer reviews and user messages.
- Scores users based on confidence, helpfulness, and positivity.
- Python server processes messages and recommends top matches.



## 🤝 Contributing

We love contributions from the community!

### How to Contribute:
1. Fork the repo
2. Create a new branch (`git checkout -b feature/awesome-feature`)
3. Make your changes
4. Submit a PR!

Please read the CONTRIBUTING.md for more details.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Team

This project was created during HacByte 3.0 by:
- [@AnupamSingh2004](https://github.com/AnupamSingh2004)
- [@Prachi-qqqq](https://github.com/Prachi-qqqq)
- [@Meoyushi](https://github.com/Meoyushi)
- [@Ananyadav13](https://github.com/Ananyadav13)

## 💬 Contact

For questions, feedback, or suggestions:
- GitHub: @AnupamSingh2004

---

*Built with ❤️ using Next.js, Python, and a whole lot of caffeine ☕*
