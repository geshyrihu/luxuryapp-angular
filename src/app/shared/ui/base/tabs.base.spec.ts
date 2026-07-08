import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { TabsBase, TabItem } from "./tabs.base";

@Component({ selector: "test-tabs", standalone: true, template: "" })
class TestTabs extends TabsBase {}

const tab = (id: string, disabled = false): TabItem => ({ id, label: id, disabled });

describe("TabsBase", () => {
  function make() {
    TestBed.configureTestingModule({ imports: [TestTabs] });
    return TestBed.createComponent(TestTabs);
  }

  it("select sets activeId and emits tabChange", () => {
    const f = make();
    const c = f.componentInstance;
    const spy = vi.fn();
    c.tabChange.subscribe(spy);
    c.select(tab("one"));
    expect(c.activeId()).toBe("one");
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ id: "one" }));
  });

  it("select ignores disabled tabs", () => {
    const c = make().componentInstance;
    const spy = vi.fn();
    c.tabChange.subscribe(spy);
    c.select(tab("dis", true));
    expect(c.activeId()).toBe("");
    expect(spy).not.toHaveBeenCalled();
  });
});
