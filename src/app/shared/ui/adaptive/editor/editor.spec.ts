import { TestBed } from "@angular/core/testing";
import { LxEditor } from "./editor";

describe("LxEditor (adaptive)", () => {
  it("compiles web+mobile+adaptive templates and mounts", () => {
    TestBed.configureTestingModule({ imports: [LxEditor] });
    expect(TestBed.createComponent(LxEditor).componentInstance).toBeTruthy();
  });
});
