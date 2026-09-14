import { TestBed } from '@angular/core/testing';
import { ApiResponseService } from 'src/app/core/http/services/api-response.service';
import { EmployeeInternalService } from './employee-internal.service';

describe('EmployeeInternalService', () => {
  let service: EmployeeInternalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EmployeeInternalService,
        { provide: ApiResponseService, useValue: { onGetList: vi.fn().mockResolvedValue([]), onGetItem: vi.fn().mockResolvedValue({}), onPost: vi.fn().mockResolvedValue({ id: '1' }), onPut: vi.fn().mockResolvedValue({}), onDelete: vi.fn().mockResolvedValue(true), onGetSelectItem: vi.fn().mockResolvedValue([]), onGetListNotLoading: vi.fn().mockResolvedValue([]) } },
      ],
    });
    service = TestBed.inject(EmployeeInternalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getList with correct params', async () => {
    const api = TestBed.inject(ApiResponseService);
    await service.getList('1', true);
    expect(api.onGetList).toHaveBeenCalled();
  });
});
