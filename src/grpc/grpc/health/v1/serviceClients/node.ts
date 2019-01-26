import * as path from "path";
import * as protoLoader from "@grpc/proto-loader";
import * as grpc from "grpc";
import * as healthPackage from "../../../../../../grpc/generated/grpc/health/v1/health";

const PROTO_PATH = path.join(
  process.cwd(),
  "grpc/proto/grpc/health/v1/health.proto"
);

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const grpcObject: any = protoDescriptor.grpc;

export const health: healthPackage.grpc.health.v1.Health = new grpcObject.health.v1.Health(
  process.__GRPC_SERVER_ADDRESS__,
  process.__GRPC_INSECURE__ ? grpc.credentials.createInsecure() : null,
  null
);
