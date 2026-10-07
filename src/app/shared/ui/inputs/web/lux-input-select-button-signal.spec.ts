import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LuxInputSelectButton } from "./custom-input-select-button-signal";

describe("LuxInputSelectButton", () => {
  let component: LuxInputSelectButton;
  let fixture: ComponentFixture<LuxInputSelectButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LuxInputSelectButton],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LuxInputSelectButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
