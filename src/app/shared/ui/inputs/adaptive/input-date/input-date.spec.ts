import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { PlatformService } from '@core/services/platform.service';
import { FlatpickrDefaults } from 'angularx-flatpickr';
import { InputDate } from './input-date';

describe('InputDate', () => {
  let component: InputDate;
  let fixture: ComponentFixture<InputDate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputDate],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: PlatformService, useValue: { isMobile: () => false } }, { provide: FlatpickrDefaults, useClass: FlatpickrDefaults }],
    })
      .overrideComponent(InputDate, {
        set: { template: '<div></div>', imports: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(InputDate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('normalizes manually entered dates on the shared control', async () => {
    const control = new FormControl('31/12/2026');
    fixture.componentRef.setInput('control', control);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(control.value).toBe('2026-12-31');
    expect(control.hasError('invalidDate')).toBe(false);
  });

  it('rejects impossible dates on the shared control', async () => {
    const control = new FormControl('31/02/2026', Validators.required);
    fixture.componentRef.setInput('control', control);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(control.hasError('invalidDate')).toBe(true);
    expect(control.invalid).toBe(true);
  });

  it('preserves range-mode values for caller-defined handling', async () => {
    const control = new FormControl('invalid range');
    fixture.componentRef.setInput('mode', 'range');
    fixture.componentRef.setInput('control', control);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(control.value).toBe('invalid range');
    expect(control.hasError('invalidDate')).toBe(false);
  });
});
