import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Comingsoon } from './comingsoon';
import { vi } from 'vitest';

describe('Comingsoon', () => {
  let component: Comingsoon;
  let fixture: ComponentFixture<Comingsoon>;

  beforeEach(() => {
    TestBed.overrideComponent(Comingsoon, {
      set: {
        template: '<div>Mock</div>',
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [Comingsoon],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(Comingsoon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default images array', () => {
    expect(component.images).toEqual([
      './assets/images/bg-1.jpg',
      './assets/images/bg-2.jpg',
      './assets/images/bg-3.jpg',
    ]);
  });

  it('should calculate days correctly', () => {
    const dayInMs = 1000 * 60 * 60 * 24;
    expect(component.getDays(dayInMs * 5)).toBe(5);
    expect(component.getDays(dayInMs * 5 + 1000)).toBe(5);
  });

  it('should calculate hours correctly', () => {
    const hourInMs = 1000 * 60 * 60;
    expect(component.getHours(hourInMs * 3)).toBe(3);
    expect(component.getHours(25 * hourInMs)).toBe(1);
  });

  it('should calculate minutes correctly', () => {
    const minuteInMs = 1000 * 60;
    expect(component.getMinutes(minuteInMs * 15)).toBe(15);
    expect(component.getMinutes(61 * minuteInMs)).toBe(1);
  });

  it('should calculate seconds correctly', () => {
    const secondInMs = 1000;
    expect(component.getSeconds(secondInMs * 30)).toBe(30);
    expect(component.getSeconds(90 * secondInMs)).toBe(30);
  });
});
