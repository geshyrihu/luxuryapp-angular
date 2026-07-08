import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import type { MenuItem } from "primeng/api";
import { ContextMenuBase } from "./context-menu.base";

@Component({ selector: "test-context-menu", template: "" })
class TestContextMenu extends ContextMenuBase {
  run(item: MenuItem, event?: Event) {
    this.runCommand(item, event);
  }
}

describe("ContextMenuBase", () => {
  function make() {
    TestBed.configureTestingModule({ imports: [TestContextMenu] });
    const f = TestBed.createComponent(TestContextMenu);
    f.componentRef.setInput("items", [] as MenuItem[]);
    return f;
  }

  it("visible defaults false and is a model", () => {
    const c = make().componentInstance;
    expect(c.visible()).toBe(false);
    c.visible.set(true);
    expect(c.visible()).toBe(true);
  });

  it("runCommand invokes item.command", () => {
    const c = make().componentInstance;
    const cmd = vi.fn();
    c.run({ label: "x", command: cmd });
    expect(cmd).toHaveBeenCalledOnce();
  });
});
