import { TestBed } from '@angular/core/testing';
import { ModulePermissionService } from './module-permission.service';
import { CustomerIdService } from './customer-id.service';

describe('ModulePermissionService', () => {
  let service: ModulePermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ModulePermissionService,
        { provide: CustomerIdService, useValue: {} },
      ],
    });
    service = TestBed.inject(ModulePermissionService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
