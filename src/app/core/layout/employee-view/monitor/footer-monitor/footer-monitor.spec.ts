import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FooterMonitor } from './footer-monitor';
import { vi } from 'vitest';

describe('FooterMonitor', () => {
  let component: FooterMonitor;
  let fixture: ComponentFixture<FooterMonitor>;

  beforeEach(() => {
    TestBed.overrideComponent(FooterMonitor, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [FooterMonitor],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(FooterMonitor);
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
