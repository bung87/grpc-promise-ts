# Typescript gRPC stubs with a Promise API

> This package is under development and should not be used
> by anyone for any reason at this time. *Only client Unary RPCs are
> implemented.* If you'd like to add support for streaming RPCs,
> I'd love it, especially later in the summer, if you'd
> [grab](./grpc-promise-ts/issues/1) [an](./grpc-promise-ts/issues/2)
> [issue](./grpc-promise-ts/issues/3).

_A Typescript fork of [`grpc-promise`](../carlessistare/grpc-promise)_


## Table of contents

- [What's gRPC](#what-s-grpc)

## What's [gRPC](http://www.grpc.io/)?

High performance, open source, general-purpose RPC framework.

**Calling service types**

- *Simple RPC:* one single asynchronous call
- *Streaming RPC:* one stream is used for the call

**Implementations**

- *Unary Request:* One **single** message request, one **single** message response
- *Client Stream Request:* One **Writable stream** message request, one **single** message response, sent once the stream is closed
- *Server Stream Request:* One **single** message request, one **Readable stream** message response
- *Bidirectional Stream Request:* One **Duplex stream** for request and response
