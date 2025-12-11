# Development & Deployment Workflow

This project uses a resource-optimized workflow to ensure we stay within free tier limits on Vercel (Frontend) and Railway (Backend).

## 🌳 Branching Strategy

We use a strict branching model to control deployments.

| Branch   | Environment    | Auto-Deploy? | Purpose                                  |
| :------- | :------------- | :----------- | :--------------------------------------- |
| `main`   | **Production** | ✅ YES       | Stable code. Deploys to live site.       |
| `dev`    | Development    | ❌ NO        | Daily work. Merged into main when ready. |
| `feat/*` | Local/Preview  | ❌ NO        | Feature branches (e.g., `feat/auth`).    |

### 🚀 How to Work

1.  **Start a new feature**:
    ```bash
    git checkout -b feat/my-new-feature
    ```
2.  **Work and Push**:

    ```bash
    git add .
    git commit -m "feat: added cool stuff"
    git push origin feat/my-new-feature
    ```

    _Result_: No deployment. Resources saved. 💰

3.  **Merge to Dev (Optional)**:
    If you want to combine work with others without deploying:

    ```bash
    git checkout dev
    git merge feat/my-new-feature
    git push origin dev
    ```

    _Result_: No deployment.

4.  **Release to Production**:
    Open a Pull Request to merge your branch into `main`.
    Once merged, **Vercel and Railway will automatically deploy**.

---

## 🛠 Configuration Setup

We have configured the project to strictly enforce these rules.

### 1. Backend (Railway)

**Config File**: `railway.json` (Created in root)

- **Logic**: Railway is configured to only watch for changes in the `apps/backend/` directory. Changes to frontend code will **not** trigger a backend build.
- **Manual Step**:
  1.  Go to your Railway Project Settings.
  2.  Ensure "Production Branch" is set to `main`.
  3.  (Optional) Disable "Trigger on Push" for other branches if enabled.

### 2. Frontend (Vercel)

**Script**: `apps/frontend/vercel-ignore-build.sh`

- **Logic**: This script stops the build unless:
  1.  You are on the `main` branch.
  2.  **AND** files in `apps/frontend/` have changed.

- **✅ REQUIRED ACTION**:
  1.  Go to your Vercel Project Dashboard.
  2.  Navigate to **Settings** > **Git**.
  3.  Scroll to **Ignored Build Step**.
  4.  Select **Command** and paste this exact command:
      ```bash
      bash apps/frontend/vercel-ignore-build.sh
      ```
  5.  Save.

---

## 💡 Pro Tips

- **Skip CI Manually**: If you are pushing a typo fix to `main` and don't want to deploy, add `[skip ci]` to your commit message:
  ```bash
  git commit -m "docs: fix typo [skip ci]"
  ```
- **Monorepo Smarts**: The configurations above ensure that if you only change the backend, the frontend won't rebuild, and vice versa.
