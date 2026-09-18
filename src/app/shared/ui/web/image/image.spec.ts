import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Gallery } from "ng-gallery";
import { Lightbox } from "ng-gallery/lightbox";
import { AppImage } from "./image";

describe("AppImage", () => {
  let fixture: ComponentFixture<AppImage>;
  let gallery: jasmine.SpyObj<Gallery>;
  let lightbox: jasmine.SpyObj<Lightbox>;

  beforeEach(async () => {
    gallery = jasmine.createSpyObj<Gallery>("Gallery", ["ref"]);
    gallery.ref.and.returnValue(jasmine.createSpyObj("GalleryRef", ["load"]));
    lightbox = jasmine.createSpyObj<Lightbox>("Lightbox", ["open"]);

    await TestBed.configureTestingModule({
      imports: [AppImage],
      providers: [
        { provide: Gallery, useValue: gallery },
        { provide: Lightbox, useValue: lightbox },
      ],
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

  it("opens gallery lightbox when preview is enabled", () => {
    fixture.componentRef.setInput("src", "/image.jpg");
    fixture.componentRef.setInput("alt", "Example");
    fixture.componentRef.setInput("preview", true);
    fixture.detectChanges();

    (fixture.nativeElement.querySelector("button") as HTMLButtonElement).click();

    expect(gallery.ref).toHaveBeenCalled();
    expect(lightbox.open).toHaveBeenCalledWith(
      0,
      jasmine.any(String),
      jasmine.objectContaining({
        role: "dialog",
        ariaLabel: "Example",
        keyboardShortcuts: true,
      }),
    );
  });
});
