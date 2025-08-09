# ✨ ToolsInd — Capstone Project Hacktiv8 x IBM SkillsBuild

[![TypeScript](https://img.shields.io/badge/language-TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/framework-Next.js-blue.svg)](https://nextjs.org/)
[![ESLint](https://img.shields.io/badge/framework-tailwind-blue.svg)](https://tailwind.org/)

> This is a full-stack web application built using Next.js and TypeScript. This project serves as the capstone project for the **IBM SkillsBuild** x **Hacktiv8** program, and it offers various online utilities such as a currency converter, a fake data generator, and more.

---

## ✨ Key Features

- **AI-Powered Coding Assistance:** This project incorporates IBM Granite AI as one of the integrated tools to assist with coding tasks. The AI functionality is connected via IBM Granite's API and is designed to support and enhance the development experience within the suite of online utilities that I have personally developed.
- **Diverse Online Utilities:** The application provides a comprehensive set of online tools, including a currency converter, fake data generator, image compressor, JSON validator, Lorem Ipsum generator, Markdown to HTML converter, password generator, QR code generator, text case converter, text comparator, text splitter, unit converter, and Unix timestamp converter. All features are designed to help users complete common tasks with ease.
- **User-Friendly Interface:** The application's design focuses on an intuitive and easy-to-use user experience, with a clean layout and simple navigation. The UI components appear to be consistent and well-organized.
- **Integrated Backend API:** The application has an integrated backend API that allows certain features, such as currency conversion and image processing, to function properly.
- **Efficient Library Usage:** The project leverages various popular and efficient JavaScript libraries to enhance functionality and streamline development.

---

## 🛠️ Technology Stack

| Category             | Technology            | Notes                                              |
| -------------------- | --------------------- | -------------------------------------------------- |
| Programming Language | TypeScript            |                                                    |
| Framework            | Next.js               | Next.js framework for building the web application |
| Linting              | ESLint                | To ensure code quality                             |
| Package Management   | npm                   |                                                    |
| UI References        | Lucide, Heroicons     |                                                    |
| Others               | Axios, Faker.js, etc. | Various libraries for additional functionality     |

---

## 🏛️ Architecture Overview

This application follows a typical full-stack web application architecture, with a frontend built using Next.js and React, and an integrated backend API to handle data requests and processing. The directory structure shows a clear separation between components, utilities, and the API.

---

## 🚀 Getting Started

Here are the steps to run this project in your local environment:

1. Clone the repository:
   ```bash
   git clone https://github.com/Roti18/toolsind
   ```
2. Navigate to the project directory:
   ```bash
   cd capstone-project_hacktiv8xibm
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file with the following content:
   ```bash
   REPLICATE_API_TOKEN=YOUR_API_TOKEN
   CONVERTAPI_SECRET=YOUR_API_TOKEN
   ```
   You can get your Replicate API Token [Here](https://replicate.com/account/api-tokens) and your Convert API Token [Here](https://www.convertapi.com/a/authentication).
5. Run the development server:
   ```bash
   npm run dev
   ```

## 📂 Structure Folder

```
/
├── .gitignore
├── README.md
├── data
│   └── toolsCard.tsx
├── declaration.d.ts
├── eslint.config.mjs
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│   └── icons
│       └── wrench.svg
├── src
│   ├── app
│   │   ├── ... (komponen halaman aplikasi)
│   ├── components
│   │   ├── ... (komponen yang dapat digunakan kembali)
│   └── utils
│       ├── ... (fungsi utilitas)
├── tailwind.config.ts
├── tes.html
└── tsconfig.json
```

- **src**: This directory contains the main source code of the application, including components, pages, and utilities.
- **public**: This directory holds static assets like images and icons that will be served directly by Next.js.
- **data**: This directory likely contains sample data or data-related components.

---

## ✨ Acknowledgements

This project would not have been possible without the support of various parties. We would like to express our sincere gratitude to:

- IBM SkillsBuild and Hacktiv8 for providing an outstanding training program.

- Our instructors and mentors for their guidance throughout the learning process.

- The entire team involved in this project for their hard work and collaboration.

---

## 📄 License

This project is released under the [**MIT License**](/LICENSE.md). See the file for more details.
