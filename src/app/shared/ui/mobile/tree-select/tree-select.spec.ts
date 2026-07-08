import { TestBed } from "@angular/core/testing";
import { MobileTreeSelect } from "./tree-select";

describe("MobileTreeSelect (mobile)", () => {
  it("compiles and mounts", () => {
    TestBed.configureTestingModule({ imports: [MobileTreeSelect] });
    expect(TestBed.createComponent(MobileTreeSelect).componentInstance).toBeTruthy();
  });
});
