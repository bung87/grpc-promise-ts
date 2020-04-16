# grpc-promise-typescript

__Type safe GRPC with a modern API__

_A Typescript fork of [`grpc-promise`](https://github.com/carlessistare/grpc-promise)_

> This package is under active development and should not be used
> by anyone for any reason at this time.

## Table of contents

- [What's gRPC](#what-s-grpc)
- [MIT License](#mit-license)

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

## MIT License

Copyright (c) 2020 David Walsh | Some material copyright (c) 2017 Carles Sistare

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
