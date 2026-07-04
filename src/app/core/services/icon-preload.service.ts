/// Servicio para precargar iconos desde Iconify y registrarlos en el runtime
export function preloadIconifyIcons(): () => Promise<void> {
  const icons = [
    "fluent-color:alert-16",
    "fluent-color:save-16",
    "fluent-color:delete-16",
    "fluent-color:cloud-download-16",
    "fluent-color:document-16",
    "fluent-color:mail-16",
    "fluent-color:add-16",
    "fluent-color:checkmark-16",
    "fluent-color:lock-16",
    "fluent-color:unlock-16",
    "fluent-color:alert-24",
  ];

  return async () => {
    // Esperar a que el web component esté definido (si aplica)
    if (typeof customElements !== "undefined") {
      try {
        await Promise.race([
          customElements.whenDefined("iconify-icon"),
          new Promise((r) => setTimeout(r, 2000)),
        ]);
      } catch (e) {
        // ignore
      }
    }

    await Promise.all(
      icons.map(async (full) => {
        try {
          const url = `https://api.iconify.design/${full}.json`;
          const res = await fetch(url, { cache: "force-cache" });
          if (!res.ok) return;
          const data = await res.json();

          // Registrar con la API global si está disponible
          const Iconify = (window as any).Iconify;
          if (Iconify && typeof Iconify.addIcon === "function") {
            Iconify.addIcon(full, data);
            return;
          }

          // Si no existe API, guardar en ventana para posible registro futuro
          (window as any).__iconify_preloaded =
            (window as any).__iconify_preloaded || [];
          (window as any).__iconify_preloaded.push({ name: full, data });
        } catch (e) {
          // No bloquear la inicialización por fallos en precarga
          // console.debug('Icon preload failed', full, e);
        }
      }),
    );
  };
}
