function Keyboard() {
  this.keyCodes = {};
  this.modifiers = {};
  var self = this;
  this._onKeyDown = function (event) {
    self._onKeyChange(event, true);
  };
  this._onKeyUp = function (event) {
    self._onKeyChange(event, false);
  };
  document.addEventListener('keydown', this._onKeyDown, false);
  document.addEventListener('keyup', this._onKeyUp, false);
  this.MODIFIERS = [
    'shift',
    'ctrl',
    'alt',
    'meta'
  ];
  this.ALIAS = {
    'left': 37,
    'up': 38,
    'right': 39,
    'down': 40,
    'space': 32,
    'pageup': 33,
    'pagedown': 34,
    'tab': 9
  };
  this.events = {};
}

Keyboard.prototype.destroy = function () {
  document.removeEventListener('keydown', this._onKeyDown, false);
  document.removeEventListener('keyup', this._onKeyUp, false);
};

Keyboard.prototype.trigger = function (key) {
  if (this.events[key] === undefined)
    return;
  var eventName = this._flip(this.ALIAS)[key];
  if (eventName === undefined)
    eventName = String.fromCharCode(key);
  this.events[key].forEach(function (fn) {
    fn({
      'type': eventName,
      'target': this
    });
  });
};

Keyboard.prototype.once = function (key, fn) {
  var _fn = function () {
    fn();
    this.off(key, _fn);
  }.bind(this);
  this.on(key, _fn);
};

Keyboard.prototype.on = function (key, fn) {
  if (key instanceof Array) {
    key.forEach(function (_key) {
      this.__on(_key, fn);
    }.bind(this));
  } else {
    this.__on(key, fn);
  }
};

Keyboard.prototype.__on = function (key, fn) {
  key = this.ALIAS[key] !== undefined ? this.ALIAS[key] : key.toUpperCase().charCodeAt(0);
  if (this.events[key] === undefined)
    this.events[key] = [];
  this.events[key].push(fn);
};

Keyboard.prototype.clearButtonEvent = function (key) {
  key = key.toUpperCase().charCodeAt(0);
  delete this.events[key];
};

Keyboard.prototype.off = function (key, fn) {
  key = key.toUpperCase().charCodeAt(0);
  if (this.events[key] === undefined)
    return;
  var listenerArray = this.events[key];
  var index = listenerArray.indexOf(fn);
  if (index !== -1) {
    this.events[key].splice(index, 1);
  }
};

Keyboard.prototype._onKeyChange = function (event, pressed) {
  var keyCode = event.keyCode;
  if (pressed) {
    this.trigger(keyCode);
  }
  this.keyCodes[keyCode] = pressed;
  this.modifiers['shift'] = event.shiftKey;
  this.modifiers['ctrl'] = event.ctrlKey;
  this.modifiers['alt'] = event.altKey;
  this.modifiers['meta'] = event.metaKey;
};

Keyboard.prototype.pressed = function (keyDesc) {
  var keys = keyDesc.split('+');
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var pressed;
    if (this.MODIFIERS.indexOf(key) !== -1) {
      pressed = this.modifiers[key];
    } else if (Object.keys(this.ALIAS).indexOf(key) != -1) {
      pressed = this.keyCodes[this.ALIAS[key]];
    } else {
      pressed = this.keyCodes[key.toUpperCase().charCodeAt(0)];
    }
    if (!pressed)
      return false;
  }
  return true;
};

Keyboard.prototype._flip = function (trans) {
  var key, tmp_ar = {};
  for (key in trans) {
    tmp_ar[trans[key]] = key;
  }
  return tmp_ar;
};