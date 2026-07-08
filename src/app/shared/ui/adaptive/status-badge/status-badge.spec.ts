import { TestBed } from "@angular/core/testing";
import { LxStatusBadge } from "./status-badge";

describe("LxStatusBadge (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxStatusBadge] });
    expect(TestBed.createComponent(LxStatusBadge).componentInstance).toBeTruthy();
  });
});
