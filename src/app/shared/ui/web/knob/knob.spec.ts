import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppKnob } from './knob';

describe('AppKnob', () => {
  let component: AppKnob;
  let fixture: ComponentFixture<AppKnob>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppKnob],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppKnob);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
