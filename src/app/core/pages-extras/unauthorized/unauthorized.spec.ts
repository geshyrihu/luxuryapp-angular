import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Unauthorized } from './unauthorized';
import { vi } from 'vitest';

describe('Unauthorized', () => {
  let component: Unauthorized;
  let fixture: ComponentFixture<Unauthorized>;

  beforeEach(() => {
    TestBed.overrideComponent(Unauthorized, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [Unauthorized],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(Unauthorized);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
