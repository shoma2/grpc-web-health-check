import { check } from "./grpc/grpc/health/v1/health";

export async function main() {
  return await check({});
}
