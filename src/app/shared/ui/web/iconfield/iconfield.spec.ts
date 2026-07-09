import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AppIconField } from "./iconfield";

describe("AppIconField", () => {
  let component: AppIconField;
  let fixture: ComponentFixture<AppIconField>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [AppIconField] });
    fixture = TestBed.createComponent(AppIconField);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
