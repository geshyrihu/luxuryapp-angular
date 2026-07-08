import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppPipelineCrm } from './pipeline-crm';

describe('AppPipelineCrm', () => {
  let component: AppPipelineCrm;
  let fixture: ComponentFixture<AppPipelineCrm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppPipelineCrm],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppPipelineCrm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
