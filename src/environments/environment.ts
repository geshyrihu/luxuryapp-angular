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
  ONESIGNAL_APPID: "deeb5e28-6ebc-4260-967e-1b64331122fc",
  // NO agregar "http://localhost:4200" aquí. El dashboard de OneSignal tiene activada la
  // restricción de origen (features.restrict_origin) contra https://luxurybuildingapp.com,
  // así que init() lanzaría "Can only be used on: https://luxurybuildingapp.com".
  // Al dejar el origen local fuera de la lista, OneSignalService lo omite antes de init()
  // y solo registra un log informativo. Consecuencia esperada: no hay push web en local.
  // Para probar push en desarrollo, crear una app OneSignal aparte con Site URL
  // http://localhost:4200 y usar su APPID aquí (no reutilizar el de producción).
  ONESIGNAL_ALLOWED_ORIGINS: ["https://luxurybuildingapp.com"],

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
