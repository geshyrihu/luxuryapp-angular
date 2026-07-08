import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppInplace } from './inplace';

describe('AppInplace', () => {
  let component: AppInplace;
  let fixture: ComponentFixture<AppInplace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppInplace],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppInplace);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
