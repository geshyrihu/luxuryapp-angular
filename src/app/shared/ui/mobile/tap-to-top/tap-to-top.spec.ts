import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewportScroller } from '@angular/common';
import { TapToTop } from './tap-to-top';

describe('TapToTop', () => {
  let component: TapToTop;
  let fixture: ComponentFixture<TapToTop>;
  let viewportScroller: ViewportScroller;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TapToTop],
      providers: [
        {
          provide: ViewportScroller,
          useValue: { scrollToPosition: vi.fn() },
        },
      ],
    });
    fixture = TestBed.createComponent(TapToTop);
    component = fixture.componentInstance;
    viewportScroller = TestBed.inject(ViewportScroller);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show button when scroll position > 600', () => {
    component.show = false;
    Object.defineProperty(window, 'pageYOffset', { value: 700, configurable: true });
    component.onWindowScroll();
    expect(component.show).toBe(true);
  });

  it('should hide button when scroll position <= 600', () => {
    component.show = true;
    Object.defineProperty(window, 'pageYOffset', { value: 300, configurable: true });
    component.onWindowScroll();
    expect(component.show).toBe(false);
  });

  it('should call scrollToPosition on tapToTop', () => {
    component.tapToTop();
    expect(viewportScroller.scrollToPosition).toHaveBeenCalledWith([0, 0]);
  });
});
