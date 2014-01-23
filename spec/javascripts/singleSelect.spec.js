describe("single-select collection", function(){

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
      expect(model.trigger).toHaveBeenCalledWithInitial("selected", model);
    });

   it("should not trigger a reselected event", function(){
      expect(model.trigger).not.toHaveBeenCalledWithInitial("reselected");
    });

    it("should trigger a collection select:one event", function(){
      expect(collection.trigger).toHaveBeenCalledWithInitial("select:one", model, collection);
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

    it("should not trigger a collection reselect:one event", function(){
      expect(collection.trigger).not.toHaveBeenCalledWithInitial("reselect:one");
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
      expect(model.trigger).not.toHaveBeenCalledWithInitial("selected");
    });

    it("should not trigger a collection select:one event", function(){
      expect(collection.trigger).not.toHaveBeenCalledWithInitial("select:one");
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
      spyOn(model, "trigger").andCallThrough();
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

    it("should not trigger a reselected event", function(){
      expect(model.trigger).not.toHaveBeenCalledWithInitial("reselected");
    });

    it("should trigger a select:one event", function(){
      expect(collection.trigger).toHaveBeenCalledWithInitial("select:one", model, collection);
    });

    it("should not trigger a reselect:one event", function(){
      expect(collection.trigger).not.toHaveBeenCalledWithInitial("reselect:one");
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
      expect(collection.trigger).not.toHaveBeenCalledWithInitial("select:one");
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

      spyOn(model, "trigger").andCallThrough();
      spyOn(collection, "trigger").andCallThrough();

      collection.select(model);
    });

    it("should not trigger a select:one event", function(){
      expect(collection.trigger).not.toHaveBeenCalledWithInitial("select:one");
    });

    it("should trigger a reselected event", function(){
      expect(model.trigger).toHaveBeenCalledWithInitial("reselected", model);
    });

    it("should trigger a reselect:one event", function(){
      expect(collection.trigger).toHaveBeenCalledWithInitial("reselect:one", model, collection);
    });
  });

  describe("when selecting a model that is already selected, with options.silent enabled", function(){
    var model, collection;

    beforeEach(function(){
      model = new Model();
      collection = new Collection([model]);

      model.select();

      spyOn(model, "trigger").andCallThrough();
      spyOn(collection, "trigger").andCallThrough();

      collection.select(model, {silent: true});
    });

    it("should not trigger a reselected event", function(){
      expect(model.trigger).not.toHaveBeenCalledWithInitial("reselected");
    });

    it("should not trigger a reselect:one event", function(){
      expect(collection.trigger).not.toHaveBeenCalledWithInitial("reselect:one");
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

    it("should trigger a select:one event", function(){
      expect(collection.trigger).toHaveBeenCalledWithInitial("select:one", m2, collection);
    });

    it("should not trigger a reselect:one event", function(){
      expect(collection.trigger).not.toHaveBeenCalledWithInitial("reselect:one");
    });

    it("should deselect the first model", function(){
      expect(m1.deselect).toHaveBeenCalled();
    });

    it("should fire a deselect:one event for the first model", function(){
      expect(collection.trigger).toHaveBeenCalledWithInitial("deselect:one", m1);
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

    it("should not trigger a select:one event", function(){
      expect(collection.trigger).not.toHaveBeenCalledWithInitial("select:one");
    });

    it("should deselect the first model", function(){
      expect(m1.deselect).toHaveBeenCalled();
    });

    it("should not fire a deselect:one event for the first model", function(){
      expect(collection.trigger).not.toHaveBeenCalledWithInitial("deselect:one");
    });
  });

  describe("when no model is selected and deselecting", function(){
    var model, collection;

    beforeEach(function(){
      model = new Model();
      collection = new Collection([model]);

      spyOn(model, "trigger").andCallThrough();
      spyOn(collection, "trigger").andCallThrough();

      collection.deselect();
    });

    it("should not trigger a selected, reselected or deselected event on the model", function(){
      expect(model.trigger).not.toHaveBeenCalled();
    });

    it("should not trigger a select:one, reselect:one or deselect:one event", function(){
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
      expect(collection.trigger).toHaveBeenCalledWithInitial("deselect:one", model, collection);
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
      expect(collection.trigger).toHaveBeenCalledWithInitial("deselect:one", model, collection);
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

      spyOn(model, "trigger").andCallThrough();
      spyOn(collection, "trigger").andCallThrough();

      collection.deselect(undefined, {silent: true});
    });

    it("should not hang on to the currently selected model", function(){
      expect(collection.selected).toBeUndefined();
    });

    it("should not trigger a deselected event on the model", function(){
      expect(model.trigger).not.toHaveBeenCalledWithInitial("deselected");
    });

    it("should not trigger a deselect:one event", function(){
      expect(collection.trigger).not.toHaveBeenCalledWithInitial("deselect:one");
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

    it("should not trigger a deselect:one event for the selected model", function(){
      expect(collection.trigger).not.toHaveBeenCalledWithInitial("deselect:one");
    });

    it("should not trigger a deselect:one event for the non-selected model", function(){
      expect(collection.trigger).not.toHaveBeenCalledWithInitial("deselect:one");
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

    it("should not trigger a deselect:one event for the selected model", function(){
      expect(collection.trigger).not.toHaveBeenCalledWithInitial("deselect:one");
    });

    it("should not trigger a deselect:one event for the non-selected model", function(){
      expect(collection.trigger).not.toHaveBeenCalledWith("deselect:one");
    });
  });

  describe('custom options', function () {

    describe("when selecting a model via the model's select, with a custom option", function () {
      var model, collection;

      beforeEach(function () {
        model = new Model();
        collection = new Collection([model]);

        spyOn(model, "trigger").andCallThrough();
        spyOn(collection, "trigger").andCallThrough();

        model.select({foo: "bar"});
      });

      it("should trigger a selected event and pass the options object along as the last parameter", function () {
        expect(model.trigger).toHaveBeenCalledWith("selected", model, {foo: "bar"});
      });

      it("should trigger a collection select:one event and pass the options object along as the last parameter", function () {
        expect(collection.trigger).toHaveBeenCalledWith("select:one", model, collection, {foo: "bar"});
      });
    });

    describe("when selecting a model via the collection's select, with a custom option", function () {
      var model, collection;

      beforeEach(function () {
        model = new Model();
        collection = new Collection([model]);

        spyOn(model, "trigger").andCallThrough();
        spyOn(collection, "trigger").andCallThrough();

        collection.select(model, {foo: "bar"});
      });

      it("should trigger a selected event and pass the options object along as the last parameter", function () {
        expect(model.trigger).toHaveBeenCalledWith("selected", model, {foo: "bar"});
      });

      it("should trigger a collection select:one event and pass the options object along as the last parameter", function () {
        expect(collection.trigger).toHaveBeenCalledWith("select:one", model, collection, {foo: "bar"});
      });
    });

    describe("when re-selecting a model via the model's select, with a custom option", function () {
      var model, collection;

      beforeEach(function () {
        model = new Model();
        collection = new Collection([model]);
        model.select();

        spyOn(model, "trigger").andCallThrough();
        spyOn(collection, "trigger").andCallThrough();

        model.select({foo: "bar"});
      });

      it("should trigger a reselected event and pass the options object along as the last parameter", function () {
        expect(model.trigger).toHaveBeenCalledWith("reselected", model, {foo: "bar"});
      });

      it("should trigger a collection reselect:one event and pass the options object along as the last parameter", function () {
        expect(collection.trigger).toHaveBeenCalledWith("reselect:one", model, collection, {foo: "bar"});
      });
    });

    describe("when re-selecting a model via the collection's select, with a custom option", function () {
      var model, collection;

      beforeEach(function () {
        model = new Model();
        collection = new Collection([model]);
        model.select();

        spyOn(model, "trigger").andCallThrough();
        spyOn(collection, "trigger").andCallThrough();

        collection.select(model, {foo: "bar"});
      });

      it("should trigger a reselected event and pass the options object along as the last parameter", function () {
        expect(model.trigger).toHaveBeenCalledWith("reselected", model, {foo: "bar"});
      });

      it("should trigger a collection reselect:one event and pass the options object along as the last parameter", function () {
        expect(collection.trigger).toHaveBeenCalledWith("reselect:one", model, collection, {foo: "bar"});
      });
    });

    describe("when a model is already selected and selecting a different model via the model's select, with a custom option", function () {
      var m1, m2, collection;

      beforeEach(function () {
        m1 = new Model();
        m2 = new Model();
        collection = new Collection([m1, m2]);
        m1.select();

        spyOn(m1, "trigger").andCallThrough();
        spyOn(m2, "trigger").andCallThrough();
        spyOn(collection, "trigger").andCallThrough();

        m2.select({foo: "bar"});
      });

      it("should trigger a deselected event on the first model and pass the options object along as the last parameter", function () {
        expect(m1.trigger).toHaveBeenCalledWith("deselected", m1, {foo: "bar"});
      });

      it("should trigger a selected event on the second model and pass the options object along as the last parameter", function () {
        expect(m2.trigger).toHaveBeenCalledWith("selected", m2, {foo: "bar"});
      });

      it("should trigger a select:one event and pass the options object along as the last parameter", function () {
        expect(collection.trigger).toHaveBeenCalledWith("select:one", m2, collection, {foo: "bar"});
      });

      it("should fire a deselect:one event for the first model and pass the options object along as the last parameter", function () {
        expect(collection.trigger).toHaveBeenCalledWith("deselect:one", m1, collection, {foo: "bar"});
      });
    });

    describe("when a model is already selected and selecting a different model via the collection's select, with a custom option", function () {
      var m1, m2, collection;

      beforeEach(function () {
        m1 = new Model();
        m2 = new Model();
        collection = new Collection([m1, m2]);
        m1.select();

        spyOn(m1, "trigger").andCallThrough();
        spyOn(m2, "trigger").andCallThrough();
        spyOn(collection, "trigger").andCallThrough();

        collection.select(m2, {foo: "bar"});
      });

      it("should trigger a deselected event on the first model and pass the options object along as the last parameter", function () {
        expect(m1.trigger).toHaveBeenCalledWith("deselected", m1, {foo: "bar"});
      });

      it("should trigger a selected event on the second model and pass the options object along as the last parameter", function () {
        expect(m2.trigger).toHaveBeenCalledWith("selected", m2, {foo: "bar"});
      });

      it("should trigger a select:one event and pass the options object along as the last parameter", function () {
        expect(collection.trigger).toHaveBeenCalledWith("select:one", m2, collection, {foo: "bar"});
      });

      it("should fire a deselect:one event for the first model and pass the options object along as the last parameter", function () {
        expect(collection.trigger).toHaveBeenCalledWith("deselect:one", m1, collection, {foo: "bar"});
      });
    });

    describe("when deselecting a model via the model's deselect, with a custom option", function () {
      var model, collection;

      beforeEach(function () {
        model = new Model();
        collection = new Collection([model]);
        model.select();

        spyOn(model, "trigger").andCallThrough();
        spyOn(collection, "trigger").andCallThrough();

        model.deselect({foo: "bar"});
      });

      it("should trigger a deselected event and pass the options object along as the last parameter", function () {
        expect(model.trigger).toHaveBeenCalledWith("deselected", model, {foo: "bar"});
      });

      it("should trigger a collection deselect:one event and pass the options object along as the last parameter", function () {
        expect(collection.trigger).toHaveBeenCalledWith("deselect:one", model, collection, {foo: "bar"});
      });
    });

    describe("when deselecting a model via the collection's select, with a custom option", function () {
      var model, collection;

      beforeEach(function () {
        model = new Model();
        collection = new Collection([model]);
        model.select();

        spyOn(model, "trigger").andCallThrough();
        spyOn(collection, "trigger").andCallThrough();

        collection.deselect(model, {foo: "bar"});
      });

      it("should trigger a deselected event and pass the options object along as the last parameter", function () {
        expect(model.trigger).toHaveBeenCalledWith("deselected", model, {foo: "bar"});
      });

      it("should trigger a collection deselect:one event and pass the options object along as the last parameter", function () {
        expect(collection.trigger).toHaveBeenCalledWith("deselect:one", model, collection, {foo: "bar"});
      });
    });

  });

  describe('automatic invocation of onSelect, onDeselect, onReselect handlers', function () {
    var EventHandlingCollection, model, collection;

    beforeEach(function () {

      EventHandlingCollection = Collection.extend({
        onSelect:   function () {},
        onDeselect: function () {},
        onReselect: function () {}
      });

      model = new Model();
      collection = new EventHandlingCollection([model]);

      spyOn(collection, "onSelect").andCallThrough();
      spyOn(collection, "onDeselect").andCallThrough();
      spyOn(collection, "onReselect").andCallThrough();
    });

    it('calls the onSelect handler when triggering a select:one event', function () {
      collection.trigger("select:one", model, collection, {foo: "bar"});
      expect(collection.onSelect).toHaveBeenCalledWith(model, collection, {foo: "bar"});
    });

    it('calls the onDeselect handler when triggering a deselect:one event', function () {
      collection.trigger("deselect:one", model, collection, {foo: "bar"});
      expect(collection.onDeselect).toHaveBeenCalledWith(model, collection, {foo: "bar"});
    });

    it('calls the onReselect handler when triggering a reselect:one event', function () {
      collection.trigger("reselect:one", model, collection, {foo: "bar"});
      expect(collection.onReselect).toHaveBeenCalledWith(model, collection, {foo: "bar"});
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
