import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { CardModule } from "primeng/card";
import { TagModule } from "primeng/tag";
import { BadgeModule } from "primeng/badge";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";

@Component({
  selector: "app-web-badges",
  imports: [
    CommonModule,
    CardModule,
    TagModule,
    BadgeModule,
    ButtonModule,
    DividerModule,
  ],
  template: `
    <p-card header="Tags & Badges">
      <div class="flex flex-column gap-3">
        <div>
          <span class="font-bold text-sm block mb-2">PrimeNG Tags</span>
          <div class="flex flex-wrap gap-2">
            <p-tag value="Primary" severity="info"></p-tag>
            <p-tag value="Success" severity="success"></p-tag>
            <p-tag value="Warning" severity="warn"></p-tag>
            <p-tag value="Danger" severity="danger"></p-tag>
            <p-tag value="Secondary" severity="secondary"></p-tag>
            <p-tag value="Contrast" severity="contrast"></p-tag>
            <p-tag value="Rounded" [rounded]="true" severity="info"></p-tag>
          </div>
        </div>
        <p-divider></p-divider>
        <div>
          <span class="font-bold text-sm block mb-2">PrimeNG Badges</span>
          <div class="flex flex-wrap gap-3 align-items-center">
            <p-badge value="2"></p-badge>
            <p-badge value="8" severity="success"></p-badge>
            <p-badge value="4" severity="warn"></p-badge>
            <p-badge value="12" severity="danger"></p-badge>
            <p-badge severity="info"></p-badge>
            <p-button label="Inbox" badge="5" badgeSeverity="danger"></p-button>
          </div>
        </div>
      </div>
    </p-card>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class WebBadges {}
