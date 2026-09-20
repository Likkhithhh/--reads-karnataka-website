# READS Karnataka Website

Static website for **Rural Education and Action Development Society (READS), Karnataka**.

## Overview

The site presents READS' mission, programmes, projects, leadership, donors, community work, and contact information. It is built as a lightweight static site and is suitable for GitHub Pages or Firebase Hosting.

## Pages

- `index.html` — home page
- `about.html` — organization overview
- `programmes.html` — programmes
- `projects.html` — projects and field work
- `board.html` — board and leadership
- `donors.html` — donors and partners
- `contact.html` — contact information

## Tech stack

- HTML5
- CSS3
- JavaScript
- Static image assets
- Firebase Hosting configuration

## Run locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deployment

This is a static website and can be deployed with GitHub Pages, Firebase Hosting, Netlify, or similar static hosting providers.

## Repository hygiene

Local Firebase cache data, macOS metadata, logs, and environment files are excluded through `.gitignore`.

## Asset note

The prepared project bundle contains the site's JPG/PNG image assets. The connected GitHub integration used for this update can create text files but does not expose binary-file upload, so the HTML/CSS/JS/Firebase source is committed here while the image assets remain in the prepared project bundle.
