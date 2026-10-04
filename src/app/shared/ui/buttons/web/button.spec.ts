import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ButtonWeb } from "./button";

describe("ButtonWeb", () => {
  let component: ButtonWeb;
  let fixture: ComponentFixture<ButtonWeb>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonWeb],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonWeb);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("kind", "add");
    fixture.componentRef.setInput("label", "Nuevo");
    fixture.detectChanges();
  });

  it("should create with unified web API", () => {
    expect(component).toBeTruthy();
  });

  it("supports icon-only mode", () => {
    fixture.componentRef.setInput("displayMode", "icon");
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector("span")).toBeNull();
  });
});
