import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WebButtonIconActiveDesactive } from './button-active-desactive';

describe('WebButtonIconActiveDesactive', () => {
  let component: WebButtonIconActiveDesactive;
  let fixture: ComponentFixture<WebButtonIconActiveDesactive>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebButtonIconActiveDesactive],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WebButtonIconActiveDesactive);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
