import grpc from "grpc";
import path from "path";
import protoLoader from "@grpc/proto-loader";

const PROTO_PATH = path.join(
  process.cwd(),
  "proto/grpc/health/v1/health.proto"
);
const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const health = protoDescriptor.grpc.health.v1;

function check(call, callback) {
  callback(null, { status: 1 });
}

function getServer() {
  var server = new grpc.Server();
  server.addService(health.Health.service, {
    check: check
  });
  return server;
}

const routeServer = getServer();
routeServer.bind("0.0.0.0:50052", grpc.ServerCredentials.createInsecure());
routeServer.start();
