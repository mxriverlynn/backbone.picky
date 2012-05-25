(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(["_", "Backbone"], factory);
    }
}(this, function (_, Backbone) {
  //= backbone.picky.js
  return Backbone.Picky;
}));
