export const environment = {
  production: true,
  // API_BASE_URL: "https://luxury-app.com/api/",
  // API_DOMONIO: "https://luxury-app.com",
  // API_BASE_SIGNALR: "https://luxury-app.com/ws/notificationHub",
  // ONESIGNAL_ALLOWED_ORIGINS: ["https://luxury-app.com"], // Corregida también la doble coma
  // production: true,
  API_BASE_URL: "https://luxurybuildingapp.com/api/",
  API_DOMONIO: "https://luxurybuildingapp.com",
  API_BASE_SIGNALR: "https://luxurybuildingapp.com/ws/notificationHub", // ✅ Nombre corregido
  ONESIGNAL_ALLOWED_ORIGINS: ["https://luxurybuildingapp.com"],
  HANGFIRE_DASHBOARD_URL: "/api/hangfire/",
  API_FIREBIRD_URL: "http://localhost:5212/api/",
  ONESIGNAL_APPID: "deeb5e28-6ebc-4260-967e-1b64331122fc",

  firebase: {
    projectId: "onesignalwebproduction",
    appId: "1:333252186012:web:d950fb0be847a39b580259",
    storageBucket: "onesignalwebproduction.firebasestorage.app",
    apiKey: "AIzaSyADtEWz84WzJ5jISUNI2y5_pKDxOeIlyLo",
    authDomain: "onesignalwebproduction.firebaseapp.com",
    messagingSenderId: "333252186012",
    measurementId: "G-3X95EL36J5",
  },
};
