import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { BreadcrumbsBase } from "../core/breadcrumbs.base";

@Component({ selector: "test-breadcrumbs", template: "" })
class Host extends BreadcrumbsBase {}

describe("BreadcrumbsBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
