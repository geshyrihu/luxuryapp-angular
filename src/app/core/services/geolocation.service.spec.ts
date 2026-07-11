import { TestBed } from "@angular/core/testing";
import { GeolocationService } from "./geolocation.service";

describe("GeolocationService", () => {
  let service: GeolocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeolocationService],
    });
    service = TestBed.inject(GeolocationService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("getCurrentPosition should resolve coords on success", async () => {
    spyOn(navigator.geolocation, "getCurrentPosition").and.callFake(
      (success) => {
        success({
          coords: {
            latitude: 19.4326,
            longitude: -99.1332,
            accuracy: 10,
          },
        } as GeolocationPosition);
      },
    );

    const result = await service.getCurrentPosition();

    expect(result).toEqual({
      latitude: 19.4326,
      longitude: -99.1332,
      accuracy: 10,
    });
  });

  it("getCurrentPosition should resolve null on error (permiso negado / timeout)", async () => {
    spyOn(navigator.geolocation, "getCurrentPosition").and.callFake(
      (_success, error) => {
        error?.({
          code: 1,
          message: "User denied Geolocation",
        } as GeolocationPositionError);
      },
    );

    const result = await service.getCurrentPosition();

    expect(result).toBeNull();
  });
});
