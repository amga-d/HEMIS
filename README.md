# My Fullstack App

This repository contains both the frontend and backend of the project.

## 📂 Project Structure

```
/frontend    # Next.js (Vite/CRA) app and Tailwind
/backend     # Node.js (Express) server
```

---

## 🚀 Getting Started

1. **Clone the repo:**

```bash
git clone https://github.com/amga-d/HEMIS.git
cd HEIMS
```

2. **Install dependencies for each part:**

- Frontend:

```bash
cd frontend
npm install
```

- Backend:

```bash
cd backend
npm install
```

3. **Run development servers:**

- Frontend:

```bash
npm run dev
```

- Backend:

```bash
npm run dev
```

---

## 🌱 Branching Strategy

We follow the **Git Feature Branch Workflow**:

| Branch | Purpose                                     |
| ------ | ------------------------------------------- |
| `main` | Production-ready, always deployable         |
| `dev`  | Integration branch for development features |

### ✅ Creating a feature or fix branch:

```bash
git switch dev
git pull origin dev
git checkout -b feat/<feature-name>
```

or

```bash
git checkout -b fix/<bug-fix-name> dev
```

Examples:

```
feat/frontend-login-page
feat/backend-api-auth
fix/frontend-navbar-alignment
```

### ✅ After finishing:

```bash
git add .
git commit -m "feat: add login page"   # Conventional Commits preferred
git push origin feat/<feature-name>
```

Then open a **Pull Request to `dev` branch**.

---

## 🚨 Important Notes

- **Never commit directly to `main` or `dev`.**
- Create Pull Requests (PRs) and wait for review/approval.
- Use **clear and descriptive commit messages** (follow Conventional Commits):

```
feat: add user registration API
fix: resolve CORS issue in backend
```

- Keep PRs **small and focused on one task**.
- **Check your code with ESLint & Prettier** before pushing.

---

## 🤝 Contributors

| Name            | GitHub Profile                         | Role                 |
| --------------- | -------------------------------------- | -------------------- |
| Amgad Al-Ameri  | [@amga-d](https://github.com/amga-d)   | Maintainer / Backend |
| Ravfael Novfito | [@Ravfael](https://github.com/Ravfael) | Frontend Developer   |

---

## 📬 Contact

For questions or discussions, feel free to open an issue or contact the maintainer.

Color Theme: from-blue-800 via-cyan-700 to-indigo-900
from-cyan-800 via-teal-700 to-slate-800
