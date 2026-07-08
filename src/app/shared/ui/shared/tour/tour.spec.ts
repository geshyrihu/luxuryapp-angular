import { TestBed } from "@angular/core/testing";
import { Tour } from "./tour";

describe("Tour", () => {
  it("compiles and mounts", () => {
    TestBed.configureTestingModule({ imports: [Tour] });
    expect(TestBed.createComponent(Tour).componentInstance).toBeTruthy();
  });
});
