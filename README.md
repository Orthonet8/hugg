# HUGG Landing

Landing site for the Haramaya University Orthodox Tewahedo student fellowship.

The app is built with React and Vite, and it presents the fellowship history, service areas, schedules, and photo galleries in a routed single-page experience.

## What is in the app

- Home page with the main hero, weekly schedules, and featured fellowship content
- About page with fellowship history, mission, vision, and image galleries
- Background page with a longer historical overview
- Blog page focused on spiritual themes, routed at `/blog`
- Language selector with English, Amharic, and Afan Oromo options
- Responsive navigation that uses a bottom bar on mobile and a top bar on larger screens

## Tech Stack

- React 19
- React Router
- Vite
- Tailwind CSS 4
- ESLint

## Project Structure

- `src/App.jsx` wires the routes together
- `src/components/SiteLayout.jsx` provides the shared layout, navigation, and language menu
- `src/pages/HomePage.jsx` contains the landing page content
- `src/pages/AboutPage.jsx` contains the fellowship overview and gallery sections
- `src/pages/BackgroundPage.jsx` contains the historical background page
- `src/pages/BlackPage.jsx` contains the blog-style spiritual page

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build the production bundle:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run linting:

```bash
npm run lint
```

## Routes

- `/` - Home
- `/about` - About
- `/blog` - Blog
- `/black` - Redirects to `/blog`
- `/background` - Background

## በአማርኛ

ይህ ፕሮጀክት የሐረማያ ዩኒቨርሲቲ ግቢ ጉባኤ መረጃዎችን በዘመናዊ የድር አቀራረብ ለማቅረብ የተሰራ ነው። ተጠቃሚው የድርጅቱን ታሪክ፣ ዓላማ፣ ራዕይ እና የሳምንቱን መርሃ ግብር በአንድ ቦታ ያገኛል።

ዋና ገጾቹ የመነሻ ገጽ፣ ስለ እኛ ገጽ፣ የታሪክ ገጽ እና የመንፈሳዊ ጽሑፍ ገጽ ናቸው። በስልክ ላይ ታችኛው የአሰሳ ምናሌ ይታያል፣ በትልቅ ማያ ገጽ ደግሞ የላይኛው አሰሳ ይታያል።

## Notes

- The app currently uses static content and imported images from `src/assets`.
- The language selector is present in the UI; the pages themselves are primarily authored in Amharic already.
