import { TestBed } from "@angular/core/testing";
import { LxDock } from "./dock";

describe("LxDock (render)", () => {
  it("compiles web + mobile branches and renders", () => {
    TestBed.configureTestingModule({ imports: [LxDock] });
    const fixture = TestBed.createComponent(LxDock);
    fixture.componentRef.setInput("items", [
      { label: "Inicio", icon: "mdi:home" },
      { label: "Ajustes", icon: "mdi:cog" },
    ]);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
