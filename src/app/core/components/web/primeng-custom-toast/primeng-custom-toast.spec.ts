import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrimeNgCustomToast } from './primeng-custom-toast';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';

describe('PrimeNgCustomToast', () => {
  let component: PrimeNgCustomToast;
  let fixture: ComponentFixture<PrimeNgCustomToast>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimeNgCustomToast],
      providers: [
        {
          provide: MessageService,
          useValue: {
            messageObserver: new Subject(),
            clearObserver: new Subject(),
            add: vi.fn(),
            clear: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PrimeNgCustomToast);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
