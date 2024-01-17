declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      TOTP_INTERVAL: string;
      PORT: string;
      SESSION_SECRET: string;
    }
  }
}

export {};
