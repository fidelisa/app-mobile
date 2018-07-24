/* eslint-disable angular/window-service */


window.generateRandomId = function(length) {
  "use strict";
  var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
    returnValue = "",
    x, i;

  for (x = 0; x < length; x += 1) {
    i = Math.floor(Math.random() * 62);
    returnValue += chars.charAt(i);
  }

  return "ID_" + returnValue;
}


window.normalizeUUID = function(uuid) {
  if (angular.isUndefined(uuid)) {
    return uuid;
  }
  return uuid.replace(/-/g, '').toUpperCase();
}
