import { TestBed } from "@angular/core/testing";
import { LxMenubar } from "./menubar";

describe("LxMenubar (render)", () => {
  // No se llama detectChanges: p-menubar instancia primeicons (BarsIcon del toggle
  // móvil) cuyo input() falla con NG0203 bajo JIT en el entorno de test (no en AOT).
  // Crear el fixture ya compila los templates web+mobile+adaptive (valida bindings
  // e imports); la instanciación de p-menubar solo ocurre en detectChanges.
  it("compiles web + mobile + adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxMenubar] });
    const fixture = TestBed.createComponent(LxMenubar);
    fixture.componentRef.setInput("items", [
      { label: "Archivo", icon: "mdi:file", items: [{ label: "Nuevo" }] },
      { label: "Editar", icon: "mdi:pencil" },
    ]);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
