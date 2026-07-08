import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { SidebarBase } from "./sidebar.base";

@Component({ selector: "test-sidebar", template: "" })
class TestSidebar extends SidebarBase {}

describe("SidebarBase", () => {
  function make() {
    TestBed.configureTestingModule({ imports: [TestSidebar] });
    return TestBed.createComponent(TestSidebar);
  }

  it("defaults: hidden, left, closable", () => {
    const c = make().componentInstance;
    expect(c.visible()).toBe(false);
    expect(c.position()).toBe("left");
    expect(c.closable()).toBe(true);
  });

  it("onHide sets visible false and emits dismiss", () => {
    const f = make();
    f.componentRef.setInput("visible", true);
    const c = f.componentInstance;
    const spy = vi.fn();
    c.dismiss.subscribe(spy);
    c.onHide();
    expect(c.visible()).toBe(false);
    expect(spy).toHaveBeenCalledOnce();
  });
});
