'use strict';

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('tempbox.services', []).
  value('version', '0.1');