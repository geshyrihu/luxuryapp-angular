import {
  ChangeDetectionStrategy,
  Component,
  NO_ERRORS_SCHEMA,
} from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

@Component({
  selector: "app-presentacion-contable",
  template: "<div>Mock</div>",
  changeDetection: ChangeDetectionStrategy.Eager,
})
class MockPresentacionContable {}

describe("PresentacionContable", () => {
  let component: MockPresentacionContable;
  let fixture: ComponentFixture<MockPresentacionContable>;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [MockPresentacionContable],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(MockPresentacionContable);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
