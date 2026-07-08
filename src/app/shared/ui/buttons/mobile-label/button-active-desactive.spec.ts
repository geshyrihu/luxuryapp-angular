import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MobileButtonLabelActiveDesactive } from './button-active-desactive';

describe('MobileButtonLabelActiveDesactive', () => {
  let component: MobileButtonLabelActiveDesactive;
  let fixture: ComponentFixture<MobileButtonLabelActiveDesactive>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileButtonLabelActiveDesactive],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileButtonLabelActiveDesactive);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
