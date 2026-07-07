import { TestBed } from "@angular/core/testing";
import { LxSpinner } from "./spinner";

describe("LxSpinner (render)", () => {
  it("renders the platform-selected spinner", () => {
    TestBed.configureTestingModule({ imports: [LxSpinner] });
    const fixture = TestBed.createComponent(LxSpinner);
    fixture.componentRef.setInput("size", 40);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
