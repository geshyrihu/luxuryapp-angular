import { TestBed } from "@angular/core/testing";
import { LeadScoring } from "../../primitives/lead-scoring/lead-scoring";

describe("LeadScoring", () => {
  it("compiles and mounts", () => {
    TestBed.configureTestingModule({ imports: [LeadScoring] });
    expect(TestBed.createComponent(LeadScoring).componentInstance).toBeTruthy();
  });
});
