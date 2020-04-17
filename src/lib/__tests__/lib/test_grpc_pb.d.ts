// package:
// file: test.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as test_pb from "./test_pb";
import { TUnaryRpc } from "../../../lib/unary";

interface ITestService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getUnary: ITestService_IgetUnary;
}

interface ITestService_IgetUnary extends grpc.MethodDefinition<test_pb.TestRequest, test_pb.TestResponse> {
    path: string; // "/.Test/getUnary"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<test_pb.TestRequest>;
    requestDeserialize: grpc.deserialize<test_pb.TestRequest>;
    responseSerialize: grpc.serialize<test_pb.TestResponse>;
    responseDeserialize: grpc.deserialize<test_pb.TestResponse>;
}

export const TestService: ITestService;

export interface ITestServer {
    getUnary: grpc.handleUnaryCall<test_pb.TestRequest, test_pb.TestResponse>;
}

export interface ITestClient {
    getUnary(request: test_pb.TestRequest, callback: (error: grpc.ServiceError | null, response: test_pb.TestResponse) => void): grpc.ClientUnaryCall;
    getUnary(request: test_pb.TestRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: test_pb.TestResponse) => void): grpc.ClientUnaryCall;
    getUnary(request: test_pb.TestRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: test_pb.TestResponse) => void): grpc.ClientUnaryCall;
}

export class TestClient extends grpc.Client implements ITestClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public getUnary(request: test_pb.TestRequest, callback: (error: grpc.ServiceError | null, response: test_pb.TestResponse) => void): grpc.ClientUnaryCall;
    public getUnary(request: test_pb.TestRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: test_pb.TestResponse) => void): grpc.ClientUnaryCall;
    public getUnary(request: test_pb.TestRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: test_pb.TestResponse) => void): grpc.ClientUnaryCall;
}


/**
 * Interface and class to declare a client that has been promisifyed with the
 * `grpc-promise` (https://github.com/carlessistare/grpc-promise) package
 */
export interface ITestPromiseClient {
    getUnary:TUnaryRpc<test_pb.TestRequest, test_pb.TestResponse>
}

export class TestPromiseClient extends grpc.Client implements ITestPromiseClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public getUnary:TUnaryRpc<test_pb.TestRequest, test_pb.TestResponse>;

    // TODO: add other types of RPCs
}



