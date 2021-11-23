import {
  CallOptions,
  Client,
  ClientUnaryCall,
  Metadata,
  MethodDefinition,
} from "@grpc/grpc-js";

export interface TUnaryResult<TResponse> extends Promise<TResponse> {
  // this promise will reject with a grpc.ServiceError
  getUnaryCall: () => ClientUnaryCall;
}

export type TUnaryRpc<TRequest, TResponse> = (
  request: TRequest,
  metadata?: Metadata,
  options?: Partial<CallOptions>
) => TUnaryResult<TResponse>;

export const promisfyUnaryRpc = <TRequest, TResponse>(
  rpc: MethodDefinition<TRequest, TResponse> & Function,
  client: Client
): TUnaryRpc<TRequest, TResponse> => {
  const originalRpc = rpc;
  return <TRequest, TResponse>(
    request: TRequest,
    metadata: Metadata = new Metadata(),
    options: Partial<CallOptions> = {}
  ) => {
    let unaryCall: ClientUnaryCall;
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
