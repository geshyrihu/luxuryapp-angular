import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { InfiniteScrollBase } from "./infinite-scroll.base";

@Component({ selector: "test-infinite-scroll", template: "" })
class Host extends InfiniteScrollBase {}

describe("InfiniteScrollBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
