declare namespace NodeJS {
  interface Process {
    __GRPC_SERVER_ADDRESS__: string;
    __GRPC_INSECURE__: boolean;
    browser: boolean;
  }
}
