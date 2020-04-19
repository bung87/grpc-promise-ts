// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var test_pb = require('./test_pb.js');

function serialize_test_TestRequest(arg) {
  if (!(arg instanceof test_pb.TestRequest)) {
    throw new Error('Expected argument of type test.TestRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_test_TestRequest(buffer_arg) {
  return test_pb.TestRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_test_TestResponse(arg) {
  if (!(arg instanceof test_pb.TestResponse)) {
    throw new Error('Expected argument of type test.TestResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_test_TestResponse(buffer_arg) {
  return test_pb.TestResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var TestService = exports.TestService = {
  getUnary: {
    path: '/test.Test/getUnary',
    requestStream: false,
    responseStream: false,
    requestType: test_pb.TestRequest,
    responseType: test_pb.TestResponse,
    requestSerialize: serialize_test_TestRequest,
    requestDeserialize: deserialize_test_TestRequest,
    responseSerialize: serialize_test_TestResponse,
    responseDeserialize: deserialize_test_TestResponse,
  },
};

exports.TestClient = grpc.makeGenericClientConstructor(TestService);
