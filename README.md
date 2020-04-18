# grpc-promise-typescript

__Type safe GRPC with a modern API__

_A Typescript fork of [`grpc-promise`](https://github.com/carlessistare/grpc-promise)_

> This package is under active development and should not be used
> by anyone for any reason at this time.

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
