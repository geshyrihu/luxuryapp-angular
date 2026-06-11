import { TestBed } from '@angular/core/testing';
import { SearchService } from './search.service';
import { MenuService } from './menu.service';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchService,
        { provide: MenuService, useValue: { sidebarMenuItems: vi.fn() } },
      ],
    });
    service = TestBed.inject(SearchService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
