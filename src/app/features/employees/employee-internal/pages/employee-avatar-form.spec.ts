import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { vi } from 'vitest';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { EmployeeAvatarForm } from './employee-avatar-form';

describe('EmployeeAvatarForm', () => {
  let fixture: ComponentFixture<EmployeeAvatarForm>;
  let component: EmployeeAvatarForm;

  const mockApiResponseS = {
    onGetItem: vi.fn().mockResolvedValue({ photoPath: 'img.jpg' }),
    onPut: vi.fn().mockResolvedValue({ photoPath: 'new-img.jpg' }),
  };

  beforeEach(() => {
    TestBed.overrideComponent(EmployeeAvatarForm, {
      set: { template: '<div>Mock</div>', imports: [] },
    });

    TestBed.configureTestingModule({
      imports: [EmployeeAvatarForm],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ApiResponseService, useValue: mockApiResponseS },
      ],
    });

    vi.clearAllMocks();
    fixture = TestBed.createComponent(EmployeeAvatarForm);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default signal values', () => {
    expect(component.photoPath()).toBe('');
    expect(component.imgUpload()).toBeNull();
    expect(component.imgTemp()).toBeNull();
  });

  it('should load photo on init when applicationUserId is provided', () => {
    fixture.componentRef.setInput('applicationUserId', 'user-1');
    fixture.detectChanges();
    expect(mockApiResponseS.onGetItem).toHaveBeenCalled();
  });

  it('should upload image on uploadImg', () => {
    component.imgUpload.set(new File([''], 'test.png'));
    component.uploadImg();
    expect(mockApiResponseS.onPut).toHaveBeenCalled();
  });
});
