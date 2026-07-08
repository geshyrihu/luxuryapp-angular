import { TestBed } from "@angular/core/testing";
import { LxOfflineIndicator } from "./offline-indicator";

describe("LxOfflineIndicator (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxOfflineIndicator] });
    expect(TestBed.createComponent(LxOfflineIndicator).componentInstance).toBeTruthy();
  });
});
