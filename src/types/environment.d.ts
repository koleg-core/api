declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      KOLEG_CONFIG_PATH?: string;
    }
  }
}

export {};
