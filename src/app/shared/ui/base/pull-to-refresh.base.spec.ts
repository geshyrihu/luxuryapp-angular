import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { PullToRefreshBase } from "./pull-to-refresh.base";

@Component({ selector: "test-pull-to-refresh", template: "" })
class Host extends PullToRefreshBase {}

describe("PullToRefreshBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
