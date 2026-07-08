import { Component } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AppAnimateOnScroll } from "./animate-on-scroll";

@Component({
  template: `<div appAnimateOnScroll></div>`,
  imports: [AppAnimateOnScroll],
})
class TestHostComponent {}

describe("AppAnimateOnScroll", () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
