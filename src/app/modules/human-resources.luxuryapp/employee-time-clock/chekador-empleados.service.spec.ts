import { TestBed } from '@angular/core/testing';
import { ApiResponseService } from '@core/http/services/api-response.service';
import { ChekadorEmpleadosService } from './chekador-empleados.service';

describe('ChekadorEmpleadosService', () => {
  let service: ChekadorEmpleadosService;

  const mockApiResponseService = {
    onGetList: vi.fn(),
    onGetItem: vi.fn(),
    onPut: vi.fn(),
    onPost: vi.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ChekadorEmpleadosService,
        { provide: ApiResponseService, useValue: mockApiResponseService },
      ],
    });

    service = TestBed.inject(ChekadorEmpleadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call resumenHoy and return item', async () => {
    const mockResult = { total: 10 };
    mockApiResponseService.onGetItem.mockResolvedValue(mockResult);

    const result = await service.resumenHoy();

    expect(mockApiResponseService.onGetItem).toHaveBeenCalled();
    expect(result).toEqual(mockResult);
  });

  it('should call getSedes and return list', async () => {
    const mockResult = [{ id: '1', name: 'Sede 1' }];
    mockApiResponseService.onGetList.mockResolvedValue(mockResult);

    const result = await service.getSedes();

    expect(mockApiResponseService.onGetList).toHaveBeenCalled();
    expect(result).toEqual(mockResult);
  });
});

