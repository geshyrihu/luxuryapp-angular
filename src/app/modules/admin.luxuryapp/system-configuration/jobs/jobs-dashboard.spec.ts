import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsDashboard } from './jobs-dashboard';

describe('JobsDashboard', () => {
  let component: JobsDashboard;
  let fixture: ComponentFixture<JobsDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobsDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobsDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
