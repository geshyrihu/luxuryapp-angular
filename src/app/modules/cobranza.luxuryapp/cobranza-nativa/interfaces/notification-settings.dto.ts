export interface NativeCollectionNotificationSettingsResponseDTO {
  id: string;
  customerId: string;
  isEmailEnabled: boolean;
  isPushNotificationEnabled: boolean;
}

export interface SaveNativeCollectionNotificationSettingsDTO {
  customerId: string;
  isEmailEnabled: boolean;
  isPushNotificationEnabled: boolean;
}
