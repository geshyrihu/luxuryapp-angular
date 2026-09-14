import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FooterCommitteedesktop } from './footer';
import { vi } from 'vitest';

describe('FooterCommitteedesktop', () => {
  let component: FooterCommitteedesktop;
  let fixture: ComponentFixture<FooterCommitteedesktop>;

  beforeEach(() => {
    TestBed.overrideComponent(FooterCommitteedesktop, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [FooterCommitteedesktop],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(FooterCommitteedesktop);
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
