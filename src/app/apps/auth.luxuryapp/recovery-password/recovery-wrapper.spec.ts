import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RecoveryWrapper } from './recovery-wrapper';
import { vi } from 'vitest';
import { Platform } from '@angular/cdk/platform';

describe('RecoveryWrapper', () => {
  let component: RecoveryWrapper;
  let fixture: ComponentFixture<RecoveryWrapper>;

  beforeEach(() => {
    TestBed.overrideComponent(RecoveryWrapper, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [RecoveryWrapper],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: Platform, useValue: { ANDROID: false, IOS: false } },
      ],
    });

    fixture = TestBed.createComponent(RecoveryWrapper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have isMobile false on desktop', () => {
    expect(component.isMobile).toBe(false);
  });

  it('should set isMobile true on mobile platform', () => {
    TestBed.resetTestingModule();
    TestBed.overrideComponent(RecoveryWrapper, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });
    TestBed.configureTestingModule({
      imports: [RecoveryWrapper],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: Platform, useValue: { ANDROID: true, IOS: false } },
      ],
    });
    const comp = TestBed.createComponent(RecoveryWrapper).componentInstance;
    comp.ngOnInit();
    expect(comp.isMobile).toBe(true);
  });
});
