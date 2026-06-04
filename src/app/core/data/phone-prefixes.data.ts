export interface PhonePrefix {
  flag: string;
  name: string;
  dialCode: string;
}

export const PHONE_PREFIXES: PhonePrefix[] = [
  { flag: "🇲🇽", name: "México", dialCode: "+52" },
  { flag: "🇺🇸", name: "Estados Unidos", dialCode: "+1" },
  { flag: "🇨🇦", name: "Canadá", dialCode: "+1" },
  { flag: "🇦🇷", name: "Argentina", dialCode: "+54" },
  { flag: "🇧🇷", name: "Brasil", dialCode: "+55" },
  { flag: "🇨🇱", name: "Chile", dialCode: "+56" },
  { flag: "🇨🇴", name: "Colombia", dialCode: "+57" },
  { flag: "🇵🇪", name: "Perú", dialCode: "+51" },
  { flag: "🇻🇪", name: "Venezuela", dialCode: "+58" },
  { flag: "🇪🇨", name: "Ecuador", dialCode: "+593" },
  { flag: "🇧🇴", name: "Bolivia", dialCode: "+591" },
  { flag: "🇵🇾", name: "Paraguay", dialCode: "+595" },
  { flag: "🇺🇾", name: "Uruguay", dialCode: "+598" },
  { flag: "🇬🇹", name: "Guatemala", dialCode: "+502" },
  { flag: "🇨🇷", name: "Costa Rica", dialCode: "+506" },
  { flag: "🇵🇦", name: "Panamá", dialCode: "+507" },
  { flag: "🇩🇴", name: "Rep. Dominicana", dialCode: "+1" },
  { flag: "🇨🇺", name: "Cuba", dialCode: "+53" },
  { flag: "🇪🇸", name: "España", dialCode: "+34" },
  { flag: "🇫🇷", name: "Francia", dialCode: "+33" },
  { flag: "🇩🇪", name: "Alemania", dialCode: "+49" },
  { flag: "🇮🇹", name: "Italia", dialCode: "+39" },
  { flag: "🇬🇧", name: "Reino Unido", dialCode: "+44" },
  { flag: "🇵🇹", name: "Portugal", dialCode: "+351" },
  { flag: "🇨🇳", name: "China", dialCode: "+86" },
  { flag: "🇯🇵", name: "Japón", dialCode: "+81" },
  { flag: "🇮🇳", name: "India", dialCode: "+91" },
];
