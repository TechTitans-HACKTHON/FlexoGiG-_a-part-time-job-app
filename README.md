# FlexoGig - Student & Young Adult Gig Platform

FlexoGig is a specialized part-time job portal designed for students (16+) and young adults to find high-quality local gigs. The platform prioritizes high-pay hourly work, flexible scheduling, and verified safety via Aadhaar registration.

## Features
- **Modern LinkedIn-style UI**: Professional blue and white aesthetic.
- **Pre-populated Gig Feed**: 10+ categories including Cafe Barista, Library Assistant, Home Tutor, and more.
- **Smart Fallback Content**: If no jobs match a user's specific interests, the platform automatically suggests all available gigs to ensure the user always has opportunities.
- **₹ (INR) Currency Support**: Localized pay scales for the Indian market.
- **Aadhaar Verification**: Secure registration requiring a 12-digit Aadhaar ID.
- **Google Maps Integration**: Direct links to workplace locations for easy navigation.
- **Persistent Storage**: Uses `localStorage` to save user profiles and job applications without a backend.

## Prerequisites
No special software is required. This is a pure frontend application.
- A modern web browser (Chrome, Firefox, Safari, or Edge).

## Installation
1. Clone the project or download the files.
2. Ensure the directory structure is as follows:
    /flexogig
      - index.html
      - css/style.css
      - js/main.js

## Configuration
No environment variables are needed. The application runs entirely in-browser.

## How to Run
1. Double-click the `index.html` file to open it in your default browser.
2. Alternatively, use a "Live Server" extension (like vscode-live-server) to run it on `http://127.0.0.1:5500`.

## Typical Workflow
1. **Registration**: Go to "Sign Up", enter your details (Age must be 16+), and select your interests.
2. **Login**: Use your phone number and password to login.
3. **Explore**: Browse the "Find Gigs" tab. Notice that jobs matching your interests appear first.
4. **Apply**: Click "Quick Apply". Your application is saved to your profile.
5. **Manage**: Check the "Applications" tab to see everything you've applied for.
6. **Maps**: Click "View Location Map" on any job card to see where the work is.

## Troubleshooting
- **Missing Data?** If you restart your browser and the data is gone, ensure you are not in Incognito/Private mode, which clears `localStorage`.
- **Validation Error?** Ensure the Aadhaar number entered is exactly 12 digits.
- **Job Feed Empty?** This shouldn't happen due to the "Smart Fallback" logic, but if it does, try clearing your browser cache and refreshing.

## Developer Notes
- **Local Storage Keys**: `flexogig_users`, `flexogig_applications`.
- **Session Keys**: `flexogig_session`.
- **Styling**: Built with CSS Variables for easy rebranding of colors from the `:root` pseudo-class.
