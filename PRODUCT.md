# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

There is no single target segment. The site speaks to four audiences, all of them fitting:

- **Small businesses and local organisations** that need a website, a platform or a digitised
  process, with no software team of their own.
- **Startups and founders** with a product idea to take from zero to launch.
- **The public sector** (local and public bodies). This is the most immediate audience while Urbi,
  the studio's own product for parish councils, approaches launch.
- **Technical teams** that need consulting, architecture review or extra hands.

Every visitor's job is to decide whether Proxio is the right partner to build their software, then
start a conversation.

## Product Purpose

Proxio Solutions is a software studio that designs, builds and evolves web and mobile software and
offers technology consulting. The website presents the studio and turns visitors into
conversations. Success is a qualified project brief or a question arriving through the contact
page.

## Positioning

- **Direct proximity.** Clients talk to the people who design and build their software, with no
  intermediaries or account managers. The name Proxio comes from proximity.
- **End to end.** One team covers strategy, design, engineering and launch.
- **Solid engineering.** A modern stack (React, .NET, React Native, TypeScript) and well-made,
  sustainable code.

Having its own product (Urbi) is not used as a positioning claim.

## Operating Context

- Clients are in Portugal first, and international clients matter too. Portuguese is the default
  language at `/`, and English lives at `/en` with the same pages and paths.
- Visitors reach the team through the contact page in one of two modes. "Tenho um projeto" is a
  three-step brief: type, details (features, deadline, budget) and contact. "Só quero fazer uma
  pergunta" sends a plain message. Both arrive by email, and the copy promises a reply within 24
  hours.
- The site is static, pre-rendered for every route in both languages, and deployed to GitHub Pages
  from `main` (proxiosolutions.com).

## Capabilities and Constraints

- **Services:** web application development, mobile apps (iOS and Android with React Native), and
  technology consulting (stack selection, architecture review, product roadmap).
- **Urbi** is presented low-key until it has clients: a short "in development" card on Projects
  and one sentence in the About story. The full presentation (Home section, interactive demo, link
  to the Urbi site, case study) exists in code behind `VITE_SHOW_URBI` and
  `VITE_ENABLE_CASE_STUDY_URBI`, both off in production.
- **Insights** (articles) stays hidden until the team publishes an article it wrote.
- Every user-facing string exists in both `pt.json` and `en.json`. URL segments are English in
  both languages.
- **Open decisions, not facts yet:**
  - the contact brief's budget bands and per-feature week estimates are placeholders until the team
    confirms them;
  - the final domain of the Urbi site is unconfirmed.

## Brand Commitments

- The name Proxio comes from proximity, and the voice carries it.
  - Portuguese is PT-PT with the informal "tu": warm and close, but professional, never corporate
    or stiff, and never Brazilian Portuguese forms.
  - English mirrors the meaning, not the words.
- Proxio presents itself as a studio and never mentions team size.
- The existing logo and wordmark are binding: `public/logo.svg` and `src/assets/banner.svg`.
- Project rules in `.claude/rules/` (content, URLs, git workflow) are binding on all design work.

## Evidence on Hand

- **Real:**
  - the founders' story (two Computer Engineering classmates who became co-founders), in About;
  - the services and the process (discovery, design, build, launch and scale);
  - Urbi as a product in development;
  - the team section in About.
- **Absent, never to be fabricated:** client case studies, testimonials, client logos, reviews,
  ratings, metrics or results. A section that needs them is left out until real, team-approved
  material exists.
- **Confidential:** the Urbi pilot parish council is never named anywhere. It is "a primeira junta
  de freguesia parceira" or "our first partner parish council".

## Product Principles

1. **Show proximity, don't just claim it.** Direct contact, real people, a fast and specific reply.
   The design should make reaching the team feel easy and personal.
2. **Truth over polish.** No invented proof. Where there is no evidence yet, the page stays honest
   and shorter rather than filled.
3. **A broad offer, a clear path.** Serve all four audiences without picking one, and let the
   contact brief route each visitor to the right conversation.
4. **Proxio is broader than Urbi.** Urbi is one project, not the studio's identity. Section copy
   talks about software and product in general.
5. **Both languages are first-class.** Every page, string and URL works equally in Portuguese and
   English.
