import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewportScroller } from '@angular/common';
import { MobileTapToTop } from './tap-to-top';

describe('MobileTapToTop', () => {
  let component: MobileTapToTop;
  let fixture: ComponentFixture<MobileTapToTop>;
  let viewportScroller: ViewportScroller;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MobileTapToTop],
      providers: [
        {
          provide: ViewportScroller,
          useValue: { scrollToPosition: vi.fn() },
        },
      ],
    });
    fixture = TestBed.createComponent(MobileTapToTop);
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
