import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FooterCommitteeMonitor } from './footer-committee-monitor';
import { vi } from 'vitest';

describe('FooterCommitteeMonitor', () => {
  let component: FooterCommitteeMonitor;
  let fixture: ComponentFixture<FooterCommitteeMonitor>;

  beforeEach(() => {
    TestBed.overrideComponent(FooterCommitteeMonitor, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [FooterCommitteeMonitor],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(FooterCommitteeMonitor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set year from today', () => {
    expect(component.today).toBeInstanceOf(Date);
    expect(component.year).toBe(component.today.getFullYear());
  });
});
