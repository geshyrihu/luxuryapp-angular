import { TestBed } from "@angular/core/testing";
import { MobileTagInput } from "./tag-input";

describe("MobileTagInput (mobile)", () => {
  it("compiles and mounts", () => {
    TestBed.configureTestingModule({ imports: [MobileTagInput] });
    expect(TestBed.createComponent(MobileTagInput).componentInstance).toBeTruthy();
  });
});
