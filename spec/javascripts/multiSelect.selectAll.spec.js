describe("multi-select collection: selectAll", function(){
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
    
    it("should trigger a select:all event", function(){
      expect(collection.trigger).toHaveBeenCalledWithInitial("select:all", collection);
    });

    it("should not trigger a select:some event", function(){
      expect(collection.trigger).not.toHaveBeenCalledWithInitial("select:some", collection);
    });

    it("should not trigger a reselect:any event", function(){
      expect(collection.trigger).not.toHaveBeenCalledWithInitial("reselect:any", jasmine.any(Array));
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
      expect(collection.trigger).not.toHaveBeenCalledWithInitial("select:all", collection);
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
    var m1, m2, collection, reselectedEventState, reselectAnyEventState;

    beforeEach(function(){
      reselectedEventState = { model: {}, collection: {} };
      reselectAnyEventState = { m1: {}, m2: {}, collection: {} };

      m1 = new Model();
      m2 = new Model();

      collection = new Collection([m1, m2]);
      m1.select();

      spyOn(collection, "trigger").andCallThrough();
      m1.on('reselected', function (model) {
        reselectedEventState.model.selected = model && model.selected;
        reselectedEventState.collection.selected = _.clone(collection.selected);
        reselectedEventState.collection.selectedLength = collection.selectedLength;
      });

      collection.on('reselect:any', function () {
        reselectAnyEventState.m1.selected = m1.selected;
        reselectAnyEventState.m2.selected = m2.selected;
        reselectAnyEventState.collection.selected = _.clone(collection.selected);
        reselectAnyEventState.collection.selectedLength = collection.selectedLength;
      });

      collection.selectAll();
    });
    
    it("should trigger a select:all event", function(){
      expect(collection.trigger).toHaveBeenCalledWithInitial("select:all", collection);
    });

    it("should not trigger a select:some event", function(){
      expect(collection.trigger).not.toHaveBeenCalledWithInitial("select:some", collection);
    });

    it("should trigger a reselect:any event, with an array containing the previously selected model as a parameter", function(){
      expect(collection.trigger).toHaveBeenCalledWithInitial("reselect:any", [m1]);
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

    it('should trigger a model\'s reselected event when the collection\'s selected length is consistent with its selected models', function () {
      // m2 doesn't necessarily have to be part of collection.selected at this
      // time. The point is that events are fired when model and collection
      // states are consistent. When m1 fires the 'reselected' event, only m1
      // must be part of the collection.
      expect(reselectedEventState.collection.selectedLength).toBeGreaterThan(0);
      expect(reselectedEventState.collection.selectedLength).toEqual(_.size(reselectedEventState.collection.selected));
    });

    it('should trigger the collection\'s reselect:any event after the model status has been updated', function () {
      expect(reselectAnyEventState.m1.selected).toEqual(true);
      expect(reselectAnyEventState.m2.selected).toEqual(true);
    });

    it('should trigger the collection\'s reselect:any event after the collection\'s selected models have been updated', function () {
      expect(reselectAnyEventState.collection.selected[m1.cid]).toBe(m1);
      expect(reselectAnyEventState.collection.selected[m2.cid]).toBe(m2);
    });

    it('should trigger the collection\'s reselect:any event after the collection\'s selected length has been updated', function () {
      expect(reselectAnyEventState.collection.selectedLength).toBe(2);
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
      expect(collection.trigger).not.toHaveBeenCalledWithInitial("select:all", collection);
    });

    it("should not trigger a reselect:any event", function(){
      expect(collection.trigger).not.toHaveBeenCalledWithInitial("reselect:any");
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
    
    it("should not trigger a select:all event", function(){
      // NB This is a change in the spec. Up to version 0.2.0, it _did_ trigger
      // a select:all event. But an event triggered by a no-op didn't make sense
      // and was inconsistent with the behaviour elsewhere.
      expect(collection.trigger).not.toHaveBeenCalledWithInitial("select:all", collection);
    });

    it("should not trigger a select:some event", function(){
      expect(collection.trigger).not.toHaveBeenCalledWithInitial("select:some", collection);
    });

    it("should trigger a reselect:any event, with an array containing all models as a parameter", function(){
      expect(collection.trigger).toHaveBeenCalledWithInitial("reselect:any", [m1, m2]);
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

    it("should not trigger a select:all event", function(){
      expect(collection.trigger).not.toHaveBeenCalledWithInitial("select:all", collection);
    });

    it("should not trigger a reselect:any event", function(){
      expect(collection.trigger).not.toHaveBeenCalledWithInitial("reselect:any");
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

  describe('custom options', function () {

    describe("when 1 model is selected, and selecting all with a custom option", function(){
      var m1, m2, collection;

      beforeEach(function(){
        m1 = new Model();
        m2 = new Model();

        collection = new Collection([m1, m2]);
        m1.select();

        spyOn(m1, "trigger").andCallThrough();
        spyOn(m2, "trigger").andCallThrough();
        spyOn(collection, "trigger").andCallThrough();

        collection.selectAll({foo: "bar"});
      });

      it("should trigger a reselected event on the first model and pass the options object along as the last parameter", function(){
        expect(m1.trigger).toHaveBeenCalledWith("reselected", m1, {foo: "bar"});
      });

      it("should trigger a selected event on the second model and pass the options object along as the last parameter", function(){
        expect(m2.trigger).toHaveBeenCalledWith("selected", m2, {foo: "bar"});
      });

      it("should trigger a select:all event and pass the options object along as the last parameter", function(){
        expect(collection.trigger).toHaveBeenCalledWith("select:all", collection, {foo: "bar"});
      });

      it("should trigger a reselect:any event and pass the options object along as the last parameter", function(){
        expect(collection.trigger).toHaveBeenCalledWith("reselect:any", [m1], {foo: "bar"});
      });
    });

    describe("when no models are selected, and selecting all with a custom option", function(){
      var m1, m2, collection;

      beforeEach(function(){
        m1 = new Model();
        m2 = new Model();

        collection = new Collection([m1, m2]);
        spyOn(m1, "trigger").andCallThrough();
        spyOn(m2, "trigger").andCallThrough();
        spyOn(collection, "trigger").andCallThrough();

        collection.selectAll({foo: "bar"});
      });

      it("should trigger a selected event on the first model and pass the options object along as the last parameter", function(){
        expect(m1.trigger).toHaveBeenCalledWith("selected", m1, {foo: "bar"});
      });

      it("should trigger a selected event on the second model and pass the options object along as the last parameter", function(){
        expect(m2.trigger).toHaveBeenCalledWith("selected", m2, {foo: "bar"});
      });

      it("should trigger a select:all event and pass the options object along as the last parameter", function(){
        expect(collection.trigger).toHaveBeenCalledWith("select:all", collection, {foo: "bar"});
      });
    });

  });

});
