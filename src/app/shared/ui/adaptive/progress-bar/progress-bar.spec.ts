import { TestBed } from "@angular/core/testing";
import { LxProgressBar } from "./progress-bar";

describe("LxProgressBar (render)", () => {
  it("renders the platform-selected progress bar", () => {
    TestBed.configureTestingModule({ imports: [LxProgressBar] });
    const fixture = TestBed.createComponent(LxProgressBar);
    fixture.componentRef.setInput("value", 75);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
