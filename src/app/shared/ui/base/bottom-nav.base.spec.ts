import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { BottomNavBase } from "./bottom-nav.base";

@Component({ selector: "test-bottom-nav", standalone: true, template: "" })
class Host extends BottomNavBase {}

describe("BottomNavBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
