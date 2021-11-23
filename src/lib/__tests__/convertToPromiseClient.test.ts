import { RESPONSE_PREFIX, THROW_INVALID_ARGUMENT } from "./lib/testHandler";
import { Server, credentials } from "@grpc/grpc-js";
import { TestClient, TestPromiseClient } from "./lib/proto/test_grpc_pb";
import { TestRequest, TestResponse } from "./lib/proto/test_pb";

import { EventEmitter } from "events";
import convertToPromiseClient from "../convertToPromiseClient";
import getPort from "get-port";
import { startServer } from "./lib/server";

describe("Convert to promise client", () => {
  let server: Server;
  let client: TestClient;
  let promiseClient: TestPromiseClient;
  let port: number;

  beforeAll(() => {
    return getPort().then((PORT) => {
      port = PORT;
      return startServer(PORT)
        .then((s) => {
          server = s;
          client = new TestClient(
            `localhost:${PORT}`,
            credentials.createInsecure()
          );
          promiseClient = convertToPromiseClient(client);
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

  describe("Unary rpc", () => {
    it("should not modify the original client", (done) => {
      const request = new TestRequest();
      request.setRequestString("in");
      const expectedResponse = new TestResponse();
      expectedResponse.setResponseString(RESPONSE_PREFIX + "in");
      const unaryCall = client.unary(request, (error, response) => {
        expect(unaryCall).toBeInstanceOf(EventEmitter); // prototype not set to `ClientUnaryCall`, so just use `EventEmitter`;
        expect(error).toBeNull();
        expect(response.getResponseString()).toEqual(
          expectedResponse.getResponseString()
        );
        done();
      });
    });

    it("should return a TUnaryResult", async () => {
      const request = new TestRequest();
      request.setRequestString("this_is_a_test");

      const unaryResult = promiseClient.unary(request);

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

      return expect(promiseClient.unary(request)).rejects.toThrow(
        "3 INVALID_ARGUMENT"
      );
    });
  });

  describe("Bidirectional rpc", () => {
    it("should pass through calls to the original client", async () => {
      const client = new TestClient(
        `localhost:${port}`,
        credentials.createInsecure()
      );
      await new Promise((resolve) =>
        client.waitForReady(Date.now() + 10000, (_e) => resolve())
      );

      const originalClientMethodMock = jest.fn();
      client.bidirectional = originalClientMethodMock;
      const request = new TestRequest();
      request.setRequestString("_");

      const promiseClient: TestPromiseClient = convertToPromiseClient(client);
      promiseClient.bidirectional();
      expect(originalClientMethodMock).toHaveBeenCalled();
    });
    
    it("should not modify the original client", async () => {
      const client = new TestClient(
        `localhost:${port}`,
        credentials.createInsecure()
        );
        await new Promise((resolve) =>
        client.waitForReady(Date.now() + 10000, (_e) => resolve())
        );
        
        const originalMethod = client.bidirectional;
        const originalSource = client.bidirectional.toString();
        convertToPromiseClient(client);
        expect(client.bidirectional).toEqual(originalMethod);
        expect(client.bidirectional.toString()).toEqual(originalSource);
      });
    });
});
