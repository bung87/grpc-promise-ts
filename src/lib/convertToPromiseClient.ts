import {
  CallOptions,
  Client,
  ClientDuplexStream,
  Metadata,
  MethodDefinition,
} from "@grpc/grpc-js";

import { promisfyUnaryRpc } from "./unary";

enum RpcType {
  UNARY,
  SERVER_STREAMING,
  CLIENT_STREAMING,
  BIDIRECTIONAL,
}

/**
 * Creates a gRPC client which extends the grpc.Client input
 * by changing the RPC implemenations to return a promise instead of using
 * a callback to get the response.
 *
 * This function has no side effects (it doesn't modify the RPC passed in).
 */
const convertToPromiseClient = function <TPromiseClient extends Client>(
  client: Client
): TPromiseClient {
  const result = Object.create(client) as TPromiseClient;
  Object.keys(Object.getPrototypeOf(client)).forEach(
    <TRequest, TResponse>(methodName) => {
      const methodDefinition: MethodDefinition<TRequest, TResponse> & Function =
        client[methodName];
      if (
        methodDefinition.requestStream === undefined &&
        methodDefinition.responseStream === undefined
      ) {
        // actual grpc methods will have both of these populated
        return;
      }

      let rpcType: RpcType;
      switch (methodDefinition.requestStream) {
        case true:
          switch (methodDefinition.responseStream) {
            case true:
              rpcType = RpcType.BIDIRECTIONAL;
              break;
            case false:
              rpcType = RpcType.CLIENT_STREAMING;
              break;
          }
          break;
        case false:
          switch (methodDefinition.responseStream) {
            case true:
              rpcType = RpcType.SERVER_STREAMING;
              break;
            case false:
              rpcType = RpcType.UNARY;
              break;
          }
          break;
        default:
          throw new Error("unreachable");
      }

      switch (rpcType) {
        case RpcType.UNARY:
          result[methodName] = promisfyUnaryRpc(methodDefinition, client);
          break;
        case RpcType.BIDIRECTIONAL:
          result[methodName] = <TRequest, TResponse>(
            metadata: Metadata = new Metadata(),
            options: Partial<CallOptions> = {}
          ): ClientDuplexStream<TRequest, TResponse> =>
            methodDefinition.call(client, metadata, options);
          break;
        default:
          throw new Error("Readable/Writeable streams not yet implememnted");
      }
    }
  );
  return result;
};

export default convertToPromiseClient;
