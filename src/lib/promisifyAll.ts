import grpc from "grpc";
import { promisfyUnaryRpc } from "./unary";

enum RpcType {
  UNARY,
  READABLE_STREAM,
  WRITEABLE_STREAM,
  DUPLEX_STREAM,
}
const promisifyAll = function <
  TClient extends grpc.Client,
  TPromiseClient extends grpc.Client
>(client: TClient): TPromiseClient {
  Object.keys(Object.getPrototypeOf(client)).forEach(
    <TRequest, TResponse>(methodName) => {
      const methodDefinition: grpc.MethodDefinition<TRequest, TResponse> &
        Function = client[methodName];
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
          client[methodName] = promisfyUnaryRpc(methodDefinition, client);
          break;
      }
    }
  );
  return (client as unknown) as TPromiseClient;
};

export default promisifyAll;
