import { TestBed } from "@angular/core/testing";
import { LxContextMenu } from "./context-menu";

describe("LxContextMenu (render)", () => {
  it("compiles web + mobile branches and renders", () => {
    TestBed.configureTestingModule({ imports: [LxContextMenu] });
    const fixture = TestBed.createComponent(LxContextMenu);
    fixture.componentRef.setInput("items", [
      { label: "Copiar", icon: "material-symbols-light:content-copy" },
      { label: "Eliminar", icon: "material-symbols-light:delete" },
    ]);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
