import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppTreeSelect } from './tree-select';

describe('AppTreeSelect', () => {
  let component: AppTreeSelect;
  let fixture: ComponentFixture<AppTreeSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTreeSelect],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppTreeSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
