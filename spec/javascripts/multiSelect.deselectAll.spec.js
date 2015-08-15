describe("multi-select collection: deselectAll", function(){
  var Model = Backbone.Model.extend({
    initialize: function(){
      Backbone.Picky.Selectable.applyTo(this);
    }
  });
  
  var Collection = Backbone.Collection.extend({
    model: Model,

    initialize: function(){
      Backbone.Picky.MultiSelect.applyTo(this);
    }
  });
  
  describe("when no models are selected, and deselecting all", function(){
    var m1, m2, collection;

    beforeEach(function(){
      m1 = new Model();
      m2 = new Model();

      collection = new Collection([m1, m2]);
      spyOn(collection, "trigger").andCallThrough();

      collection.deselectAll();
    });
    
    it("should not trigger a select:none event", function(){
      // NB This is a change in the spec. Up to version 0.2.0, it _did_ trigger
      // a select:none event. But an event triggered by a no-op didn't make
      // sense and was inconsistent with the behaviour elsewhere.
      expect(collection.trigger).not.toHaveBeenCalledWithInitial("select:none");
    });

    it("should have a selected count of 0", function(){
      expect(collection.selectedLength).toBe(0);
    });

    it("should not have any models in the selected list", function(){
      var size = _.size(collection.selected);
      expect(size).toBe(0);
    });
  });

  describe("when no models are selected, and deselecting all, with options.silent enabled", function(){
    var m1, m2, collection;

    beforeEach(function(){
      m1 = new Model();
      m2 = new Model();

      collection = new Collection([m1, m2]);
      spyOn(collection, "trigger").andCallThrough();

      collection.deselectAll({silent: true});
    });

    it("should not trigger a select:none event", function(){
      expect(collection.trigger).not.toHaveBeenCalledWithInitial("select:none");
    });

    it("should have a selected count of 0", function(){
      expect(collection.selectedLength).toBe(0);
    });

    it("should not have any models in the selected list", function(){
      var size = _.size(collection.selected);
      expect(size).toBe(0);
    });
  });

  describe("when 1 model is selected, and deselecting all", function(){
    var m1, m2, collection;

    beforeEach(function(){
      m1 = new Model();
      m2 = new Model();

      collection = new Collection([m1, m2]);
      m1.select();

      spyOn(collection, "trigger").andCallThrough();
      collection.deselectAll();
    });
    
    it("should trigger a select:none event", function(){
      expect(collection.trigger).toHaveBeenCalledWithInitial("select:none", { selected: [], deselected: [m1] }, collection);
    });

    it("should not trigger a select:some event", function(){
      expect(collection.trigger).not.toHaveBeenCalledWithInitial("select:some");
    });

    it("should not trigger a reselect:any event", function(){
      expect(collection.trigger).not.toHaveBeenCalledWithInitial("reselect:any");
    });

    it("should have a selected count of 0", function(){
      expect(collection.selectedLength).toBe(0);
    });

    it("should not have any models in the selected list", function(){
      var size = _.size(collection.selected);
      expect(size).toBe(0);
    });
  });

  describe("when 1 model is selected, and deselecting all, with options.silent enabled", function(){
    var m1, m2, collection;

    beforeEach(function(){
      m1 = new Model();
      m2 = new Model();

      collection = new Collection([m1, m2]);
      m1.select();

      spyOn(collection, "trigger").andCallThrough();
      collection.deselectAll({silent: true});
    });

    it("should not trigger a select:none event", function(){
      expect(collection.trigger).not.toHaveBeenCalledWithInitial("select:none");
    });

    it("should have a selected count of 0", function(){
      expect(collection.selectedLength).toBe(0);
    });

    it("should not have any models in the selected list", function(){
      var size = _.size(collection.selected);
      expect(size).toBe(0);
    });
  });

  describe("when 1 model is selected, and deselecting all (selectNone)", function(){
    var m1, m2, collection;

    beforeEach(function(){
      m1 = new Model();
      m2 = new Model();

      collection = new Collection([m1, m2]);
      m1.select();

      spyOn(collection, "trigger").andCallThrough();
      collection.selectNone();
    });

    it("should trigger a select:none event", function(){
      expect(collection.trigger).toHaveBeenCalledWithInitial("select:none", { selected: [], deselected: [m1] }, collection);
    });

    it("should not trigger a reselect:any event", function(){
      expect(collection.trigger).not.toHaveBeenCalledWithInitial("reselect:any");
    });

    it("should have a selected count of 0", function(){
      expect(collection.selectedLength).toBe(0);
    });

    it("should not have any models in the selected list", function(){
      var size = _.size(collection.selected);
      expect(size).toBe(0);
    });
  });

  describe("when all models are selected, and deselecting all", function(){
    var m1, m2, collection, selectedEventState, selectNoneEventState;

    beforeEach(function(){
      selectedEventState = { model: {}, collection: {} };
      selectNoneEventState = { m1: {}, m2: {}, collection: {} };

      m1 = new Model();
      m2 = new Model();

      collection = new Collection([m1, m2]);
      m1.select();
      m2.select();

      spyOn(collection, "trigger").andCallThrough();

      m1.on('deselected', function (model) {
        selectedEventState.model.selected = model && model.selected;
        selectedEventState.collection.selected = _.clone(collection.selected);
        selectedEventState.collection.selectedLength = collection.selectedLength;
      });

      collection.on('select:none', function () {
        selectNoneEventState.m1.selected = m1.selected;
        selectNoneEventState.m2.selected = m2.selected;
        selectNoneEventState.collection.selected = _.clone(collection.selected);
        selectNoneEventState.collection.selectedLength = collection.selectedLength;
      });

      collection.deselectAll();
    });
    
    it("should trigger a select:none event", function(){
      expect(collection.trigger).toHaveBeenCalledWithInitial("select:none", { selected: [], deselected: [m1, m2] }, collection);
    });

    it("should not trigger a select:some event", function(){
      expect(collection.trigger).not.toHaveBeenCalledWithInitial("select:some");
    });

    it("should not trigger a reselect:any event", function(){
      expect(collection.trigger).not.toHaveBeenCalledWithInitial("reselect:any");
    });

    it("should have a selected count of 0", function(){
      expect(collection.selectedLength).toBe(0);
    });

    it("should not have any models in the selected list", function(){
      var size = _.size(collection.selected);
      expect(size).toBe(0);
    });

    it('should trigger a model\'s deselected event after the model status has been updated', function () {
      expect(selectedEventState.model.selected).toEqual(false);
    });

    it('should trigger a model\'s selected event after the collection\'s selected models have been updated with that model', function () {
      // m2 doesn't necessarily have to be removed from collection.selected at
      // this time. The point is that events are fired when model and collection
      // states are consistent. When m1 fires the 'deselected' event, only m1
      // must have been removed from the collection.
      expect(selectedEventState.collection.selected[m1.cid]).toBeUndefined();
    });

    it('should trigger a model\'s selected event after the collection\'s selected length has been updated', function () {
      // collection.selectedLength could be 0 or 1 at this time. Again, all we
      // are asking for is consistency - see comment above.
      expect(selectedEventState.collection.selectedLength).toBeLessThan(2);
      expect(selectedEventState.collection.selectedLength).toEqual(_.size(selectedEventState.collection.selected));
    });

    it('should trigger the collection\'s select:none event after the model status has been updated', function () {
      expect(selectNoneEventState.m1.selected).toEqual(false);
      expect(selectNoneEventState.m2.selected).toEqual(false);
    });

    it('should trigger the collection\'s select:none event after the collection\'s selected models have been updated', function () {
      expect(selectNoneEventState.collection.selected).toEqual({});
    });

    it('should trigger the collection\'s select:none event after the collection\'s selected length has been updated', function () {
      expect(selectNoneEventState.collection.selectedLength).toBe(0);
    });
  });

  describe("when all models are selected, and deselecting all (selectNone)", function(){
    var m1, m2, collection;

    beforeEach(function(){
      m1 = new Model();
      m2 = new Model();

      collection = new Collection([m1, m2]);
      m1.select();
      m2.select();

      spyOn(collection, "trigger").andCallThrough();
      collection.selectNone();
    });
    
    it("should trigger a select:none event", function(){
      expect(collection.trigger).toHaveBeenCalledWithInitial("select:none", { selected: [], deselected: [m1, m2] }, collection);
    });

    it("should not trigger a reselect:any event", function(){
      expect(collection.trigger).not.toHaveBeenCalledWithInitial("reselect:any");
    });

    it("should have a selected count of 0", function(){
      expect(collection.selectedLength).toBe(0);
    });

    it("should not have any models in the selected list", function(){
      var size = _.size(collection.selected);
      expect(size).toBe(0);
    });
  });

  describe("when all models are selected, and deselecting all, with options.silent enabled", function(){
    var m1, m2, collection;

    beforeEach(function(){
      m1 = new Model();
      m2 = new Model();

      collection = new Collection([m1, m2]);
      m1.select();
      m2.select();

      spyOn(collection, "trigger").andCallThrough();
      collection.deselectAll({silent: true});
    });

    it("should not trigger a select:none event", function(){
      expect(collection.trigger).not.toHaveBeenCalledWithInitial("select:none");
    });

    it("should have a selected count of 0", function(){
      expect(collection.selectedLength).toBe(0);
    });

    it("should not have any models in the selected list", function(){
      var size = _.size(collection.selected);
      expect(size).toBe(0);
    });
  });

  describe("when all models are selected, and deselecting all with a custom option", function(){
    var m1, m2, collection;

    beforeEach(function(){
      m1 = new Model();
      m2 = new Model();

      collection = new Collection([m1, m2]);
      m1.select();
      m2.select();

      spyOn(m1, "trigger").andCallThrough();
      spyOn(m2, "trigger").andCallThrough();
      spyOn(collection, "trigger").andCallThrough();

      collection.deselectAll({foo: "bar"});
    });

    it("should trigger a deselected event on the first model and pass the options object along as the last parameter", function(){
      expect(m1.trigger).toHaveBeenCalledWith("deselected", m1, {foo: "bar"});
    });

    it("should trigger a deselected event on the second model and pass the options object along as the last parameter", function(){
      expect(m2.trigger).toHaveBeenCalledWith("deselected", m2, {foo: "bar"});
    });

    it("should trigger a select:none event and pass the options object along as the last parameter", function(){
      expect(collection.trigger).toHaveBeenCalledWith("select:none", { selected: [], deselected: [m1, m2] }, collection, {foo: "bar"});
    });
  });

});
