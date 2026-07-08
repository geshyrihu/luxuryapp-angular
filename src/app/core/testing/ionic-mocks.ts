import { Component, Directive } from "@angular/core";

function mockComponent(selector: string) {
  return Component({ selector, template: "" })(class {}) as any;
}

function mockDirective(selector: string) {
  return Directive({ selector, standalone: true })(class {}) as any;
}

export const IonicMocks = {
  addIcons: () => {},
  ToastController: class {},

  IonAccordion: mockComponent("ion-accordion"),
  IonAccordionGroup: mockComponent("ion-accordion-group"),
  IonAvatar: mockComponent("ion-avatar"),
  IonBadge: mockComponent("ion-badge"),
  IonButton: mockComponent("ion-button"),
  IonCard: mockComponent("ion-card"),
  IonCardContent: mockComponent("ion-card-content"),
  IonCardHeader: mockComponent("ion-card-header"),
  IonCheckbox: mockComponent("ion-checkbox"),
  IonChip: mockComponent("ion-chip"),
  IonCol: mockComponent("ion-col"),
  IonContent: mockComponent("ion-content"),
  IonFab: mockComponent("ion-fab"),
  IonFabButton: mockComponent("ion-fab-button"),
  IonGrid: mockComponent("ion-grid"),
  IonHeader: mockComponent("ion-header"),
  IonIcon: mockComponent("ion-icon"),
  IonInfiniteScroll: mockComponent("ion-infinite-scroll"),
  IonInfiniteScrollContent: mockComponent("ion-infinite-scroll-content"),
  IonInput: mockDirective("ion-input"),
  IonItem: mockComponent("ion-item"),
  IonItemDivider: mockComponent("ion-item-divider"),
  IonLabel: mockComponent("ion-label"),
  IonList: mockComponent("ion-list"),
  IonNote: mockComponent("ion-note"),
  IonPopover: mockComponent("ion-popover"),
  IonProgressBar: mockComponent("ion-progress-bar"),
  IonRow: mockComponent("ion-row"),
  IonSearchbar: mockComponent("ion-searchbar"),
  IonSelect: mockComponent("ion-select"),
  IonSelectOption: mockComponent("ion-select-option"),
  IonSpinner: mockComponent("ion-spinner"),
  IonText: mockComponent("ion-text"),
  IonTextarea: mockDirective("ion-textarea"),
  IonTitle: mockComponent("ion-title"),
  IonToggle: mockComponent("ion-toggle"),
  IonToolbar: mockComponent("ion-toolbar"),
};
