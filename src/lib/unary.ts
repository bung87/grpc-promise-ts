import grpc, { MethodDefinition } from "grpc";

export interface TUnaryResult<TResponse> extends Promise<TResponse> {
  // this promise will reject with a grpc.ServiceError
  getUnaryCall: () => grpc.ClientUnaryCall;
}

export type TUnaryRpc<TRequest, TResponse> = (
  request: TRequest,
  metadata?: grpc.Metadata,
  options?: Partial<grpc.CallOptions>
) => TUnaryResult<TResponse>;

export const promisfyUnaryRpc = <TRequest, TResponse>(
  rpc: MethodDefinition<TRequest, TResponse> & Function,
  client: grpc.Client
): TUnaryRpc<TRequest, TResponse> => {
  const originalRpc = rpc;
  return <TRequest, TResponse>(
    request: TRequest,
    metadata: grpc.Metadata = new grpc.Metadata(),
    options: Partial<grpc.CallOptions> = {}
  ) => {
    let unaryCall: grpc.ClientUnaryCall;
    const result: Partial<TUnaryResult<TResponse>> = new Promise<TResponse>(
      (resolve, reject) => {
        unaryCall = originalRpc.call(
          client,
          request,
          metadata,
          options,
          (e, r) => {
            if (e) {
              reject(e);
              return;
            }
            resolve(r);
          }
        );
      }
    );

    result.getUnaryCall = () => unaryCall;
    return result as TUnaryResult<TResponse>;
  };
};
