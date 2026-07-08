import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomInputToggleSwitch } from './custom-input-toggle-switch-signal';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CustomInputToggleSwitch', () => {
  let component: CustomInputToggleSwitch;
  let fixture: ComponentFixture<CustomInputToggleSwitch>;

  beforeEach(() => {
    TestBed.overrideComponent(CustomInputToggleSwitch, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [CustomInputToggleSwitch, NoopAnimationsModule],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(CustomInputToggleSwitch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
