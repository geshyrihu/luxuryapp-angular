import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ButtonMobile } from "./button";

describe("ButtonMobile", () => {
  let component: ButtonMobile;
  let fixture: ComponentFixture<ButtonMobile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonMobile],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonMobile);
    component = fixture.componentInstance;
    fixture.componentRef.setInput("kind", "save");
    fixture.detectChanges();
  });

  it("should create with unified mobile API", () => {
    expect(component).toBeTruthy();
  });
});
