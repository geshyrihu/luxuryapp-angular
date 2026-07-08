import { TestBed } from "@angular/core/testing";
import { MobileToast } from "./toast";

describe("MobileToast (mobile)", () => {
  it("compiles and mounts", () => {
    TestBed.configureTestingModule({ imports: [MobileToast] });
    expect(TestBed.createComponent(MobileToast).componentInstance).toBeTruthy();
  });
});
