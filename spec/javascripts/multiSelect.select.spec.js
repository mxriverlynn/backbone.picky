describe("multi-select collection selecting", function(){
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
  
  describe("when no models are selected, and selecting all", function(){
    var m1, m2, collection, selectedEventState, selectAllEventState;

    beforeEach(function(){
      selectedEventState = { model: {}, collection: {} };
      selectAllEventState = { m1: {}, m2: {}, collection: {} };

      m1 = new Model();
      m2 = new Model();

      collection = new Collection([m1, m2]);
      spyOn(collection, "trigger").andCallThrough();

      m1.on('selected', function (model) {
        selectedEventState.model.selected = model && model.selected;
        selectedEventState.collection.selected = _.clone(collection.selected);
        selectedEventState.collection.selectedLength = collection.selectedLength;
      });

      collection.on('select:all', function () {
        selectAllEventState.m1.selected = m1.selected;
        selectAllEventState.m2.selected = m2.selected;
        selectAllEventState.collection.selected = _.clone(collection.selected);
        selectAllEventState.collection.selectedLength = collection.selectedLength;
      });

      collection.selectAll();
    });
    
    it("should trigger 'all' selected event", function(){
      expect(collection.trigger).toHaveBeenCalledWith("select:all", collection);
    });

    it("should have a selected count of 2", function(){
      expect(collection.selectedLength).toBe(2);
    });

    it("should have the first selected model in the selected list", function(){
      expect(collection.selected[m1.cid]).not.toBeUndefined();
    });

    it("should have the second selected model in the selected list", function(){
      expect(collection.selected[m2.cid]).not.toBeUndefined();
    });

    it('should trigger a model\'s selected event after the model status has been updated', function () {
      expect(selectedEventState.model.selected).toEqual(true);
    });

    it('should trigger a model\'s selected event after the collection\'s selected models have been updated with that model', function () {
      // m2 doesn't necessarily have to be part of collection.selected at this
      // time. The point is that events are fired when model and collection
      // states are consistent. When m1 fires the 'selected' event, only m1 must
      // be part of the collection.
      expect(selectedEventState.collection.selected[m1.cid]).toBe(m1);
    });

    it('should trigger a model\'s selected event after the collection\'s selected length has been updated', function () {
      // collection.selectedLength could be 1 or 2 at this time. Again, all we
      // are asking for is consistency - see comment above.
      expect(selectedEventState.collection.selectedLength).toBeGreaterThan(0);
      expect(selectedEventState.collection.selectedLength).toEqual(_.size(selectedEventState.collection.selected));
    });

    it('should trigger the collection\'s select:all event after the model status has been updated', function () {
      expect(selectAllEventState.m1.selected).toEqual(true);
      expect(selectAllEventState.m2.selected).toEqual(true);
    });

    it('should trigger the collection\'s select:all event after the collection\'s selected models have been updated', function () {
      expect(selectAllEventState.collection.selected[m1.cid]).toBe(m1);
      expect(selectAllEventState.collection.selected[m2.cid]).toBe(m2);
    });

    it('should trigger the collection\'s select:all event after the collection\'s selected length has been updated', function () {
      expect(selectAllEventState.collection.selectedLength).toBe(2);
    });

  });

  describe("when no models are selected, and selecting all, with options.silent enabled", function(){
    var m1, m2, collection;

    beforeEach(function(){
      m1 = new Model();
      m2 = new Model();

      collection = new Collection([m1, m2]);
      spyOn(collection, "trigger").andCallThrough();

      collection.selectAll({silent: true});
    });

    it("should not trigger an 'all' selected event", function(){
      expect(collection.trigger).not.toHaveBeenCalledWith("select:all", collection);
    });

    it("should have a selected count of 2", function(){
      expect(collection.selectedLength).toBe(2);
    });

    it("should have the first selected model in the selected list", function(){
      expect(collection.selected[m1.cid]).not.toBeUndefined();
    });

    it("should have the second selected model in the selected list", function(){
      expect(collection.selected[m2.cid]).not.toBeUndefined();
    });
  });

  describe("when 1 model is selected, and selecting all", function(){
    var m1, m2, collection;

    beforeEach(function(){
      m1 = new Model();
      m2 = new Model();

      collection = new Collection([m1, m2]);
      m1.select();

      spyOn(collection, "trigger").andCallThrough();
      collection.selectAll();
    });
    
    it("should trigger 'all' selected event", function(){
      expect(collection.trigger).toHaveBeenCalledWith("select:all", collection);
    });

    it("should have a selected count of 2", function(){
      expect(collection.selectedLength).toBe(2);
    });

    it("should have the first selected model in the selected list", function(){
      expect(collection.selected[m1.cid]).not.toBeUndefined();
    });

    it("should have the second selected model in the selected list", function(){
      expect(collection.selected[m2.cid]).not.toBeUndefined();
    });
  });

  describe("when 1 model is selected, and selecting all, with options.silent enabled", function(){
    var m1, m2, collection;

    beforeEach(function(){
      m1 = new Model();
      m2 = new Model();

      collection = new Collection([m1, m2]);
      m1.select();

      spyOn(collection, "trigger").andCallThrough();
      collection.selectAll({silent: true});
    });

    it("should not trigger an 'all' selected event", function(){
      expect(collection.trigger).not.toHaveBeenCalledWith("select:all", collection);
    });

    it("should have a selected count of 2", function(){
      expect(collection.selectedLength).toBe(2);
    });

    it("should have the first selected model in the selected list", function(){
      expect(collection.selected[m1.cid]).not.toBeUndefined();
    });

    it("should have the second selected model in the selected list", function(){
      expect(collection.selected[m2.cid]).not.toBeUndefined();
    });
  });

  describe("when all models are selected, and selecting all", function(){
    var m1, m2, collection;

    beforeEach(function(){
      m1 = new Model();
      m2 = new Model();

      collection = new Collection([m1, m2]);
      m1.select();
      m2.select();

      spyOn(collection, "trigger").andCallThrough();
      collection.selectAll();
    });
    
    it("should trigger 'all' selected event", function(){
      expect(collection.trigger).toHaveBeenCalledWith("select:all", collection);
    });

    it("should have a selected count of 2", function(){
      expect(collection.selectedLength).toBe(2);
    });

    it("should have the first selected model in the selected list", function(){
      expect(collection.selected[m1.cid]).not.toBeUndefined();
    });

    it("should have the second selected model in the selected list", function(){
      expect(collection.selected[m2.cid]).not.toBeUndefined();
    });
  });

  describe("when all models are selected, and selecting all, with options.silent enabled", function(){
    var m1, m2, collection;

    beforeEach(function(){
      m1 = new Model();
      m2 = new Model();

      collection = new Collection([m1, m2]);
      m1.select();
      m2.select();

      spyOn(collection, "trigger").andCallThrough();
      collection.selectAll({silent: true});
    });

    it("should trigger 'all' selected event", function(){
      expect(collection.trigger).not.toHaveBeenCalledWith("select:all", collection);
    });

    it("should have a selected count of 2", function(){
      expect(collection.selectedLength).toBe(2);
    });

    it("should have the first selected model in the selected list", function(){
      expect(collection.selected[m1.cid]).not.toBeUndefined();
    });

    it("should have the second selected model in the selected list", function(){
      expect(collection.selected[m2.cid]).not.toBeUndefined();
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
