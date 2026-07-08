import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { TimelineBase } from "./timeline.base";

@Component({ selector: "test-timeline", template: "" })
class Host extends TimelineBase {}

describe("TimelineBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
