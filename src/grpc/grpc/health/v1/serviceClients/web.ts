import { HealthClient } from "../../../../../../grpc/generated/grpc/health/v1/healthServiceClientPb";

const hostname = `http${process.__GRPC_INSECURE__ ? "" : "s"}://${
  process.__GRPC_SERVER_ADDRESS__
}`;

export const health = new HealthClient(hostname, null, null);
