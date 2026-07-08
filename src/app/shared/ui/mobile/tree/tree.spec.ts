import { TestBed } from "@angular/core/testing";
import { MobileTree } from "./tree";

describe("MobileTree (mobile)", () => {
  it("compiles and mounts", () => {
    TestBed.configureTestingModule({ imports: [MobileTree] });
    expect(TestBed.createComponent(MobileTree).componentInstance).toBeTruthy();
  });
});
