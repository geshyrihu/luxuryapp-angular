import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { AccordionBase } from "./accordion.base";

@Component({ selector: "test-accordion", template: "" })
class TestAccordion extends AccordionBase {}

describe("AccordionBase", () => {
  function make() {
    TestBed.configureTestingModule({ imports: [TestAccordion] });
    return TestBed.createComponent(TestAccordion);
  }

  it("single mode: toggling one collapses others", () => {
    const f = make();
    const c = f.componentInstance;
    c.toggle("a");
    expect(c.expandedIds()).toEqual(["a"]);
    c.toggle("b");
    expect(c.expandedIds()).toEqual(["b"]);
  });

  it("single mode: toggling the open one closes it", () => {
    const c = make().componentInstance;
    c.toggle("a");
    c.toggle("a");
    expect(c.expandedIds()).toEqual([]);
  });

  it("multiple mode: accumulates and removes ids", () => {
    const f = make();
    f.componentRef.setInput("multiple", true);
    const c = f.componentInstance;
    c.toggle("a");
    c.toggle("b");
    expect(c.expandedIds()).toEqual(["a", "b"]);
    c.toggle("a");
    expect(c.expandedIds()).toEqual(["b"]);
  });
});
