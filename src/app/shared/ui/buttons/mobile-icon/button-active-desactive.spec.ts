import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileButtonIconActiveDesactive } from './button-active-desactive';

describe('MobileButtonIconActiveDesactive', () => {
  let component: MobileButtonIconActiveDesactive;
  let fixture: ComponentFixture<MobileButtonIconActiveDesactive>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileButtonIconActiveDesactive],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileButtonIconActiveDesactive);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
