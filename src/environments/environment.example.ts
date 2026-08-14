// Example environment configuration - NEVER commit actual API keys or secrets to git
// Copy this file to environment.ts and replace placeholders with actual values
// Store sensitive values in .env.local (which is gitignored) and load them at build time

// Development API endpoint
const urlApi = `http://localhost:7070/`;

export const environment = {
  production: false,

  API_BASE_URL: urlApi + "api/",
  API_DOMONIO: urlApi,
  HANGFIRE_DASHBOARD_URL: urlApi + "api/hangfire/",
  API_BASE_SIGNALR: urlApi + "ws/notificationHub",
  API_FIREBIRD_URL: "http://localhost:5212/api/",

  // ⚠️ IMPORTANT: Use environment variables for these values
  // Load from process.env or import.meta.env at runtime
  ONESIGNAL_APPID: "YOUR_ONESIGNAL_APP_ID_HERE",
  // Lista solo los orígenes que coincidan con el Site URL configurado en el dashboard de
  // OneSignal. Si el dashboard tiene la restricción de origen activada, agregar un origen
  // distinto (p. ej. http://localhost:4200) hace que init() lance
  // "Can only be used on: <site-url>". Para desarrollo local usar una app OneSignal aparte.
  ONESIGNAL_ALLOWED_ORIGINS: ["https://luxurybuildingapp.com"],

  // Firebase configuration
  // Load from environment variables, NOT hardcoded
  firebase: {
    projectId: "YOUR_FIREBASE_PROJECT_ID",
    appId: "YOUR_FIREBASE_APP_ID",
    storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
    apiKey: "YOUR_FIREBASE_API_KEY", // ⚠️ This can be public but should be in .env
    authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
    messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
    measurementId: "YOUR_FIREBASE_MEASUREMENT_ID",
  },
};
