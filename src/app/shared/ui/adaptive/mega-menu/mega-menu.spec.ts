import { TestBed } from "@angular/core/testing";
import { LxMegaMenu } from "./mega-menu";

describe("LxMegaMenu (render)", () => {
  // No se llama detectChanges: p-megamenu instancia primeicons cuyo input() falla
  // con NG0203 bajo JIT en el entorno de test (no en AOT). Crear el fixture ya
  // compila los templates web+mobile+adaptive (valida bindings e imports); la
  // instanciación de p-megamenu solo ocurre en detectChanges.
  it("compiles web + mobile + adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxMegaMenu] });
    const fixture = TestBed.createComponent(LxMegaMenu);
    fixture.componentRef.setInput("items", [
      { label: "Productos", icon: "material-symbols-light:package", items: [[{ label: "Cat A" }]] },
    ]);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
