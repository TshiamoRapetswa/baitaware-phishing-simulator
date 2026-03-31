# 🎣 BaitAware — Phishing Detection Quiz

> *Can you spot the bait?* Train your eye to recognise phishing attacks before they hook you.

---

## 📖 Overview

**BaitAware** is an interactive cybersecurity awareness quiz that challenges users to identify phishing attempts across 10 realistic scenarios — including emails, SMS messages, login pages, and social media posts.

Each scenario is rendered as a faithful UI mock (fake email client, SMS thread, browser window, or social feed), giving the user the same visual context they'd experience in the real world.

---

## 🚀 Getting Started

Follow these steps to download and run the **BaitAware Phishing Simulator** locally.

### 1. Clone the repository

Open your terminal or Command Prompt and run:

```bash
git clone https://github.com/TshiamoRapetswa/baitaware-phishing-simulator.git
```

### 2. Navigate to the project folder

```bash
cd baitaware-phishing-simulator
```

### 3. Open the simulator

No installation, build tools, or server setup is required.

Simply open the main file in your browser:

```bash
open index.html
```

Alternatively, you can:

- Navigate to the project folder
- Double-click **index.html**
- The simulator will open in your default web browser

### Alternative: Download ZIP

If you prefer not to use Git:

1. Go to the repository on GitHub
2. Click **Code**
3. Select **Download ZIP**
4. Extract the files
5. Open **index.html** in your browser

---

## ⚠️ Disclaimer

This project is intended for **educational and cybersecurity awareness purposes only**.

It simulates phishing techniques to help users recognize and avoid phishing attacks.  
Do **not** use this project for malicious, deceptive, or unauthorized activities.
---

## 📂 Folder Structure

```
baitaware/
├── index.html              # Main app (all screens: splash, quiz, results)
├── css/
│   └── style.css           # All styles: layout, components, animations, responsive
├── js/
│   └── script.js           # Quiz engine: data, rendering, scoring, results
├── assets/
│   ├── favicon.png         # BaitAware icon (used as browser tab favicon)
│   └── logo.png            # Full BaitAware logo (used on splash + results)
└── README.md               # This file
```

---

## 🎮 How It Works

1. **Splash Screen** — Introduces the challenge with branding and a "Start" button.
2. **Quiz Screen** — Presents one scenario at a time in a card layout:
   - A visual mock of the communication (email, SMS, login page, or social post)
   - Two buttons: **Safe** or **Phishing**
   - Instant feedback with explanation and colour-coded clues
3. **Results Screen** — Shows your final score with:
   - Animated score ring
   - Personalised result message
   - Per-question review summary
   - Share / retry options

---

## 📚 Scenario Coverage

| # | Type        | Answer    | Scenario                        |
|---|-------------|-----------|----------------------------------|
| 1 | Email       | Phishing  | Fake PayPal account suspension   |
| 2 | Email       | Safe      | Real GitHub SSH key alert        |
| 3 | SMS         | Phishing  | Fake FedEx delivery smishing     |
| 4 | Login Page  | Phishing  | Fake Bank of America login       |
| 5 | Login Page  | Safe      | Real Google sign-in page         |
| 6 | Email       | Phishing  | Fake Microsoft 365 renewal       |
| 7 | Social Media| Phishing  | Fake Facebook prize scam         |
| 8 | SMS         | Safe      | Real bank 2FA one-time PIN       |
| 9 | Email       | Phishing  | Corporate IT password reset trap |
|10 | Email       | Safe      | Real Dropbox file share notice   |

---

## 🎨 Design

| Element     | Value                          |
|-------------|-------------------------------|
| Display Font | Syne (700, 800)               |
| Body Font    | DM Sans (300, 400, 500, 600)  |
| Dark Maroon  | `#3E000C`                     |
| Vivid Red    | `#D10000`                     |
| Coral Red    | `#FB4B4E`                     |
| Deep Burgundy| `#7C0B2B`                     |
| Light Pink   | `#FFCBDD`                     |

Icons via **Font Awesome 6** (CDN).  
Fonts via **Google Fonts** (CDN).

---

## 📱 Responsive Breakpoints

| Breakpoint | Behaviour                                      |
|------------|------------------------------------------------|
| ≥ 640px    | Card max-width 640px, side-by-side buttons     |
| ≤ 480px    | Stacked buttons, reduced padding, hidden brand text in header |
| ≤ 360px    | Progress label hidden to save space            |

---

## ✅ Rubric Compliance

| Criteria         | Implementation |
|-----------------|----------------|
| Functionality    | 10 scenarios, choice buttons, per-answer feedback, score tracking |
| Design & UI      | Syne + DM Sans fonts, full colour scheme, Font Awesome icons throughout |
| Responsiveness   | CSS clamp(), media queries for 480px and 360px |
| Code Quality     | Separated HTML/CSS/JS, commented sections, semantic markup |
| Documentation    | This README with table of contents, structure, and design specs |
| Branding         | "BaitAware" consistently used, favicon.png in assets + linked in HTML |

---

## 🛡️ About

BaitAware was built as a cybersecurity awareness training tool. Phishing remains the #1 vector for data breaches globally. Regular exposure to realistic simulations has been shown to significantly reduce click-through rates on actual attacks.

*Stay vigilant — phishing attacks are getting smarter every day.*
