## ⚙️ Basic instruction for deployment in GitHub pages

# 🚀 Angular GitHub Pages Deployment (Auto via GitHub Actions)

This project auto-deploys an Angular app hosted in a nested folder using GitHub Actions whenever code is pushed to specific branches.

## 📦 Project Folder Structure

```
/Rohit-Nair296
├── Backend/
├── Frontend/
├── my-portfolio-angular/
│   └── portfolio-site/
│       ├── angular.json
│       ├── package.json
│       └── dist/
├── .github/
│   └── workflows/
│       └── deploy.yml
```

## ✅ GitHub Actions Setup

Deployment is configured via `.github/workflows/deploy.yml`.

### ✅ Triggers:
The deployment workflow is triggered when pushing to either of the following branches:
- `main`
- `my_portfolio_web_app`

You can also manually trigger the workflow from the **Actions** tab using the “Run workflow” button.

---

## ⚙️ GitHub Actions Workflow Summary

### 📄 `.github/workflows/deploy.yml`

```yaml
name: Deploy Angular Web App to GitHub Pages

on:
  push:
    branches:
      - main
      - my_portfolio_web_app
  workflow_dispatch:

defaults:
  run:
    working-directory: my-portfolio-angular/portfolio-site

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout source code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build Angular app
        run: npx ng build --configuration production --base-href "/Rohit-Nair296/"

      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          branch: gh-pages
          folder: my-portfolio-angular/portfolio-site/dist
```

---

## 📍 Important Notes

- **Base Href** in the build step must match your GitHub repo name:
  ```bash
  --base-href "/Rohit-Nair296/"
  ```

- The `dist` folder path is based on your `angular.json` output:
  ```json
  "outputPath": "dist"
  ```

- Angular CLI is used via `npx` to avoid global version mismatch.

- You can extend this workflow to deploy differently for each branch using `if: github.ref == 'refs/heads/branch-name'`.

---

## 🌐 Deployment URL

Once deployed, your site will be available at:

📦 `https://<your-github-username>.github.io/<your-repo-name>/`  
➡ For this repo:  
`https://rohitNair321.github.io/Rohit-Nair296/`

---

## 🧪 Test the Workflow

1. Push code to `main` or `my_portfolio_web_app`
2. Go to the **Actions** tab on GitHub
3. Watch the workflow run and deploy
4. Visit your GitHub Pages URL 🎉

---

## 🙋‍♂️ Want More?

You can enhance the workflow with:
- Environment-specific `baseHref`
- Deployment preview for pull requests
- Caching `node_modules` for faster builds
- Slack/email notification on deploy

