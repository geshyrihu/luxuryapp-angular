// src/types/onesignal.d.ts

declare global {
  interface Window {
    OneSignal?: OneSignalSDK;
  }
}

interface OneSignalSDK {
  init(options: { appId: string; [key: string]: any }): Promise<void>;
  login(externalUserId: string): Promise<void>;
  logout(): Promise<void>;
  User: {
    PushSubscription: {
      id?: string;
      optedIn: boolean;
    };
  };
  Notifications: {
    addEventListener(event: string, handler: (event: any) => void): void;
  };
}

export {};











