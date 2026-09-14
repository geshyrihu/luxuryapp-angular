import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HeaderCommitteedesktop } from './header';
import { vi } from 'vitest';

describe('HeaderCommitteedesktop', () => {
  let component: HeaderCommitteedesktop;
  let fixture: ComponentFixture<HeaderCommitteedesktop>;

  beforeEach(() => {
    TestBed.overrideComponent(HeaderCommitteedesktop, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [HeaderCommitteedesktop],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(HeaderCommitteedesktop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
