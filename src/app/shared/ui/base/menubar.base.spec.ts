import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import type { MenuItem } from "primeng/api";
import { MenubarBase } from "./menubar.base";

@Component({ selector: "test-menubar", standalone: true, template: "" })
class TestMenubar extends MenubarBase {
  run(item: MenuItem, event?: Event) {
    this.runCommand(item, event);
  }
}

describe("MenubarBase", () => {
  function make() {
    TestBed.configureTestingModule({ imports: [TestMenubar] });
    return TestBed.createComponent(TestMenubar);
  }

  it("defaults orientation horizontal, no active item", () => {
    const c = make().componentInstance;
    expect(c.orientation()).toBe("horizontal");
    expect(c.activeItem()).toBeNull();
  });

  it("runCommand invokes item.command", () => {
    const c = make().componentInstance;
    const cmd = vi.fn();
    c.run({ label: "x", command: cmd });
    expect(cmd).toHaveBeenCalledOnce();
  });
});
