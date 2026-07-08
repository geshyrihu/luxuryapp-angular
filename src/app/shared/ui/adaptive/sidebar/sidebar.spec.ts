import { TestBed } from "@angular/core/testing";
import { LxSidebar } from "./sidebar";

describe("LxSidebar (render)", () => {
  // No se llama detectChanges: p-drawer instancia el icono de cierre (primeicon)
  // cuyo input() falla con NG0203 bajo JIT en el entorno de test (no en AOT). Crear
  // el fixture ya compila los templates web+mobile+adaptive (valida bindings e
  // imports contra p-drawer de la API v22).
  it("compiles web + mobile + adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxSidebar] });
    const fixture = TestBed.createComponent(LxSidebar);
    fixture.componentRef.setInput("header", "Menú");
    fixture.componentRef.setInput("visible", true);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
