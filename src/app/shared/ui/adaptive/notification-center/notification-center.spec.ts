import { TestBed } from "@angular/core/testing";
import { LxNotificationCenter } from "./notification-center";

describe("LxNotificationCenter (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxNotificationCenter] });
    expect(TestBed.createComponent(LxNotificationCenter).componentInstance).toBeTruthy();
  });
});
