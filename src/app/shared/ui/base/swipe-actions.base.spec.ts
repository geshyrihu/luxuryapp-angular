import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { SwipeActionsBase } from "./swipe-actions.base";

@Component({ selector: "test-swipe-actions", standalone: true, template: "" })
class Host extends SwipeActionsBase {}

describe("SwipeActionsBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
