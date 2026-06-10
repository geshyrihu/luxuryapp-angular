import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ViewDireccionMonitor } from './view-direccion-monitor';
import { vi } from 'vitest';

describe('ViewDireccionMonitor', () => {
  let component: ViewDireccionMonitor;
  let fixture: ComponentFixture<ViewDireccionMonitor>;

  beforeEach(() => {
    TestBed.overrideComponent(ViewDireccionMonitor, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [ViewDireccionMonitor],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(ViewDireccionMonitor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
