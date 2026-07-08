import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { BreadcrumbsBase } from "./breadcrumbs.base";

@Component({ selector: "test-breadcrumbs", standalone: true, template: "" })
class Host extends BreadcrumbsBase {}

describe("BreadcrumbsBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
