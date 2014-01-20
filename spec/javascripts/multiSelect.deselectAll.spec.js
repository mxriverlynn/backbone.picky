describe("multi-select collection: deselectAll", function(){
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
  
  describe("when no models are selected, and deselecting all", function(){
    var m1, m2, collection;

    beforeEach(function(){
      m1 = new Model();
      m2 = new Model();

      collection = new Collection([m1, m2]);
      spyOn(collection, "trigger").andCallThrough();

      collection.deselectAll();
    });
    
    it("should trigger a select:none event", function(){
      // todo This is doesn't make sense and is inconsistent with the behaviour elsewhere: an event triggered by a no-op
      expect(collection.trigger).toHaveBeenCalledWith("select:none", collection);
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
      expect(collection.trigger).not.toHaveBeenCalledWith("select:none", collection);
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
      expect(collection.trigger).toHaveBeenCalledWith("select:none", collection);
    });

    it("should not trigger a reselect:any event", function(){
      expect(collection.trigger).not.toHaveBeenCalledWith("reselect:any", jasmine.any(Array));
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
      expect(collection.trigger).not.toHaveBeenCalledWith("select:none", collection);
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
      expect(collection.trigger).toHaveBeenCalledWith("select:none", collection);
    });

    it("should not trigger a reselect:any event", function(){
      expect(collection.trigger).not.toHaveBeenCalledWith("reselect:any", jasmine.any(Array));
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
      expect(collection.trigger).toHaveBeenCalledWith("select:none", collection);
    });

    it("should not trigger a reselect:any event", function(){
      expect(collection.trigger).not.toHaveBeenCalledWith("reselect:any", jasmine.any(Array));
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
      expect(collection.trigger).toHaveBeenCalledWith("select:none", collection);
    });

    it("should not trigger a reselect:any event", function(){
      expect(collection.trigger).not.toHaveBeenCalledWith("reselect:any", jasmine.any(Array));
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
      expect(collection.trigger).not.toHaveBeenCalledWith("select:none", collection);
    });

    it("should have a selected count of 0", function(){
      expect(collection.selectedLength).toBe(0);
    });

    it("should not have any models in the selected list", function(){
      var size = _.size(collection.selected);
      expect(size).toBe(0);
    });
  });

});
