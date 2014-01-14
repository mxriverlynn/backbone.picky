describe("single select collection", function(){

  var Model = Backbone.Model.extend({
    initialize: function(){
      var selectable = new Backbone.Picky.Selectable(this);
      _.extend(this, selectable);
    }
  });

  var Collection = Backbone.Collection.extend({
    model: Model,

    initialize: function(){
      var singleSelect = new Backbone.Picky.SingleSelect(this);
      _.extend(this, singleSelect);
    }
  });

  describe("when selecting a model via the model's select", function(){
    var model, collection, selectedEventState, selectOneEventState;

    beforeEach(function(){
      selectedEventState = { model: {}, collection: {} };
      selectOneEventState = { model: {}, collection: {} };

      model = new Model();
      collection = new Collection([model]);

      spyOn(model, "trigger").andCallThrough();
      spyOn(collection, "trigger").andCallThrough();

      model.on('selected', function (model) {
        selectedEventState.model.selected = model && model.selected;
        selectedEventState.collection.selected = collection.selected;
      });

      collection.on('select:one', function (model) {
        selectOneEventState.model.selected = model && model.selected;
        selectOneEventState.collection.selected = collection.selected;
      });

      model.select();
    });

    it("should hang on to the currently selected model", function(){
      expect(collection.selected).toBe(model);
    });

    it("should trigger a selected event", function(){
      expect(model.trigger).toHaveBeenCalledWith("selected", model);
    });

    it("should trigger a collection select:one event", function(){
      expect(collection.trigger).toHaveBeenCalledWith("select:one", model);
    });

    it('should trigger the model\'s selected event after the model status has been updated', function () {
      expect(selectedEventState.model.selected).toEqual(true);
    });

    it('should trigger the model\'s selected event after the collection status has been updated', function () {
      expect(selectedEventState.collection.selected).toBe(model);
    });

    it('should trigger the collection\'s select:one event after the model status has been updated', function () {
      expect(selectOneEventState.model.selected).toEqual(true);
    });

    it('should trigger the collection\'s select:one event after the collection status has been updated', function () {
      expect(selectOneEventState.collection.selected).toBe(model);
    });
  });

  describe("when selecting a model via the model's select, with options.silent enabled", function(){
    var model, collection;

    beforeEach(function(){
      model = new Model();
      collection = new Collection([model]);

      spyOn(model, "trigger").andCallThrough();
      spyOn(collection, "trigger").andCallThrough();

      model.select({silent: true});
    });

    it("should hang on to the currently selected model", function(){
      expect(collection.selected).toBe(model);
    });

    it("should not trigger a selected event", function(){
      expect(model.trigger).not.toHaveBeenCalledWith("selected", model);
    });

    it("should not trigger a collection select:one event", function(){
      expect(collection.trigger).not.toHaveBeenCalledWith("select:one", model);
    });
  });

  describe("when selecting a model via the collection's select", function(){
    var model, collection, selectedEventState, selectOneEventState;

    beforeEach(function(){
      selectedEventState = { model: {}, collection: {} };
      selectOneEventState = { model: {}, collection: {} };

      model = new Model();
      collection = new Collection([model]);

      spyOn(collection, "trigger").andCallThrough();
      spyOn(model, "select").andCallThrough();

      model.on('selected', function (model) {
        selectedEventState.model.selected = model && model.selected;
        selectedEventState.collection.selected = collection.selected;
      });

      collection.on('select:one', function (model) {
        selectOneEventState.model.selected = model && model.selected;
        selectOneEventState.collection.selected = collection.selected;
      });

      collection.select(model);
    });

    it("should hang on to the currently selected model", function(){
      expect(collection.selected).toBe(model);
    });

    it("should trigger a select:one event", function(){
      expect(collection.trigger).toHaveBeenCalledWith("select:one", model);
    });

    it("should tell the model to select itself", function(){
      expect(model.select).toHaveBeenCalled();
    });

    it('should trigger the model\'s selected event after the model status has been updated', function () {
      expect(selectedEventState.model.selected).toEqual(true);
    });

    it('should trigger the model\'s selected event after the collection status has been updated', function () {
      expect(selectedEventState.collection.selected).toBe(model);
    });

    it('should trigger the collection\'s select:one event after the model status has been updated', function () {
      expect(selectOneEventState.model.selected).toEqual(true);
    });

    it('should trigger the collection\'s select:one event after the collection status has been updated', function () {
      expect(selectOneEventState.collection.selected).toBe(model);
    });
  });

  describe("when selecting a model via the collection's select, with options.silent enabled", function(){
    var model, collection;

    beforeEach(function(){
      model = new Model();
      collection = new Collection([model]);

      spyOn(collection, "trigger").andCallThrough();
      spyOn(model, "select").andCallThrough();

      collection.select(model, {silent: true});
    });

    it("should hang on to the currently selected model", function(){
      expect(collection.selected).toBe(model);
    });

    it("should not trigger a select:one event", function(){
      expect(collection.trigger).not.toHaveBeenCalledWith("select:one", model);
    });

    it("should tell the model to select itself", function(){
      expect(model.select).toHaveBeenCalled();
    });
  });

  describe("when selecting a model that is already selected", function(){
    var model, collection;

    beforeEach(function(){
      model = new Model();
      collection = new Collection([model]);

      model.select();

      spyOn(collection, "trigger").andCallThrough();

      collection.select(model);
    });

    it("should not trigger a selected event", function(){
      expect(collection.trigger).not.toHaveBeenCalledWith("select:one", model);
    });
  });

  describe("when a model is already selected and selecting a different model", function(){
    var m1, m2, collection;

    beforeEach(function(){
      m1 = new Model();
      m2 = new Model();
      collection = new Collection([m1, m2]);
      m1.select();

      spyOn(collection, "trigger").andCallThrough();
      spyOn(m1, "deselect").andCallThrough();

      m2.select();
    });

    it("should hang on to the currently selected model", function(){
      expect(collection.selected).toBe(m2);
    });

    it("should trigger a selected event", function(){
      expect(collection.trigger).toHaveBeenCalledWith("select:one", m2);
    });

    it("should deselect the first model", function(){
      expect(m1.deselect).toHaveBeenCalled();
    });

    it("should fire a deselect event for the first model", function(){
      expect(collection.trigger).toHaveBeenCalledWith("deselect:one", m1);
    });
  });

  describe("when a model is already selected and selecting a different model, with options.silent enabled", function(){
    var m1, m2, collection;

    beforeEach(function(){
      m1 = new Model();
      m2 = new Model();
      collection = new Collection([m1, m2]);
      m1.select();

      spyOn(collection, "trigger").andCallThrough();
      spyOn(m1, "deselect").andCallThrough();

      m2.select({silent: true});
    });

    it("should hang on to the currently selected model", function(){
      expect(collection.selected).toBe(m2);
    });

    it("should not trigger a selected event", function(){
      expect(collection.trigger).not.toHaveBeenCalledWith("select:one", m2);
    });

    it("should deselect the first model", function(){
      expect(m1.deselect).toHaveBeenCalled();
    });

    it("should not fire a deselect event for the first model", function(){
      expect(collection.trigger).not.toHaveBeenCalledWith("deselect:one", m1);
    });
  });

  describe("when no model is selected and deselecting", function(){
    var collection;

    beforeEach(function(){
      collection = new Collection();

      spyOn(collection, "trigger").andCallThrough();

      collection.deselect();
    });

    it("should not trigger a selected or deselected event", function(){
      expect(collection.trigger).not.toHaveBeenCalled();
    });
  });

  describe("when a model is selected and deselecting the model through the model's deselect", function(){
    var model, collection, deselectedEventState, deselectOneEventState;

    beforeEach(function(){
      deselectedEventState = { model: {}, collection: {} };
      deselectOneEventState = { model: {}, collection: {} };

      model = new Model();
      collection = new Collection([model]);
      model.select();

      spyOn(collection, "trigger").andCallThrough();

      model.on('deselected', function (model) {
        deselectedEventState.model.selected = model && model.selected;
        deselectedEventState.collection.selected = collection.selected;
      });

      collection.on('deselect:one', function (model) {
        deselectOneEventState.model.selected = model && model.selected;
        deselectOneEventState.collection.selected = collection.selected;
      });

      model.deselect();
    });

    it("should not hang on to the currently selected model", function(){
      expect(collection.selected).toBeUndefined();
    });

    it("should trigger a deselect:one event", function(){
      expect(collection.trigger).toHaveBeenCalledWith("deselect:one", model);
    });

    it('should trigger the model\'s deselected event after the model status has been updated', function () {
      expect(deselectedEventState.model.selected).toEqual(false);
    });

    it('should trigger the model\'s deselected event after the collection status has been updated', function () {
      expect(deselectedEventState.collection.selected).toBeUndefined();
    });

    it('should trigger the collection\'s deselect:one event after the model status has been updated', function () {
      expect(deselectOneEventState.model.selected).toEqual(false);
    });

    it('should trigger the collection\'s deselect:one event after the collection status has been updated', function () {
      expect(deselectOneEventState.collection.selected).toBeUndefined();
    });
  });

  describe("when a model is selected and deselecting the model through the collection's deselect", function(){
    var model, collection, deselectedEventState, deselectOneEventState;

    beforeEach(function(){
      deselectedEventState = { model: {}, collection: {} };
      deselectOneEventState = { model: {}, collection: {} };

      model = new Model();
      collection = new Collection([model]);
      model.select();

      spyOn(collection, "trigger").andCallThrough();

      model.on('deselected', function (model) {
        deselectedEventState.model.selected = model && model.selected;
        deselectedEventState.collection.selected = collection.selected;
      });

      collection.on('deselect:one', function (model) {
        deselectOneEventState.model.selected = model && model.selected;
        deselectOneEventState.collection.selected = collection.selected;
      });

      collection.deselect();
    });

    it("should not hang on to the currently selected model", function(){
      expect(collection.selected).toBeUndefined();
    });

    it("should trigger a deselect:one event", function(){
      expect(collection.trigger).toHaveBeenCalledWith("deselect:one", model);
    });

    it('should trigger the model\'s deselected event after the model status has been updated', function () {
      expect(deselectedEventState.model.selected).toEqual(false);
    });

    it('should trigger the model\'s deselected event after the collection status has been updated', function () {
      expect(deselectedEventState.collection.selected).toBeUndefined();
    });

    it('should trigger the collection\'s deselect:one event after the model status has been updated', function () {
      expect(deselectOneEventState.model.selected).toEqual(false);
    });

    it('should trigger the collection\'s deselect:one event after the collection status has been updated', function () {
      expect(deselectOneEventState.collection.selected).toBeUndefined();
    });
  });

  describe("when a model is selected and deselecting the model, with options.silent enabled", function(){
    var model, collection;

    beforeEach(function(){
      model = new Model();
      collection = new Collection([model]);
      model.select();

      spyOn(collection, "trigger").andCallThrough();

      collection.deselect(undefined, {silent: true});
    });

    it("should not hang on to the currently selected model", function(){
      expect(collection.selected).toBeUndefined();
    });

    it("should not trigger a deselected event", function(){
      expect(collection.trigger).not.toHaveBeenCalledWith("deselect:one", model);
    });
  });

  describe("when one model is selected and deselecting another model through the collection's deselect", function(){
    var m1, m2, collection;

    beforeEach(function(){
      m1 = new Model();
      m2 = new Model();
      collection = new Collection([m1, m2]);
      collection.select(m1);

      spyOn(m1, "deselect").andCallThrough();
      spyOn(collection, "trigger").andCallThrough();

      collection.deselect(m2);
    });

    it("should still hang on to the currently selected model", function(){
      expect(collection.selected).toBe(m1);
    });

    it("should keep the selected model selected", function(){
      expect(m1.selected).toBe(true);
    });

    it("should not deselect the selected model", function(){
      expect(m1.deselect).not.toHaveBeenCalled();
    });

    it("should not trigger a deselected event for the selected model", function(){
      expect(collection.trigger).not.toHaveBeenCalledWith("deselect:one", m1);
    });

    it("should not trigger a deselected event for the non-selected model", function(){
      expect(collection.trigger).not.toHaveBeenCalledWith("deselect:one", m2);
    });
  });

  describe("when one model is selected and deselecting another model through the model's deselect", function(){
    var m1, m2, collection;

    beforeEach(function(){
      m1 = new Model();
      m2 = new Model();
      collection = new Collection([m1, m2]);
      collection.select(m1);

      spyOn(m1, "deselect").andCallThrough();
      spyOn(collection, "trigger").andCallThrough();

      m2.deselect();
    });

    it("should still hang on to the currently selected model", function(){
      expect(collection.selected).toBe(m1);
    });

    it("should keep the selected model selected", function(){
      expect(m1.selected).toBe(true);
    });

    it("should not deselect the selected model", function(){
      expect(m1.deselect).not.toHaveBeenCalled();
    });

    it("should not trigger a deselected event for the selected model", function(){
      expect(collection.trigger).not.toHaveBeenCalledWith("deselect:one", m1);
    });

    it("should not trigger a deselected event for the non-selected model", function(){
      expect(collection.trigger).not.toHaveBeenCalledWith("deselect:one", m2);
    });
  });

  describe('Checking for memory leaks', function () {

    describe('when a collection is replaced by another one and is not referenced by a variable any more, with model sharing disabled', function () {
      var logger, LoggedCollection, m1, m2, collection;

      beforeEach(function () {
        logger = new Logger();

        LoggedCollection = Collection.extend({
          initialize: function(models){
            this.on("select:one", function (model) {
              logger.log( "select:one event: Model " + model.cid + " selected in collection " + this._pickyCid );
            });
            this.on("deselect:one", function (model) {
              logger.log( "deselect:one event: Model " + model.cid + " deselected in collection " + this._pickyCid );
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
            var singleSelect = new Backbone.Picky.SingleSelect(this, models);
            _.extend(this, singleSelect);
          }
        });

        LoggedCollection = Collection.extend({
          initialize: function(models){
            this.on("select:one", function (model) {
              logger.log( "select:one event: Model " + model.cid + " selected in collection " + this._pickyCid );
            });
            this.on("deselect:one", function (model) {
              logger.log( "deselect:one event: Model " + model.cid + " deselected in collection " + this._pickyCid );
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
