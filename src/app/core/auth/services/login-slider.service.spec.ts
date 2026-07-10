import { TestBed } from '@angular/core/testing';
import { LoginSliderService } from './login-slider.service';

describe('LoginSliderService', () => {
  let service: LoginSliderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoginSliderService],
    });
    service = TestBed.inject(LoginSliderService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
