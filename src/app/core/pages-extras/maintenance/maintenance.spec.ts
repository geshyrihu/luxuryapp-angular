import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Maintenance } from './maintenance';
import { vi } from 'vitest';

describe('maintenance', () => {
  let component: Maintenance;
  let fixture: ComponentFixture<Maintenance>;

  beforeEach(() => {
    TestBed.overrideComponent(Maintenance, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [Maintenance],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(Maintenance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
