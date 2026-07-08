import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { EmptyStateBase } from "./empty-state.base";

@Component({ selector: "test-empty-state", standalone: true, template: "" })
class Host extends EmptyStateBase {}

describe("EmptyStateBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
