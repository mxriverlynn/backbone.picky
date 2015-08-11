var Logger = function () {
  this.reset();
};

_.extend(Logger.prototype, {
  log: function (content) {
    this.entries.push(content);
  },
  reset: function () {
    this.entries = [];
  }
});