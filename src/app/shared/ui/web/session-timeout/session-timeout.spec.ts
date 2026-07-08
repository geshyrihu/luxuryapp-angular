import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SessionTimeout } from './session-timeout';

describe('SessionTimeout', () => {
  let component: SessionTimeout;
  let fixture: ComponentFixture<SessionTimeout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionTimeout],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionTimeout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
