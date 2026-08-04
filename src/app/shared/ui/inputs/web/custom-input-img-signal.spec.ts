import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { CustomInputImg } from "./custom-input-img-signal";
import { FormControl } from "@angular/forms";
import { vi } from "vitest";

describe("CustomInputImg", () => {
  let component: CustomInputImg;
  let fixture: ComponentFixture<CustomInputImg>;

  beforeEach(() => {
    TestBed.overrideComponent(CustomInputImg, {
      set: {
        template: "<div>Mock</div>",
        imports: [],
      },
    });

    TestBed.configureTestingModule({
      imports: [CustomInputImg],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(CustomInputImg);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have default control as FormControl", () => {
    expect(component.control()).toBeInstanceOf(FormControl);
  });

  it("should have default chooseLabel", () => {
    expect(component.chooseLabel()).toBe("Seleccionar imagen");
  });

  it("should have default maxFileSize as 15000000", () => {
    expect(component.maxFileSize()).toBe(15000000);
  });

  it("should have default compressThreshold as 2000000", () => {
    expect(component.compressThreshold()).toBe(2000000);
  });

  it("should have default compressionQuality as 0.75", () => {
    expect(component.compressionQuality()).toBe(0.75);
  });

  it("should have default required as false", () => {
    expect(component.required()).toBe(false);
  });

  it("should have default contentHeight as 160", () => {
    expect(component.contentHeight()).toBe(160);
  });

  it("should have default contentWidth as 240", () => {
    expect(component.contentWidth()).toBe(240);
  });

  it("should have default imgBase64 as empty string", () => {
    expect(component.imgBase64()).toBe("");
  });

  it("should have default hasImageError as false", () => {
    expect(component.hasImageError()).toBe(false);
  });

  describe("computed - hasImage", () => {
    it("should return true when imgBase64 is set", () => {
      component.imgBase64.set("data:image/png;base64,abc");
      expect(component.hasImage()).toBe(true);
    });

    it("should return true when urlImgCurrent is provided and valid", () => {
      fixture.componentRef.setInput(
        "urlImgCurrent",
        "https://example.com/image.jpg",
      );
      fixture.detectChanges();
      expect(component.hasImage()).toBe(true);
    });

    it("should return false when urlImgCurrent is null", () => {
      fixture.componentRef.setInput("urlImgCurrent", "null");
      fixture.detectChanges();
      expect(component.hasImage()).toBeFalsy();
    });

    it("should return false when no image source", () => {
      expect(component.hasImage()).toBeFalsy();
    });
  });

  describe("computed - displayImageSrc", () => {
    it("should return imgBase64 when set", () => {
      component.imgBase64.set("data:image/png;base64,xyz");
      expect(component.displayImageSrc()).toBe("data:image/png;base64,xyz");
    });

    it("should return urlImgCurrent when valid and no base64", () => {
      fixture.componentRef.setInput(
        "urlImgCurrent",
        "https://example.com/img.jpg",
      );
      fixture.detectChanges();
      expect(component.displayImageSrc()).toBe("https://example.com/img.jpg");
    });

    it("should return empty string when urlImgCurrent is null", () => {
      fixture.componentRef.setInput("urlImgCurrent", "null");
      fixture.detectChanges();
      expect(component.displayImageSrc()).toBe("");
    });
  });

  describe("outputs", () => {
    it("should emit fileSelected when file is selected via propagar alias", () => {
      expect(component.propagar).toBe(component.fileSelected);
    });

    it("should emit imageLoaded output", () => {
      const emitSpy = vi.fn();
      component.imageLoaded.subscribe(emitSpy);
      expect(emitSpy).not.toHaveBeenCalled();
    });

    it("should emit uploadError output", () => {
      const emitSpy = vi.fn();
      component.uploadError.subscribe(emitSpy);
      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  describe("onImageError", () => {
    it("should set hasImageError to true", () => {
      component.onImageError();
      expect(component.hasImageError()).toBe(true);
    });
  });

  describe("ngOnChanges", () => {
    it("should reset hasImageError when a valid urlImgCurrent is provided", () => {
      component.hasImageError.set(true);
      fixture.componentRef.setInput(
        "urlImgCurrent",
        "https://example.com/img.jpg",
      );
      fixture.detectChanges();
      expect(component.hasImageError()).toBe(false);
    });
  });
});
