import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { CarouselModule } from "primeng/carousel";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";
import { interval } from "rxjs";
import { map } from "rxjs/operators";
@Component({
  selector: "app-comingsoon",
  templateUrl: "./comingsoon.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    CarouselModule,
    InputTextModule,
    ButtonModule,
    IconField,
    InputIcon,
  ],
})

/**
 * ComingSoon Component
 */
export class Comingsoon implements OnInit {
  private _trialEndsAt: any;
  images: string[] = [
    "./assets/images/bg-1.jpg",
    "./assets/images/bg-2.jpg",
    "./assets/images/bg-3.jpg",
  ];

  constructor() {}

  private _diff?: any;
  _days?: number;
  _hours?: number;
  _minutes?: number;
  _seconds?: number;

  ngOnInit(): void {
    // Date Set
    this._trialEndsAt = "2023-12-31";

    /**
     * Count date set
     */
    interval(1000)
      .pipe(
        map(() => {
          this._diff =
            Date.parse(this._trialEndsAt) - Date.parse(new Date().toString());
        }),
      )
      .subscribe(() => {
        this._days = this.getDays(this._diff);
        this._hours = this.getHours(this._diff);
        this._minutes = this.getMinutes(this._diff);
        this._seconds = this.getSeconds(this._diff);
      });
  }

  /**
   * Day Set
   */
  getDays(t: number) {
    return Math.floor(t / (1000 * 60 * 60 * 24));
  }

  /**
   * Hours Set
   */
  getHours(t: number) {
    return Math.floor((t / (1000 * 60 * 60)) % 24);
  }

  /**
   * Minutes set
   */
  getMinutes(t: number) {
    return Math.floor((t / 1000 / 60) % 60);
  }

  /**
   * Secound set
   */
  getSeconds(t: number) {
    return Math.floor((t / 1000) % 60);
  }
}
