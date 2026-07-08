import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import type { MenuItem } from "primeng/api";
import { DockBase } from "./dock.base";

@Component({ selector: "test-dock", template: "" })
class TestDock extends DockBase {
  run(item: MenuItem) {
    this.runCommand(item);
  }
}

describe("DockBase", () => {
  function make() {
    TestBed.configureTestingModule({ imports: [TestDock] });
    return TestBed.createComponent(TestDock);
  }

  it("defaults position bottom", () => {
    expect(make().componentInstance.position()).toBe("bottom");
  });

  it("runCommand calls item.command when present", () => {
    const c = make().componentInstance;
    const cmd = vi.fn();
    const clickSpy = vi.fn();
    c.itemClick.subscribe(clickSpy);
    c.run({ label: "a", command: cmd });
    expect(cmd).toHaveBeenCalledOnce();
    expect(clickSpy).not.toHaveBeenCalled();
  });

  it("runCommand emits itemClick when no command", () => {
    const c = make().componentInstance;
    const clickSpy = vi.fn();
    c.itemClick.subscribe(clickSpy);
    c.run({ label: "b" });
    expect(clickSpy).toHaveBeenCalledOnce();
  });
});
