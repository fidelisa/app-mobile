
//Add startsWith
if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function(str) {
    return this.slice(0, str.length) == str;
  };
}

if (typeof String.prototype.contains != 'function') {
  String.prototype.contains = function(it) {
    return this.indexOf(it) != -1;
  };
}

if (typeof Array.prototype.contains != 'function') {
  Array.prototype.contains = function(it) {
    return this.indexOf(it) != -1;
  };
}

if (typeof String.prototype.addressEncode != 'function') {
  String.prototype.addressEncode = function() {
    return this.replace(/ /g, "+").replace(/\+\+/g, '+')
  };
}


if (typeof String.prototype.textEncode != 'function') {
  String.prototype.textEncode = function() {
    return this.replace(/\n/g, "<br/>");
  };
}

if (typeof String.prototype.toUuidString != 'function') {
  String.prototype.toUuidString = function() {
    if (this.length != 32) {
      return this.toString();
    }
    var values = [];
    values.push(this.substring(0, 8));
    values.push(this.substring(8, 12));
    values.push(this.substring(12, 16));
    values.push(this.substring(16, 20));
    values.push(this.substring(20, 32));

    return values.join('-');
  };
}

if (typeof Array.prototype.findByUUID != 'function') {
  Array.prototype.findByUUID = function(id) {
    var obj;
    this.forEach(function(o) {
      if (id === o.uuid) {
        obj = o;
      }
    });
    return obj;
  };
}

if (typeof Date.prototype.addDays != 'function') {
  Date.prototype.addDays = function(days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
  }
}
