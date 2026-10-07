# 🧩 Inputs adaptativos y "bridges" de compatibilidad

> Guía fácil para entender **por qué** existen archivos como
> `custom-input-date-signal.ts` o `custom-input-check-signal.ts`
> y cómo funcionan los inputs **adaptativos**.

---

## 🤔 El problema en una frase

La app corre en **web (Bootstrap)** y en **móvil (Ionic)**.
Un mismo formulario debe verse bien en los dos… pero **sin reescribir 188 formularios** cada vez.

---

## 🏗️ Las 3 capas

```
┌──────────────────────────────────────────────────────────────┐
│  📝 FORMULARIO (lo que usa el dev)                            │
│     <custom-input-date-signal [control]="miForm.controls.x"/> │
└───────────────────────────────┬──────────────────────────────┘
                                │ importa desde @ui/inputs/web
                                ▼
┌──────────────────────────────────────────────────────────────┐
│  🌉 BRIDGE / COMPATIBILIDAD  (carpeta inputs/web/)            │
│     custom-input-date-signal.ts  =  6 líneas de re-export     │
│     export { InputDate as CustomInputDateSignal } from …      │
└───────────────────────────────┬──────────────────────────────┘
                                │ re-exporta la clase real
                                ▼
┌──────────────────────────────────────────────────────────────┐
│  🔀 ADAPTATIVO  (carpeta inputs/adaptive/)                    │
│     Elige en tiempo real según la plataforma:                 │
│       if (platform.isMobile())  → Ionic   (móvil)             │
│       else                      → Bootstrap (web)             │
└───────────────┬───────────────────────────────┬──────────────┘
                │                               │
                ▼                               ▼
      ┌──────────────────┐            ┌──────────────────┐
      │ 📱 mobile/        │            │ 💻 web/           │
      │ <ion-input-date>  │            │ <web-input-date>  │
      │ (Ionic)           │            │ (Bootstrap)       │
      └──────────────────┘            └──────────────────┘
```

---

## 🌉 ¿Qué es un "bridge"?

Un **bridge** es un archivo **puente** que no tiene lógica propia.
Solo **renombra** una clase nueva con el **nombre viejo** para no romper nada.

Ejemplo real completo (`custom-input-date-signal.ts`):

```ts
// Bridge de compatibilidad.
// El input de fecha ahora es ADAPTATIVO (web Bootstrap ↔ Ionic según plataforma).
// La implementación vive en @ui/inputs/adaptive/input-date. Este re-export
// mantiene la ruta/clase histórica (`CustomInputDateSignal`) para que los formularios
// que la importan se vuelvan adaptativos sin cambios.
export { InputDate as CustomInputDateSignal } from "../adaptive/input-date/input-date";
```

Y `custom-input-check-signal.ts`:

```ts
// ⚠️ Bridge de compatibilidad — checkbox ahora ADAPTATIVO (web ↔ Ionic).
// Implementación en @ui/inputs/adaptive/input-check.
export { InputCheck as CustomInputCheckSignal } from "../adaptive/input-check/input-check";
```

### 🧠 Léelo así

| Antes                          | Ahora                                             |
| ------------------------------ | ------------------------------------------------- |
| `CustomInputDateSignal` = web  | `CustomInputDateSignal` = **web o móvil** 🤖      |
| Ruta: `inputs/web/...`         | Ruta sigue igual (compatibilidad)                 |
| Implementación en el mismo archivo | Implementación movida a `inputs/adaptive/...` |

> 🔑 **La razón de existir:** el formulario NO cambia su `import`,
> pero por dentro ahora es adaptativo. **Cero refactors.**

---

## 🔀 ¿Cómo decide web vs móvil? (`PlatformService`)

El adaptativo inyecta `PlatformService` y pregunta `isMobile()`:

```ts
// platform.service.ts (resumen)
readonly isMobile = signal(this._check());

private _check(): boolean {
  // hybrid  = Capacitor/Cordova → móvil nativo siempre
  // width < 768 = pantalla chica (breakpoint md)
  return this.ionicPlatform.is("hybrid") || window.innerWidth < 768;
}
```

- 📐 **Reactivo:** escucha `window.resize` y actualiza la señal.
- 🏷️ Además pone la clase `is-mobile` / `is-web` en `<body>`.

Ejemplo de plantilla adaptativa (`input-text.ts`):

```html
@if (platform.isMobile()) {
  <ion-input-text … />   <!-- 📱 Ionic -->
} @else {
  <web-input-text … />   <!-- 💻 Bootstrap -->
}
```

Ambos comparten **la misma API** porque heredan de `BaseInputSignal`
(`control`, `label`, `placeholder`, `required`, …). Por eso el formulario
no nota la diferencia.

---

## 🗺️ Mapa de la carpeta `inputs/`

```
inputs/
├── core/
│   └── base-input-signal.ts      🧱 Base común (label, errores, CVA, signals)
├── adaptive/                     🔀 Puntos de entrada adaptativos
│   ├── input-date/input-date.ts
│   ├── input-text/input-text.ts
│   └── … (26 tipos)
├── web/                          💻 Bootstrap + 🌉 bridges
│   ├── custom-input-date-signal.ts   🌉 bridge (6 líneas)
│   ├── custom-input-check-signal.ts  🌉 bridge
│   ├── custom-input-decimal-signal.ts   ⚙️ implementación real (Bootstrap)
│   ├── input-date/input-date.ts         ⚙️ impl. web real
│   └── index.ts                         📦 barrel (punto de import)
└── mobile/                       📱 Ionic
    ├── ion-input-date.ts
    └── ion-input-checkbox.ts
```

---

## ✅ Lista de bridges actuales (14)

Estos archivos ya son **solo puentes** (re-export a `adaptive/`):

| 🧩 Archivo en `web/`                        | Re-exporta clase | Implementación en `adaptive/` |
| ------------------------------------------- | ---------------- | ----------------------------- |
| `custom-input-check-signal.ts`              | `InputCheck`     | `input-check`                 |
| `custom-input-currency-signal.ts`           | `InputCurrency`  | `input-currency`              |
| `custom-input-date-signal.ts`               | `InputDate`      | `input-date`                  |
| `custom-input-file-signal.ts`               | `InputFile`      | `input-file`                  |
| `custom-input-multiselect-signal.ts`        | `InputMultiselect` | `input-multiselect`         |
| `custom-input-number-signal.ts`             | `InputNumber`    | `input-number`                |
| `custom-input-password-signal.ts`           | `InputPassword`  | `input-password`              |
| `custom-input-select-bool-signal.ts`        | `InputSelectBool`| `input-select-bool`           |
| `custom-input-select-signal.ts`             | `InputSelect`    | `input-select`                |
| `custom-input-text-signal.ts`               | `InputText`      | `input-text`                  |
| `custom-input-textarea-signal.ts`           | `InputTextarea`  | `input-textarea`              |
| `custom-input-time-signal.ts`               | `InputTime`      | `input-time`                  |
| `custom-input-toggle-switch-signal.ts`      | `InputToggleSwitch` | `input-toggle-switch`      |
| `custom-search-input-signal.ts`             | `InputSearch`    | `input-search`                |

---

## ⚙️ Todavía NO son bridges (16 implementaciones reales)

Siguen viviendo en `web/` como componentes Bootstrap:

```
custom-input-autocomplete-multiple-signal.ts
custom-input-autocomplete-signal.ts
custom-input-datepicker-signal.ts
custom-input-date-time-native.ts
custom-input-date-time-signal.ts
custom-input-decimal-signal.ts
custom-input-email-signal.ts
custom-input-hour-signal.ts
custom-input-img-signal.ts
custom-input-mask-signal.ts
custom-input-month-signal.ts
custom-input-phone-prefix.ts
custom-input-select-button-signal.ts
custom-input-switch-signal.ts
custom-input-upload-pdf-signal.ts
custom-input-url-signal.ts
```

➡️ Cuando terminen de migrar, cada uno se convertirá en un bridge de 3-6 líneas igual que los de arriba.

---

## 🎯 ¿Por qué NO borrar los archivos viejos y punto?

Porque los usan **~188 formularios**. Borrarlos obligaría a tocar todos los imports.

**El bridge es la jugada inteligente:**

```
❌ SIN bridge:
   188 formularios → cambiar import → cambiar nombre de clase → cambiar tests
   (riesgo alto, diff enorme, errores fáciles)

✅ CON bridge:
   Solo el archivo-puente cambia.
   Los 188 formularios: INTACTOS y ahora adaptativos. 🎉
```

---

## ❓ Preguntas rápidas

**¿Puedo importar desde `adaptive/` directo?**
Sí, pero no lo hagas: la ruta oficial es `@ui/inputs/web` (barrel `index.ts`).
Así el día que cambie la implementación, nadie se entera.

**¿El bridge tiene lógica o estilos?**
No. Es solo `export { Nuevo as Viejo }`. Si tiene código real, **no** es bridge.

**¿Cómo sé si un archivo es bridge?**
Si empieza con `// Bridge de compatibilidad` y termina en
`export { X as Y } from "../adaptive/…"` → es bridge. 🌉

**¿Afecta al rendimiento?**
No. Es un re-export en tiempo de compilación, se resuelve al construir.

---

## 🧾 Resumen en 3 líneas

1. 🌉 **Bridge** = archivo-puente que mantiene el nombre viejo apuntando a la nueva implementación.
2. 🔀 **Adaptativo** = componente que elige Bootstrap (web) o Ionic (móvil) según `PlatformService.isMobile()`.
3. 🎯 **Razón** = migrar a inputs adaptativos **sin tocar los ~188 formularios**.
