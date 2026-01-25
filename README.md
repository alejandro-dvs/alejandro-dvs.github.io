# Alejandro del Valle - Academic Website

Personal academic website built with Hugo and a custom editorial theme.

## Local Development

### Prerequisites
- [Hugo Extended](https://gohugo.io/installation/) (v0.112.0 or later)

### Running locally

```bash
# Clone the repository
git clone https://github.com/alejandro-dvs/alejandro-dvs.github.io.git
cd alejandro-dvs.github.io

# Start the development server
hugo server -D

# Site will be available at http://localhost:1313
```

### Building for production

```bash
hugo --minify
```

Output will be in the `public/` directory.

## Deploying to GitHub Pages

The site automatically deploys when you push to the `main` branch via GitHub Actions.

### Initial setup

1. Go to your repository Settings → Pages
2. Under "Build and deployment", select "GitHub Actions" as the source
3. Push to `main` and the workflow will run

## Site Structure

```
.
├── content/
│   ├── _index.md              # Homepage content
│   ├── publications/          # Research papers
│   │   ├── _index.md
│   │   └── paper-name.md
│   └── teaching/              # Courses
│       ├── _index.md
│       └── course-name.md
├── static/
│   ├── files/
│   │   └── cv.pdf             # Your CV
│   └── images/
│       ├── headshot.jpg       # Your photo
│       └── publications/      # Paper figures
├── themes/academic-minimal/   # Custom theme
└── hugo.toml                  # Site configuration
```

## Adding New Content

### New Publication

```bash
hugo new publications/paper-slug.md
```

Then edit the front matter:

```yaml
---
title: "Paper Title"
authors:
  - A. del Valle
  - Co-Author Name
journal: "Journal Name"
year: 2025
volume: "1(2)"
pages: "100-120"
paper_url: "https://doi.org/..."
preprint_url: ""
image: "paper-figure.jpg"        # Place in static/images/publications/
featured: true                   # Show on homepage
finding: "Key finding in one sentence"
media:
  - name: "News Outlet"
    url: "https://..."
---

Deep dive content here (appears in expandable section).
```

### New Course

```bash
hugo new teaching/course-code.md
```

```yaml
---
title: "Course Name"
code: "DEPT 1234"
level: "PhD"          # PhD, MBA, UG
description: "Course description"
order: 1              # Display order
---
```

### Updating Your CV

Replace `static/files/cv.pdf` with your updated CV.

### Updating Your Photo

Replace `static/images/headshot.jpg` with your photo (recommended: square, ~800x800px).

## Customization

### Colors

Edit CSS variables in `themes/academic-minimal/assets/css/main.css`:

```css
:root {
  --color-accent: #1a5f5a;        /* Main accent (teal) */
  --color-bg: #faf9f7;            /* Background */
  --color-text: #2d2d2d;          /* Body text */
}
```

### Social Links

Edit `hugo.toml`:

```toml
[params]
  google_scholar = "https://scholar.google.com/..."
  github = "https://github.com/..."
  # etc.
```

## Design Philosophy

This theme prioritizes:
- **Editorial feel**: Serif headings, generous whitespace, warm colors
- **Publication-first**: Papers displayed as visual case studies
- **Accessibility**: Proper heading hierarchy, sufficient contrast, keyboard navigation
- **Performance**: Minimal JavaScript, optimized fonts, lazy loading

## License

Theme is MIT licensed. Content is copyright Alejandro del Valle.
