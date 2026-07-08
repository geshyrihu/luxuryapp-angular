import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomInputSelectButton } from './custom-input-select-button-signal';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CustomInputSelectButton', () => {
  let component: CustomInputSelectButton;
  let fixture: ComponentFixture<CustomInputSelectButton>;

  beforeEach(() => {
    TestBed.overrideComponent(CustomInputSelectButton, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [CustomInputSelectButton, NoopAnimationsModule],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(CustomInputSelectButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
