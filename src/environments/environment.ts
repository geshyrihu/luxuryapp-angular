// const urlApi = `https://x3z6jr1n-7069.usw3.devtunnels.ms/`;
// const urlApi = `https://luxurybuildingapp.com/`;
// const urlApi = `https://luxurybuildingapp.com/test/`;
// const urlApi = `http://luxurybuildingapp.com:8060/`;
// En desarrollo local preferimos HTTP en 7070 para evitar fallos de TLS/certificado
// con fetch y extensiones del navegador sobre localhost.
const urlApi = `http://localhost:7070/`;

export const environment = {
  production: false,

  API_BASE_URL: urlApi + "api/",
  API_DOMONIO: urlApi,
  HANGFIRE_DASHBOARD_URL: urlApi + "api/hangfire/",
  API_BASE_SIGNALR: urlApi + "ws/notificationHub",
  API_FIREBIRD_URL: "http://localhost:5212/api/",
  // OneSignal — Desarrollo
  // App ID separado para dev (no contamina producción)
  ONESIGNAL_APPID: "3d1f1ce3-638f-4a30-b093-ab617baf91a8",
  ONESIGNAL_SAFARI_WEB_ID: "web.onesignal.auto.0b3c1e09-f01e-4f75-a6ff-3f857f927766",
  ONESIGNAL_ALLOWED_ORIGINS: ["http://localhost:4200"],

  // Firebase

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
