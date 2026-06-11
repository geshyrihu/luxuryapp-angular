import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { vi } from 'vitest';
import { PresentacionContable } from './presentacion-contable';

describe('PresentacionContable', () => {
  let component: PresentacionContable;
  let fixture: ComponentFixture<PresentacionContable>;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.overrideComponent(PresentacionContable, {
      set: { template: '<div>Mock</div>', imports: [] },
    });
    TestBed.configureTestingModule({
      imports: [PresentacionContable],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(PresentacionContable);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
