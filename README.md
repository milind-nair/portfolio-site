# Milind Nair - Portfolio Website

A modern, responsive portfolio website built with React and Material UI. This site showcases my projects, skills, and professional background with a clean, professional design.

## Features

- **Responsive Design**: Fully responsive layout that looks great on all devices, from mobile to desktop.
- **Custom Theme**: Sophisticated Dark/Light mode support with a custom-crafted color palette.
- **Interactive UI**:
    - **Hero Section**: Eye-catching introduction with gradient text and call-to-actions.
    - **About Section**: Detailed bio and skills display using chips.
    - **Projects Grid**: Showcase of work with descriptions, tags, and links.
    - **Contact Section**: Polished contact area with email and social links.
- **Smooth Navigation**: Single-page smooth scrolling with a persistent side navigation drawer.
- **Automated Deployment**: Configured with GitHub Actions for automatic deployment to GitHub Pages.

## Tech Stack

- **Frontend**: React, Material UI (MUI)
- **Icons**: MUI Icons
- **Deployment**: GitHub Pages

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/milind-nair/portfolio-site.git
   ```
2. Navigate to the project directory:
   ```bash
   cd portfolio-site
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

Start the development server:
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Deployment

### Manual Deployment

To deploy manually to GitHub Pages:
```bash
npm run deploy
```

### Automatic Deployment

This project includes a GitHub Action (`.github/workflows/deploy.yml`) that automatically builds and deploys the site to the `gh-pages` branch whenever changes are pushed to `master`.

1. Push your changes to the `master` branch.
2. Go to your repository settings on GitHub -> **Pages**.
3. Ensure the source is set to **Deploy from a branch** and select `gh-pages` / `/ (root)`.

## License

This project is open source and available under the [MIT License](LICENSE).
