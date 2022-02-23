#!/usr/bin/env node

import * as web_request_listener from 'src/server/root/web_request_listener';

Error.stackTraceLimit = Infinity;

web_request_listener.init();

setTimeout(() => {
  console.log('hello world');
}, 5000);
