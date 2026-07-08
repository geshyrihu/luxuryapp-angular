import { Component } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { LoaderBase } from "./loader.base";

@Component({ selector: "test-loader", standalone: true, template: "" })
class Host extends LoaderBase {}

describe("LoaderBase", () => {
  it("should instantiate", () => {
    TestBed.configureTestingModule({ imports: [Host] });
    expect(TestBed.createComponent(Host).componentInstance).toBeTruthy();
  });
});
