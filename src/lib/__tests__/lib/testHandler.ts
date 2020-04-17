import * as grpc from "grpc";

import { ITestServer, TestService } from "./proto/test_grpc_pb";
import { TestRequest, TestResponse } from "./proto/test_pb";

import { ServiceError } from "grpc";

export const THROW_INVALID_ARGUMENT = "THROW_INVALID_ARGUMENT";
export const RESPONSE_PREFIX = "RESPONSE_";

class TestHandler implements ITestServer {
  /**
   * Return the string provided in the request
   * back with the response prefix
   */
  getUnary = (
    call: grpc.ServerUnaryCall<TestRequest>,
    callback: grpc.sendUnaryData<TestResponse>
  ): void => {
    const testString = call.request.getRequestString();
    if (testString === THROW_INVALID_ARGUMENT) {
      const error: ServiceError = {
        name: "api_error",
        message: "Invalid Argument",
        code: grpc.status.INVALID_ARGUMENT,
      };
      callback(error, null);
      return;
    }

    const response: TestResponse = new TestResponse();

    response.setResponseString(`${RESPONSE_PREFIX}${testString}`);

    callback(null, response);
  };
}

export default {
  service: TestService, // Service interface
  handler: new TestHandler(), // Service interface definitions
};
