import type { Preview } from "@storybook/angular-vite";
// Compodoc desactivado temporalmente para arranque rápido de verificación (se revierte).
// import { setCompodocJson } from "@storybook/addon-docs/angular";
// import docJson from "../documentation.json";
// setCompodocJson(docJson);
// TEMP: cargar tokens DS globales en el preview para poder verificar el repintado (se revierte).
import "../src/styles/ds-entry.scss";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
