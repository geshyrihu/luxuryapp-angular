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
  ONESIGNAL_APPID: "1d454470-eba5-4d7b-82e8-f91b7bed263b",
  // En desarrollo se usa una app OneSignal aparte (Site URL http://localhost:4200) con
  // su propio APPID, para no contaminar la app de producción (https://luxurybuildingapp.com).
  // Por eso localhost:4200 se agrega a ONESIGNAL_ALLOWED_ORIGINS; si no estuviera,
  // OneSignalService omitiría el init en local y no habría push web en desarrollo.
  ONESIGNAL_ALLOWED_ORIGINS: ["https://luxurybuildingapp.com", "http://localhost:4200"],

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
