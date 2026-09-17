import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AppImage } from "./image";

describe("AppImage", () => {
  let fixture: ComponentFixture<AppImage>;
  let modal: jasmine.SpyObj<NgbModal>;

  beforeEach(async () => {
    modal = jasmine.createSpyObj<NgbModal>("NgbModal", ["open"]);

    await TestBed.configureTestingModule({
      imports: [AppImage],
      providers: [{ provide: NgbModal, useValue: modal }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppImage);
  });

  it("renders native img and preserves inherited inputs", () => {
    fixture.componentRef.setInput("src", "/image.jpg");
    fixture.componentRef.setInput("alt", "Example");
    fixture.componentRef.setInput("width", 120);
    fixture.componentRef.setInput("height", "50%");
    fixture.componentRef.setInput("imageClass", "thumb");
    fixture.componentRef.setInput("styleClass", "wrapper");
    fixture.componentRef.setInput("imageStyle", { border: "1px solid red" });
    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector("img") as HTMLImageElement;
    expect(image).toBeTruthy();
    expect(image.src).toContain("/image.jpg");
    expect(image.alt).toBe("Example");
    expect(image.className).toContain("thumb");
    expect(image.style.width).toBe("120px");
    expect(image.style.height).toBe("50%");
    expect(fixture.nativeElement.querySelector(".wrapper")).toBeTruthy();
  });

  it("opens NgbModal when preview is enabled", () => {
    fixture.componentRef.setInput("preview", true);
    fixture.detectChanges();

    (fixture.nativeElement.querySelector("button") as HTMLButtonElement).click();

    expect(modal.open).toHaveBeenCalledWith(
      jasmine.anything(),
      jasmine.objectContaining({
        centered: true,
        backdrop: true,
        keyboard: true,
      }),
    );
  });
});
