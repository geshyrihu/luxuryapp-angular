import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Dialog } from './dialog';
import { vi } from 'vitest';

vi.mock('primeng/dialog', () => ({ DialogModule: class {} }));

describe('Dialog', () => {
  let component: Dialog;
  let fixture: ComponentFixture<Dialog>;

  beforeEach(() => {
    TestBed.overrideComponent(Dialog, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [Dialog],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(Dialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dismiss and emit', () => {
    const fn = vi.fn();
    component.dismiss.subscribe(fn);
    component.onDismiss();
    expect(component.visible()).toBe(false);
    expect(fn).toHaveBeenCalled();
  });
});
