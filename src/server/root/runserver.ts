#!/usr/bin/env node

import do_periodic_checks from 'src/server/root/do_periodic_checks/do_periodic_checks';
import validate from 'src/server/root/validate';
import * as web_request_listener from 'src/server/root/web_request_listener';

Error.stackTraceLimit = Infinity;

validate();

web_request_listener.init();

setInterval(do_periodic_checks, 30 * 1000);
