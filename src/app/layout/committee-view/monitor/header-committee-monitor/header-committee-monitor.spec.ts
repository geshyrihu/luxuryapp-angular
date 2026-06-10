import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HeaderCommitteeMonitor } from './header-committee-monitor';
import { vi } from 'vitest';

describe('HeaderCommitteeMonitor', () => {
  let component: HeaderCommitteeMonitor;
  let fixture: ComponentFixture<HeaderCommitteeMonitor>;

  beforeEach(() => {
    TestBed.overrideComponent(HeaderCommitteeMonitor, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [HeaderCommitteeMonitor],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(HeaderCommitteeMonitor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
