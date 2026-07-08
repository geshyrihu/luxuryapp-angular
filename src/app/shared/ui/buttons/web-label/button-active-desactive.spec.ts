import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WebButtonLabelActiveDesactive } from './button-active-desactive';

describe('WebButtonLabelActiveDesactive', () => {
  let component: WebButtonLabelActiveDesactive;
  let fixture: ComponentFixture<WebButtonLabelActiveDesactive>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebButtonLabelActiveDesactive],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WebButtonLabelActiveDesactive);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
