import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppBlockUI } from './block-ui';

describe('AppBlockUI', () => {
  let component: AppBlockUI;
  let fixture: ComponentFixture<AppBlockUI>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppBlockUI],
    }).compileComponents();

    fixture = TestBed.createComponent(AppBlockUI);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
