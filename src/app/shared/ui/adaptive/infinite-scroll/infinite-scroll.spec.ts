import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LxInfiniteScroll } from './infinite-scroll';
import { PlatformService } from 'src/app/core/services/platform.service';

describe('LxInfiniteScroll', () => {
  let component: LxInfiniteScroll;
  let fixture: ComponentFixture<LxInfiniteScroll>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LxInfiniteScroll],
      providers: [{ provide: PlatformService, useValue: { isMobile: () => false } }],
    }).compileComponents();

    fixture = TestBed.createComponent(LxInfiniteScroll);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
