import { RESPONSE_PREFIX, THROW_INVALID_ARGUMENT } from "./lib/testHandler";
import { Server, credentials } from "grpc";
import { TestClient, TestPromiseClient } from "./lib/test_grpc_pb";

import { EventEmitter } from "events";
import { TestRequest } from "./lib/test_pb";
import getPort from "get-port";
import promisifyAll from "../promisifyAll";
import { startServer } from "./lib/server";

describe("Unary Client", () => {
  let server: Server;
  let client: TestPromiseClient;

  beforeAll(() => {
    return getPort().then((PORT) => {
      return startServer(PORT)
        .then((s) => {
          server = s;
          client = (new TestClient(
            `localhost:${PORT}`,
            credentials.createInsecure()
          ) as unknown) as TestPromiseClient;
          promisifyAll(client);
          return new Promise((resolve, reject) => {
            client.waitForReady(Date.now() + 10000, (e) => {
              if (e) {
                reject(e);
              }
              resolve();
            });
          });
        })
        .catch((e) => {
          console.error(
            `${Date.now()}: Test server/client failed to startup: ${e}`
          );
          throw e;
        });
    });
  });

  afterAll(() => {
    client.close();
    server.forceShutdown();
  });

  it("should return a TUnaryResult", async () => {
    const request = new TestRequest();
    request.setRequestString("this_is_a_test");

    const unaryResult = client.getUnary(request);

    expect(unaryResult).toBeInstanceOf(Promise);

    const unaryCall = unaryResult.getUnaryCall();
    expect(unaryCall).toBeInstanceOf(EventEmitter); // prototype not set to `ClientUnaryCall` so just use `EventEmitter`;
    expect(unaryCall.cancel).toBeInstanceOf(Function);
    expect(unaryCall.getPeer).toBeInstanceOf(Function);

    const response = await unaryResult;

    expect(response.getResponseString()).toEqual(
      RESPONSE_PREFIX + "this_is_a_test"
    );
  });

  it("should reject on RPC error", async () => {
    const request = new TestRequest();
    request.setRequestString(THROW_INVALID_ARGUMENT);

    return expect(client.getUnary(request)).rejects.toThrow(
      "3 INVALID_ARGUMENT"
    );
  });
});
