import { TestBed } from "@angular/core/testing";
import { throwError } from "rxjs";
import { DataConnectorService } from "../../services/data-connector.service";
import { LoaderService } from "../../services/loader.service";
import { ConsoleLoggerService } from "../../services/console-logger.service";
import { CustomToastService } from "../../services/custom-toast.service";
import { ApiResponseService } from "./api-response.service";
import { GlobalErrorService } from "./global-error.service";

describe("ApiResponseService", () => {
  let service: ApiResponseService;
  let dataConnector: {
    post: ReturnType<typeof vi.fn>;
    put: ReturnType<typeof vi.fn>;
  };
  let toast: {
    showSuccess: ReturnType<typeof vi.fn>;
    showError: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    dataConnector = { post: vi.fn(), put: vi.fn() };
    toast = { showSuccess: vi.fn(), showError: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        ApiResponseService,
        { provide: CustomToastService, useValue: toast },
        {
          provide: ConsoleLoggerService,
          useValue: { custom: vi.fn(), error: vi.fn() },
        },
        { provide: GlobalErrorService, useValue: { setGlobalError: vi.fn() } },
        {
          provide: DataConnectorService,
          useValue: {
            get: vi.fn(),
            ...dataConnector,
            patch: vi.fn(),
            delete: vi.fn(),
            postFile: vi.fn(),
            getFile: vi.fn(),
            getFileFromFullUrl: vi.fn(),
          },
        },
        { provide: LoaderService, useValue: { show: vi.fn(), hide: vi.fn() } },
      ],
    });
    service = TestBed.inject(ApiResponseService);
  });

  it("should create", () => {
    expect(service).toBeTruthy();
  });

  it("exposes the original POST error and preserves the server message", async () => {
    const error = {
      status: 413,
      statusText: "Payload Too Large",
      error: { title: "Las imágenes exceden el límite permitido." },
    };
    const onRequestError = vi.fn();
    dataConnector.post.mockReturnValue(throwError(() => error));

    await expect(
      service.onPost("tasks/create", new FormData(), onRequestError),
    ).resolves.toBe(false);

    expect(onRequestError).toHaveBeenCalledWith(error);
    expect(toast.showError).toHaveBeenCalledWith(
      "Error",
      "Las imágenes exceden el límite permitido.",
    );
  });

  it("shows a connection message for status zero failures", async () => {
    const error = { status: 0, statusText: "Unknown Error" };
    dataConnector.put.mockReturnValue(throwError(() => error));

    await service.onPut("tasks/update/id", new FormData());

    expect(toast.showError).toHaveBeenCalledWith(
      "Error",
      "No se pudo conectar con el servidor. Revisa la conexión o vuelve a intentar.",
    );
  });
});
