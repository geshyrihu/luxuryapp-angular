import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Footerdesktop } from './footer-desktop';
import { vi } from 'vitest';

describe('Footerdesktop', () => {
  let component: Footerdesktop;
  let fixture: ComponentFixture<Footerdesktop>;

  beforeEach(() => {
    TestBed.overrideComponent(Footerdesktop, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [Footerdesktop],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(Footerdesktop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have current year', () => {
    expect(component.currentYear).toBe(new Date().getFullYear());
  });
});
