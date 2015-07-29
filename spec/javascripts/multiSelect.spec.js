describe("multi-select collection: general", function(){
  var Model = Backbone.Model.extend({
    initialize: function(){
      var selectable = new Backbone.Picky.Selectable(this);
      _.extend(this, selectable);
    }
  });
  
  var Collection = Backbone.Collection.extend({
    model: Model,

    initialize: function(){
      var multiSelect = new Backbone.Picky.MultiSelect(this);
      _.extend(this, multiSelect);
    }
  });

  describe('automatic invocation of onSelectNone, onSelectSome, onSelectAll, onReselect handlers', function () {
    var EventHandlingCollection, model, collection;

    beforeEach(function () {

      EventHandlingCollection = Collection.extend({
        onSelectNone: function (model, options) {},
        onSelectSome: function (model, options) {},
        onSelectAll:  function (model, options) {},
        onReselect:   function (model, options) {}
      });

      model = new Model();
      collection = new EventHandlingCollection([model]);

      spyOn(collection, "onSelectNone").andCallThrough();
      spyOn(collection, "onSelectSome").andCallThrough();
      spyOn(collection, "onSelectAll").andCallThrough();
      spyOn(collection, "onReselect").andCallThrough();
    });

    it('calls the onSelectNone handler when triggering a select:none event', function () {
      collection.trigger("select:none", collection, {foo: "bar"});
      expect(collection.onSelectNone).toHaveBeenCalledWith(collection, {foo: "bar"});
    });

    it('calls the onSelectSome handler when triggering a select:some event', function () {
      collection.trigger("select:some", collection, {foo: "bar"});
      expect(collection.onSelectSome).toHaveBeenCalledWith(collection, {foo: "bar"});
    });

    it('calls the onSelectAll handler when triggering a select:all event', function () {
      collection.trigger("select:all", collection, {foo: "bar"});
      expect(collection.onSelectAll).toHaveBeenCalledWith(collection, {foo: "bar"});
    });

    it('calls the onReselect handler when triggering a reselect:any event', function () {
      collection.trigger("reselect:any", [model], {foo: "bar"});
      expect(collection.onReselect).toHaveBeenCalledWith([model], {foo: "bar"});
    });
  });

  describe('Checking for memory leaks', function () {

    describe('when a collection is replaced by another one and is not referenced by a variable any more, with model sharing disabled', function () {
      var logger, LoggedCollection, m1, m2, collection;

      beforeEach(function () {
        logger = new Logger();

        LoggedCollection = Collection.extend({
          initialize: function(models){
            this.on("select:none", function () {
              logger.log( "select:none event fired in selected in collection " + this._pickyCid );
            });
            this.on("select:some", function () {
              logger.log( "select:some event fired in selected in collection " + this._pickyCid );
            });
            this.on("select:all", function () {
              logger.log( "select:all event fired in selected in collection " + this._pickyCid );
            });

            Collection.prototype.initialize.call(this, models);
          }
        });

        m1 = new Model();
        m2 = new Model();
      });

      it('should no longer respond to model events', function () {
        // With only variable holding a collection, only one 'select:*' event
        // should be logged.

        //noinspection JSUnusedAssignment
        collection = new LoggedCollection([m1, m2]);
        collection = new LoggedCollection([m1, m2]);

        m2.select();
        expect(logger.entries.length).toBe(1);
      });
    });

    describe('when a collection is replaced by another one and is not referenced by a variable any more, with model sharing enabled', function () {
      var logger, Collection, LoggedCollection, m1, m2, collection;

      beforeEach(function () {
        logger = new Logger();

        Collection = Backbone.Collection.extend({
          model: Model,

          initialize: function(models){
            var multiSelect = new Backbone.Picky.MultiSelect(this, models);
            _.extend(this, multiSelect);
          }
        });

        LoggedCollection = Collection.extend({
          initialize: function(models){
            this.on("select:none", function () {
              logger.log( "select:none event fired in selected in collection " + this._pickyCid );
            });
            this.on("select:some", function () {
              logger.log( "select:some event fired in selected in collection " + this._pickyCid );
            });
            this.on("select:all", function () {
              logger.log( "select:all event fired in selected in collection " + this._pickyCid );
            });

            Collection.prototype.initialize.call(this, models);
          }
        });

        m1 = new Model();
        m2 = new Model();
      });

      it('should no longer respond to model events after calling close on it', function () {
        // With only variable holding a collection, only one 'select:*' event
        // should be logged.
        collection = new LoggedCollection([m1, m2]);
        collection.close();
        collection = new LoggedCollection([m1, m2]);

        m2.select();
        expect(logger.entries.length).toBe(1);
      });
    });

  });

});
