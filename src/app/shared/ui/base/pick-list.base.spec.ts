import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { PickListBase } from "./pick-list.base";

@Component({ selector: "test-pick-list", standalone: true, template: "" })
class Host extends PickListBase {}

describe("PickListBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
