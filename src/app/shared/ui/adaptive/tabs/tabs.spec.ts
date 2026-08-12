import { TestBed } from "@angular/core/testing";
import { LxTabs } from "./tabs";

describe("LxTabs (render)", () => {
  it("compiles web + mobile branches and renders", () => {
    TestBed.configureTestingModule({ imports: [LxTabs] });
    const fixture = TestBed.createComponent(LxTabs);
    fixture.componentRef.setInput("tabs", [
      { id: "t1", label: "Uno", icon: "material-symbols-light:looks-one" },
      { id: "t2", label: "Dos", badge: 3 },
    ]);
    fixture.componentRef.setInput("activeId", "t1");
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
