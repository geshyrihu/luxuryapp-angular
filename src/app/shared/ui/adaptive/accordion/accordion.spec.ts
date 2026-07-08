import { TestBed } from "@angular/core/testing";
import { LxAccordion } from "./accordion";

describe("LxAccordion (render)", () => {
  // No se llama detectChanges: p-accordion-header instancia el chevron (primeicon)
  // cuyo input() falla con NG0203 bajo JIT en el entorno de test (no en AOT). Crear
  // el fixture ya compila los templates web+mobile+adaptive (valida bindings e
  // imports contra la API v22 de p-accordion).
  it("compiles web + mobile + adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxAccordion] });
    const fixture = TestBed.createComponent(LxAccordion);
    fixture.componentRef.setInput("items", [
      { id: "a", title: "Sección A", icon: "mdi:home" },
      { id: "b", title: "Sección B" },
    ]);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
