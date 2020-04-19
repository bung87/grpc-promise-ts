import { Client, MethodDefinition } from "grpc";

import { promisfyUnaryRpc } from "./unary";

enum RpcType {
  UNARY,
  READABLE_STREAM,
  WRITEABLE_STREAM,
  DUPLEX_STREAM,
}

/**
 * Takes a gRPC Client and converts the RPCs to a promise api.
 * This function will not modify the RPC passed in, but any 
 * methods called on the promise client that aren't RPCs
 * (ex: `promiseClient.close()`) will be forwareded to the original
 * client.
 */
const convertToPromiseClient = function <
  TClient extends Client,
  TPromiseClient extends Client
>(client: TClient): TPromiseClient {
  const result = Object.create(client);
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
              rpcType = RpcType.DUPLEX_STREAM;
              break;
            case false:
              rpcType = RpcType.WRITEABLE_STREAM;
              break;
          }
          break;
        case false:
          switch (methodDefinition.responseStream) {
            case true:
              rpcType = RpcType.READABLE_STREAM;
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
      }
    }
  );
  return result;
};

export default convertToPromiseClient;
