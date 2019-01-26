import * as healthPBWeb from "../../../../../grpc/generated/grpc/health/v1/health_pb";
import * as healthPBNode from "../../../../../grpc/generated/grpc/health/v1/health";

async function healthClientWeb() {
  if (process.browser) {
    return (await import("./serviceClients/web")).health;
  }
}

async function healthClientNode() {
  if (!process.browser) {
    return (await import("./serviceClients/node")).health;
  }
}

export async function check(
  healthCheckRequest: healthPBNode.grpc.health.v1.IHealthCheckRequest
): Promise<healthPBNode.grpc.health.v1.IHealthCheckResponse> {
  return new Promise(async (resolve, reject) => {
    if (process.browser) {
      const healthCheckRequestMessage = new healthPBWeb.HealthCheckRequest();
      healthCheckRequestMessage.setService(healthCheckRequest.service);
      (await healthClientWeb()).check(
        healthCheckRequestMessage,
        {},
        (err, response) => {
          if (err) {
            reject(err);
            return;
          }
          resolve({
            status: response.getStatus()
          });
        }
      );
    } else {
      (await healthClientNode()).check(healthCheckRequest, (err, response) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(response);
      });
    }
  });
}
