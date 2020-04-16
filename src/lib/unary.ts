import grpc from "grpc";

export interface TUnaryResult<TResponse> extends Promise<TResponse> {
  clientUnaryCall: grpc.ClientUnaryCall | null;
}

type TUnaryRpc<TRequest, TResponse> = <TRequest, TResponse>(
  request: TRequest,
  metadata?: grpc.Metadata,
  options?: Partial<grpc.CallOptions>
) => TUnaryResult<TResponse>;

export const promisfyUnaryRpc = <TRequest, TResponse>(
  rpc
): TUnaryRpc<TRequest, TResponse> => {
  return <TRequest, TResponse>(
    request: TRequest,
    metadata: grpc.Metadata = new grpc.Metadata(),
    options: Partial<grpc.CallOptions> = {}
  ) => {
    let unaryCall: grpc.ClientUnaryCall | null = null;
    const result: TUnaryResult<TResponse> = Object.assign(
      new Promise<TResponse>((resolve, reject) => {
        const callback: grpc.requestCallback<TResponse> = (e, r) => {
          if (e) reject(e);
          resolve(r);
        };
        unaryCall = rpc(request, metadata, options, callback);
      }),
      { clientUnaryCall: unaryCall }
    );
    return result;
  };
};
