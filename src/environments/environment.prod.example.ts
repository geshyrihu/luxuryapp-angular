// Example production environment configuration - NEVER commit actual API keys or secrets to git
// Copy this file to environment.prod.ts and replace placeholders with actual values
// Store sensitive values in CI/CD secrets (GitHub Actions, etc.) and inject at build time

export const environment = {
  production: true,

  // Production API endpoints
  API_BASE_URL: "https://luxurybuildingapp.com/api/",
  API_DOMONIO: "https://luxurybuildingapp.com",
  API_BASE_SIGNALR: "https://luxurybuildingapp.com/ws/notificationHub",
  HANGFIRE_DASHBOARD_URL: "/api/hangfire/",
  API_FIREBIRD_URL: "https://YOUR_PRODUCTION_FIREBIRD_URL/api/",

  // ⚠️ IMPORTANT: Use environment variables injected at build/deploy time
  // Example (using Webpack define plugin or environment variable substitution):
  // ONESIGNAL_APPID: process.env['ONESIGNAL_APPID'],
  ONESIGNAL_APPID: "YOUR_ONESIGNAL_APP_ID_HERE",
  ONESIGNAL_ALLOWED_ORIGINS: ["https://luxurybuildingapp.com"],

  // Firebase configuration
  // Store these values in CI/CD secrets and inject during build
  firebase: {
    projectId: "YOUR_FIREBASE_PROJECT_ID",
    appId: "YOUR_FIREBASE_APP_ID",
    storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
    apiKey: "YOUR_FIREBASE_API_KEY", // ⚠️ This is semi-public but must still be from secrets
    authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
    messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
    measurementId: "YOUR_FIREBASE_MEASUREMENT_ID",
  },
};
