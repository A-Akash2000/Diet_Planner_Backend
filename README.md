# 🥗 Personalized Diet Planner - Backend

This is the backend of the **Personalized Diet Planner** – a secure and scalable Node.js + Express + MongoDB application that generates personalized diet plans based on BMI and user health goals.

---

## 👨‍⚕️ Project Objective

The goal is to provide a backend API to:

- Register users and capture health metrics
- Calculate BMI and determine the category
- Generate personalized meal plans (daily/weekly)
- Track nutritional information per meal
- Enable plan viewing and updates

---

## 🛠️ Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Validation**: express-validator + Yup
- **Authentication**: JWT (optional for future expansion)

---

## 📁 Folder Structure

diet-planner-backend/
├── src/
│ ├── /src/utils/database # MongoDB config
│ ├── /src/app/users/controllers/ # Controller logic
│ ├── src/app/users/models/ # Mongoose models
│ ├── src/app/users/routes # Express route handlers
│ ├── /src/routes/routes/ # TypeScript interfaces
│ ├── /src/app/utils/ # Utility functions
│ ├── /src/app/Users/validation/ # Request validators
│ └── server.ts # Express app initialization
├── .gitignore # Ignored files/folders
├── package.json # Dependencies & scripts
├── tsconfig.json # TypeScript config
└── README.md # Project info (this file)


npm install


npm run start:local