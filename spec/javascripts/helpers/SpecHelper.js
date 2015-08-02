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

beforeEach(function() {

  this.addMatchers({

    /**
     * Matcher that checks to see if the actual, a Jasmine spy, was called with
     * parameters beginning with a specific set.
     *
     * @example
     *
     *     spyOn(obj, "foo");
     *     obj.foo(1, 2, 3);
     *     expect(obj.foo).toHaveBeenCalledWithInitial(1, 2);     // => true
     */
    toHaveBeenCalledWithInitial: function() {
      var expectedArgs = jasmine.util.argsToArray(arguments);
      if (!jasmine.isSpy(this.actual)) {
        throw new Error('Expected a spy, but got ' + jasmine.pp(this.actual) + '.');
      }
      this.message = function() {
        var invertedMessage = "Expected spy " + this.actual.identity + " not to have been called with initial arguments " + jasmine.pp(expectedArgs) + " but it was.";
        var positiveMessage = "";
        if (this.actual.callCount === 0) {
          positiveMessage = "Expected spy " + this.actual.identity + " to have been called with initial arguments " + jasmine.pp(expectedArgs) + " but it was never called.";
        } else {
          positiveMessage = "Expected spy " + this.actual.identity + " to have been called with initial arguments " + jasmine.pp(expectedArgs) + " but actual calls were " + jasmine.pp(this.actual.argsForCall).replace(/^\[ | \]$/g, '')
        }
        return [positiveMessage, invertedMessage];
      };

      var actualInitial = _.map(this.actual.argsForCall, function (args) {
        return args.slice(0, expectedArgs.length);
      });
      return this.env.contains_(actualInitial, expectedArgs);
    }

  });

});
