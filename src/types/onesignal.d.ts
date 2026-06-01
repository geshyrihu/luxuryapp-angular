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
      optIn(): Promise<void>;
      addEventListener(event: string, handler: (event: any) => void): void;
    };
  };
  Notifications: {
    addEventListener(event: string, handler: (event: any) => void): void;
    requestPermission(): Promise<void>;
    permission: boolean;
  };
}

export {};
