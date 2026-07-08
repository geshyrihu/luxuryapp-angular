import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import type { MegaMenuItem } from "primeng/api";
import { MegaMenuBase } from "./mega-menu.base";

@Component({ selector: "test-mega-menu", template: "" })
class TestMegaMenu extends MegaMenuBase {
  run(item: MegaMenuItem, event?: Event) {
    this.runCommand(item, event);
  }
}

describe("MegaMenuBase", () => {
  function make() {
    TestBed.configureTestingModule({ imports: [TestMegaMenu] });
    const f = TestBed.createComponent(TestMegaMenu);
    f.componentRef.setInput("items", [] as MegaMenuItem[]);
    return f;
  }

  it("defaults orientation horizontal", () => {
    expect(make().componentInstance.orientation()).toBe("horizontal");
  });

  it("runCommand invokes item.command", () => {
    const c = make().componentInstance;
    const cmd = vi.fn();
    c.run({ label: "x", command: cmd });
    expect(cmd).toHaveBeenCalledOnce();
  });
});
