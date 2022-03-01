#!/usr/bin/env node

import validate from 'src/server/root/validate';
import * as web_request_listener from 'src/server/root/web_request_listener';

Error.stackTraceLimit = Infinity;

validate();

web_request_listener.init();

setTimeout(() => {
  console.log('hello world');
}, 5000);
