import { Component, Directive, Injectable } from "@angular/core";

function mockComponent(selector: string) {
  return Component({ selector, template: "" })(class {}) as any;
}

function mockDirective(selector: string) {
  return Directive({ selector, standalone: true })(class {}) as any;
}

export const IonicMocks = {
  addIcons: () => {},
  ActionSheetController: Injectable({ providedIn: "root" })(class {}) as any,
  AlertController: Injectable({ providedIn: "root" })(class {}) as any,
  LoadingController: Injectable({ providedIn: "root" })(class {}) as any,
  ModalController: Injectable({ providedIn: "root" })(class {}) as any,
  PopoverController: Injectable({ providedIn: "root" })(class {}) as any,
  Platform: Injectable({ providedIn: "root" })(class {
    ready() {
      return Promise.resolve();
    }
    is() {
      return false;
    }
    platforms() {
      return [];
    }
  }) as any,
  ToastController: class {},

  IonAccordion: mockComponent("ion-accordion"),
  IonActionSheet: mockComponent("ion-action-sheet"),
  IonAlert: mockComponent("ion-alert"),
  IonAccordionGroup: mockComponent("ion-accordion-group"),
  IonAvatar: mockComponent("ion-avatar"),
  IonBackButton: mockComponent("ion-back-button"),
  IonBadge: mockComponent("ion-badge"),
  IonButton: mockComponent("ion-button"),
  IonButtons: mockComponent("ion-buttons"),
  IonCard: mockComponent("ion-card"),
  IonCardContent: mockComponent("ion-card-content"),
  IonCardHeader: mockComponent("ion-card-header"),
  IonCheckbox: mockComponent("ion-checkbox"),
  IonChip: mockComponent("ion-chip"),
  IonCol: mockComponent("ion-col"),
  IonContent: mockComponent("ion-content"),
  IonDatetime: mockComponent("ion-datetime"),
  IonDatetimeButton: mockComponent("ion-datetime-button"),
  IonFab: mockComponent("ion-fab"),
  IonFabButton: mockComponent("ion-fab-button"),
  IonFooter: mockComponent("ion-footer"),
  IonGrid: mockComponent("ion-grid"),
  IonHeader: mockComponent("ion-header"),
  IonIcon: mockComponent("ion-icon"),
  IonImg: mockComponent("ion-img"),
  IonInfiniteScroll: mockComponent("ion-infinite-scroll"),
  IonInfiniteScrollContent: mockComponent("ion-infinite-scroll-content"),
  IonInput: mockDirective("ion-input"),
  IonItem: mockComponent("ion-item"),
  IonItemDivider: mockComponent("ion-item-divider"),
  IonItemOption: mockComponent("ion-item-option"),
  IonItemOptions: mockComponent("ion-item-options"),
  IonItemSliding: mockComponent("ion-item-sliding"),
  IonLabel: mockComponent("ion-label"),
  IonList: mockComponent("ion-list"),
  IonListHeader: mockComponent("ion-list-header"),
  IonMenuButton: mockComponent("ion-menu-button"),
  IonModal: mockComponent("ion-modal"),
  IonNote: mockComponent("ion-note"),
  IonPopover: mockComponent("ion-popover"),
  IonProgressBar: mockComponent("ion-progress-bar"),
  IonRadio: mockComponent("ion-radio"),
  IonRadioGroup: mockComponent("ion-radio-group"),
  IonRange: mockComponent("ion-range"),
  IonRefresher: mockComponent("ion-refresher"),
  IonRefresherContent: mockComponent("ion-refresher-content"),
  IonRow: mockComponent("ion-row"),
  IonSearchbar: mockComponent("ion-searchbar"),
  IonSegment: mockComponent("ion-segment"),
  IonSegmentButton: mockComponent("ion-segment-button"),
  IonSelect: mockComponent("ion-select"),
  IonSelectOption: mockComponent("ion-select-option"),
  IonSkeletonText: mockComponent("ion-skeleton-text"),
  IonSpinner: mockComponent("ion-spinner"),
  IonText: mockComponent("ion-text"),
  IonTextarea: mockDirective("ion-textarea"),
  IonThumbnail: mockComponent("ion-thumbnail"),
  IonTitle: mockComponent("ion-title"),
  IonToast: mockComponent("ion-toast"),
  IonToggle: mockComponent("ion-toggle"),
  IonToolbar: mockComponent("ion-toolbar"),
};
