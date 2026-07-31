import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { AppSpinner } from "@ui/web/spinner/spinner";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { SanitizeHtmlPipe } from "src/app/shared/pipes/sanitize-html.pipe";
@Component({
  selector: "app-report-meeting",
  templateUrl: "./report-meeting.html",
  styleUrls: ["./report-meeting.component.scss"],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CommonModule, SanitizeHtmlPipe, TableModule, AppSpinner],
})
export class ReportMeeting {
  apiResponseS = inject(ApiResponseService);
  rutaActiva = inject(ActivatedRoute);
  tableScrollHeightS = inject(TableScrollHeightService);
  formattedDate: Date | null = null;
  params = toSignal(this.rutaActiva.params);

  dataSignal = signal<any>(null);
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  meetingId: string = "";
  customerId: string = "";

  // Utilizar signals para info de customer tambión si es necesario, o mantener propiedades si solo se leen
  logoCustomer = signal("");
  nameCustomer = signal("");

  constructor() {
    effect(() => {
      const params = this.params();
      if (params) {
        this.customerId = params["customer"];
        this.meetingId = params["id"];
        this.runLoaders();
      }
    });
  }

  runLoaders() {
    this.loadMeetingData();
    this.onLoadCustomer();
  }

  loadMeetingData() {
    const urlApi = Endpoints.Meetings.reportPdf(this.meetingId);
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      // Parse the date string into a Date object
      if (result && result.minuta && result.minuta.date) {
        // Attempt to parse the date string.
        // It's crucial to ensure the date format is consistent or use a library like moment.js/date-fns for robust parsing.
        // For '20-ene.-26 06:00', a simple new Date() might not work in all browsers/locales.
        // Let's assume for now it's parsable, or it will be fixed on the API side to be ISO format.
        // A safer approach for non-ISO dates would be:
        // const [day, month, year, time] = result.minuta.date.split(/[-. ]/); // This would require specific logic
        // For now, let's try direct parsing as a first step.
        // If this still causes issues, a custom date parsing function might be needed.

        // Example parsing for 'DD-MMM-YY HH:MM' format. This is a very basic attempt and might need refinement.
        // For '20-ene.-26 06:00', this could be problematic.
        // A better approach is to ask the backend to send ISO 8601 dates.
        const dateString = result.minuta.date;
        const [datePart, timePart] = dateString.split(" ");
        const [day, monthAbbr, yearAbbr] = datePart.split("-");

        const monthMap: { [key: string]: number } = {
          ene: 0,
          feb: 1,
          mar: 2,
          abr: 3,
          may: 4,
          jun: 5,
          jul: 6,
          ago: 7,
          sep: 8,
          oct: 9,
          nov: 10,
          dic: 11,
        };
        const monthNum = monthMap[monthAbbr.toLowerCase().replace(".", "")];

        // Adjust year for 2-digit format, assuming 21st century
        const fullYear = parseInt(yearAbbr) + 2000;

        const [hours, minutes] = timePart.split(":");

        if (
          monthNum !== undefined &&
          !isNaN(fullYear) &&
          !isNaN(day) &&
          !isNaN(hours) &&
          !isNaN(minutes)
        ) {
          const parsedDate = new Date(
            fullYear,
            monthNum,
            parseInt(day),
            parseInt(hours),
            parseInt(minutes),
          );
          result.minuta.date = parsedDate;
        } else {
          console.warn("Could not reliably parse date string:", dateString);
          // Fallback or handle error if date parsing fails
          // Maybe keep original string or set to null
          result.minuta.date = dateString; // Keep original string if parsing fails
        }
      }
      this.dataSignal.set(result);
    });
  }

  onLoadCustomer() {
    const urlApi = Endpoints.Customers.getById(this.customerId);
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.nameCustomer.set(result.nameCustomer);
      this.logoCustomer.set(result.photoPath);
    });
  }
}
