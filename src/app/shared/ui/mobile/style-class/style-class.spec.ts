import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MobileStyleClass } from './style-class';

describe('MobileStyleClass', () => {
  let component: MobileStyleClass;
  let fixture: ComponentFixture<MobileStyleClass>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileStyleClass],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileStyleClass);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
