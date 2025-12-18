
# Dynamic Portfolio & Resume Website ![Version](https://img.shields.io/badge/version-2.0.0-blue)

A modern, responsive portfolio/resume website that dynamically loads content from a JSON file and is optimized for printing as a professional one-page portrait resume.


## 🚀 Features

- **Dynamic Content**: All portfolio data is managed in `data.json`, making it easy to update without touching the HTML.
- **Responsive Design**: Built with Bootstrap for a seamless experience across desktop and mobile devices.
- **Print Optimization**: Dedicated `print.css` ensures the website prints as a perfectly formatted, two-column portrait resume.
- **Privacy Protection**: Phone number obfuscation (Base64) to prevent simple AI scrapers from extracting contact details from the source code.
- **Layout Balancing**: Custom JavaScript logic to balance column heights and adjust font sizes for optimal fit.

## 🛠️ Project Structure

- `index.html`: The core structure of the portfolio.
- `styles.css`: Main styling for screen viewing, including responsive adjustments.
- `print.css`: Specialized styles for high-quality portrait printing.
- `script.js`: Handles data fetching, rendering, layout optimization, and PDF generation.
- `data.json`: The single source of truth for all portfolio content.

## 💻 How to Run Locally

You can serve the project using any local web server. For example, using Python:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## 📝 Customization

To update the portfolio with your own information:
1. Open `data.json`.
2. Update the fields with your profile, experience, education, skills, and projects.
3. For the phone number, use a Base64 encoder to obfuscate your number for privacy.

## 📄 License

This project is open-source and free to use.

## 🤖 AI-Powered Development
This project is entirely created using code generation tools like Gemini, GitHub Copilot, ChatGPT, Claude, and others on VSCode and Google AntiGravity. 
