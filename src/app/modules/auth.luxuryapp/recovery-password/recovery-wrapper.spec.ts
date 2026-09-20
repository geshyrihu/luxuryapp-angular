import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RecoveryWrapper } from './recovery-wrapper';
import { PlatformService } from '@core/services/platform.service';

describe('RecoveryWrapper', () => {
  function setup(isMobile: boolean) {
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
        { provide: PlatformService, useValue: { isMobile: signal(isMobile) } },
      ],
    });

    const fixture = TestBed.createComponent(RecoveryWrapper);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('should create on desktop', () => {
    expect(setup(false)).toBeTruthy();
  });

  it('should create on mobile', () => {
    expect(setup(true)).toBeTruthy();
  });
});
