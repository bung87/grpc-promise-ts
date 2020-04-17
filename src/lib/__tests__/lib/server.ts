import * as grpc from "grpc";

import testHandler from "./testHandler";

const buildServer = (): grpc.Server => {
  const server: grpc.Server = new grpc.Server();

  [testHandler].forEach(({ service, handler }) =>
    server.addService(service, handler)
  );
  return server;
};

export const startServer = async (
  port: number,
  host: string = "0.0.0.0",
  credentials?: grpc.ServerCredentials
): Promise<grpc.Server> => {
  if (!credentials) {
    console.warn("⚠️⚠️⚠️ Using insecure credentials ⚠️⚠️⚠️");
    credentials = grpc.ServerCredentials.createInsecure();
  }
  const server = buildServer();
  return new Promise<grpc.Server>((resolve, reject) => {
    server.bindAsync(
      `${host}:${port}`,
      credentials as grpc.ServerCredentials,
      (e: Error | null, _port: number) => {
        if (e != null) {
          reject(e);
        } else {
          resolve(server);
        }
      }
    );
    server.start();
  });
};

export default buildServer;
