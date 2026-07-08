import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { RatingBase } from "./rating.base";

@Component({ selector: "test-rating", standalone: true, template: "" })
class Host extends RatingBase {}

describe("RatingBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
