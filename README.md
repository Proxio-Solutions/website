# Proxio Solutions — Website

Site institucional da **Proxio Solutions**, disponível em [proxiosolutions.com](https://proxiosolutions.com).

Construído com React 19, TypeScript e Vite, com suporte a internacionalização (i18n), routing client-side e deploy estático via GitHub Pages.

---

## Índice

- [Stack Tecnológica](#stack-tecnológica)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Desenvolvimento Local](#desenvolvimento-local)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Deploy](#deploy)
- [Contribuição](#contribuição)

---

## Stack Tecnológica

| Camada     | Tecnologia              |
| ---------- | ----------------------- |
| Framework  | React 19                |
| Linguagem  | TypeScript 5.9          |
| Build Tool | Vite 8                  |
| Estilos    | Tailwind CSS 4          |
| Routing    | React Router DOM 7      |
| i18n       | i18next + react-i18next |
| Ícones     | Lucide React            |
| Email      | EmailJS                 |
| Linting    | ESLint 9 + Prettier     |

---

## Pré-requisitos

- **Node.js** >= 20 ([download](https://nodejs.org))
- **npm** >= 10 (incluído com o Node.js)
- Acesso às variáveis de ambiente necessárias (ver abaixo)

---

## Instalação

```bash
# 1. Clonar o repositório
git clone https://github.com/proxio-solutions/website.git
cd website

# 2. Instalar dependências
npm install
```

---

## Variáveis de Ambiente

Criar um ficheiro `.env` na raiz do projeto com base no `.env.example`:

```bash
cp .env.example .env
```

| Variável                   | Descrição              | Obrigatória |
| -------------------------- | ---------------------- | ----------- |
| `VITE_EMAILJS_SERVICE_ID`  | ID do serviço EmailJS  | Sim         |
| `VITE_EMAILJS_TEMPLATE_ID` | ID do template EmailJS | Sim         |
| `VITE_EMAILJS_PUBLIC_KEY`  | Chave pública EmailJS  | Sim         |

> As variáveis com prefixo `VITE_` são expostas ao cliente. Nunca colocar segredos sem este prefixo em variáveis de ambiente do Vite.

---

## Desenvolvimento Local

```bash
npm run dev
```

O servidor de desenvolvimento estará disponível em `http://localhost:5173` com Hot Module Replacement (HMR) ativo.

---

## Scripts Disponíveis

| Comando           | Descrição                                      |
| ----------------- | ---------------------------------------------- |
| `npm run dev`     | Inicia o servidor de desenvolvimento           |
| `npm run build`   | Compila TypeScript e gera o bundle de produção |
| `npm run preview` | Serve o bundle de produção localmente          |
| `npm run lint`    | Corre o ESLint em todos os ficheiros           |

---

## Estrutura do Projeto

```
website/
├── public/             # Ficheiros estáticos (favicon, og images, etc.)
├── src/
│   ├── assets/         # Imagens, fontes e outros assets
│   ├── components/     # Componentes reutilizáveis (Navbar, Footer, SEO…)
│   ├── config/         # Configurações globais
│   ├── hooks/          # Custom hooks React
│   ├── i18n/           # Ficheiros de tradução (PT, EN, …)
│   ├── pages/          # Páginas da aplicação
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── Services.tsx
│   │   ├── Projects.tsx
│   │   ├── Contact.tsx
│   │   ├── CaseStudyUrbi.tsx
│   │   ├── PrivacyPolicy.tsx
│   │   └── NotFound.tsx
│   ├── services/       # Integrações com serviços externos (EmailJS, etc.)
│   ├── App.tsx         # Componente raiz e configuração de rotas
│   ├── main.tsx        # Entry point da aplicação
│   └── index.css       # Estilos globais (Tailwind base)
├── .env.example        # Template de variáveis de ambiente
├── CNAME               # Domínio personalizado (GitHub Pages)
├── eslint.config.js    # Configuração do ESLint
├── vite.config.ts      # Configuração do Vite
├── tsconfig.json       # Configuração base do TypeScript
└── package.json
```

---

## Deploy

O site é publicado automaticamente via **GitHub Pages** a partir da branch `main`.

O bundle de produção é gerado com:

```bash
npm run build
```

Os ficheiros gerados ficam na pasta `dist/` e são servidos como site estático. O ficheiro `CNAME` define o domínio personalizado `proxiosolutions.com`.

---

## Contribuição

1. Criar uma branch a partir de `dev`: `git checkout -b feature/nome-da-feature`
2. Fazer commit das alterações com mensagens claras e descritivas
3. Abrir um Pull Request para revisão antes de fazer merge

---
