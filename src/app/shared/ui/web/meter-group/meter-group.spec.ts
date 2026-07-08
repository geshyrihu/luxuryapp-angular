import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppMeterGroup } from './meter-group';

describe('AppMeterGroup', () => {
  let component: AppMeterGroup;
  let fixture: ComponentFixture<AppMeterGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppMeterGroup],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppMeterGroup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
