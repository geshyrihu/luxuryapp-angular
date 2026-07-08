import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { OfflineIndicatorBase } from "./offline-indicator.base";

@Component({ selector: "test-offline-indicator", template: "" })
class Host extends OfflineIndicatorBase {}

describe("OfflineIndicatorBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
