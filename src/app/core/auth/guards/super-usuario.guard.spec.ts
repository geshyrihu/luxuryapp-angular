import { TestBed } from '@angular/core/testing';
import { superUsuarioGuard } from './super-usuario.guard';
import { AspRoleService } from '../services/asp-role.service';
import { Router } from '@angular/router';

describe('superUsuarioGuard', () => {
  const executeGuard = (...guardParameters: Parameters<typeof superUsuarioGuard>) =>
    TestBed.runInInjectionContext(() => superUsuarioGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AspRoleService, useValue: { hasRole: vi.fn() } },
        { provide: Router, useValue: { navigate: vi.fn() } },
      ],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
