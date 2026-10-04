import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { StatusBadgeBase } from "../core/status-badge.base";

@Component({ selector: "test-status-badge", template: "" })
class Host extends StatusBadgeBase {}

describe("StatusBadgeBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
