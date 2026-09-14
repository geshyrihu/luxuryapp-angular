import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ViewDirecciondesktop } from './view-direccion-desktop';
import { vi } from 'vitest';

describe('ViewDirecciondesktop', () => {
  let component: ViewDirecciondesktop;
  let fixture: ComponentFixture<ViewDirecciondesktop>;

  beforeEach(() => {
    TestBed.overrideComponent(ViewDirecciondesktop, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [ViewDirecciondesktop],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(ViewDirecciondesktop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
