describe("models shared between multiple collections", function(){

  var Model = Backbone.Model.extend({
    initialize: function(){
      var selectable = new Backbone.Picky.Selectable(this);
      _.extend(this, selectable);
    }
  });

  var SingleSelectCollection = Backbone.Collection.extend({
    model: Model,

    initialize: function(models){
      var singleSelect = new Backbone.Picky.SingleSelect(this, models);
      _.extend(this, singleSelect);
    }
  });
  var MultiSelectCollection = Backbone.Collection.extend({
    model: Model,

    initialize: function(models){
      var multiSelect = new Backbone.Picky.MultiSelect(this, models);
      _.extend(this, multiSelect);
    }
  });


  describe("when selecting a model in a single-select collection", function(){
    var model, singleCollectionA, singleCollectionB, multiCollectionA;

    beforeEach(function(){
      model = new Model();
      singleCollectionA = new SingleSelectCollection([model]);
      singleCollectionB = new SingleSelectCollection([model]);
      multiCollectionA  = new MultiSelectCollection([model]);

      singleCollectionA.select(model);
    });

    it("should be selected in the originating collection", function(){
      expect(singleCollectionA.selected).toBe(model);
    });

    it("should be selected in another single-select collection", function(){
      expect(singleCollectionB.selected).toBe(model);
    });

    it("should be among the selected models in another multi-select collection", function(){
      expect(multiCollectionA.selected[model.cid]).not.toBeUndefined();
    });

    it("should be selected itself", function(){
      expect(model.selected).toBe(true);
    });
  });

  describe("when selecting a model in a multi-select collection", function(){
    var model, singleCollectionA, multiCollectionA, multiCollectionB;

    beforeEach(function(){
      model = new Model();
      singleCollectionA = new SingleSelectCollection([model]);
      multiCollectionA  = new MultiSelectCollection([model]);
      multiCollectionB  = new MultiSelectCollection([model]);

      multiCollectionA.select(model);
    });

    it("should be selected in the originating collection", function(){
      expect(multiCollectionA.selected[model.cid]).not.toBeUndefined();
    });

    it("should be selected in another single-select collection", function(){
      expect(singleCollectionA.selected).toBe(model);
    });

    it("should be among the selected models in another multi-select collection", function(){
      expect(multiCollectionB.selected[model.cid]).not.toBeUndefined();
    });

    it("should be selected itself", function(){
      expect(model.selected).toBe(true);
    });
  });

  describe("when selecting a model, which is shared across collections, with its select method", function(){
    var model, singleCollectionA, multiCollectionA;

    beforeEach(function(){
      model = new Model();
      singleCollectionA = new SingleSelectCollection([model]);
      multiCollectionA  = new MultiSelectCollection([model]);

      model.select();
    });

    it("should be selected in a single-select collection", function(){
      expect(singleCollectionA.selected).toBe(model);
    });

    it("should be among the selected models in a multi-select collection", function(){
      expect(multiCollectionA.selected[model.cid]).not.toBeUndefined();
    });

    it("should be selected itself", function(){
      expect(model.selected).toBe(true);
    });
  });

  describe("when creating additional collections with a model that is already selected", function(){
    var model, singleCollectionA, singleCollectionB, multiCollectionA;

    beforeEach(function(){
      model = new Model();
      singleCollectionA = new SingleSelectCollection([model]);
      singleCollectionA.select(model);

      singleCollectionB = new SingleSelectCollection([model]);
      multiCollectionA  = new MultiSelectCollection([model]);
    });

    it("should remain selected in the originating collection", function(){
      expect(singleCollectionA.selected).toBe(model);
    });

    it("should be selected in another single-select collection it is added to", function(){
      expect(singleCollectionB.selected).toBe(model);
    });

    it("should be among the selected models in another multi-select collection it is added to", function(){
      expect(multiCollectionA.selected[model.cid]).not.toBeUndefined();
    });

    it("should remain selected itself", function(){
      expect(model.selected).toBe(true);
    });
  });

  describe("when re-selecting a model shared across collections", function(){
    var model, singleCollectionA, multiCollectionA;

    beforeEach(function(){
      model = new Model();
      singleCollectionA = new SingleSelectCollection([model]);
      multiCollectionA  = new MultiSelectCollection([model]);

      singleCollectionA.select(model);
      model.select();
    });

   it("should remain selected in a single-select collection", function(){
      expect(singleCollectionA.selected).toBe(model);
    });

    it("should remain among the selected models in a multi-select collection", function(){
      expect(multiCollectionA.selected[model.cid]).not.toBeUndefined();
    });

    it("should remain selected itself", function(){
      expect(model.selected).toBe(true);
    });
  });

  describe("when re-selecting a model, which is shared across collections, in a single-select collection", function(){
    var model1, model2, singleCollectionA, multiCollectionA;

    beforeEach(function(){
      model1 = new Model();
      model2 = new Model();
      singleCollectionA = new SingleSelectCollection([model1]);
      multiCollectionA  = new MultiSelectCollection([model1, model2]);

      multiCollectionA.select(model2);
      multiCollectionA.select(model1);

      singleCollectionA.select(model1);
    });

    it("should not deselect other selected models in a multi-select collection", function(){
      expect(multiCollectionA.selected[model2.cid]).not.toBeUndefined();
    });

  });

  describe("when a model is already selected and a different model is selected in a single-select collection", function(){
    var model1, model2, singleCollectionA, singleCollectionB, multiCollectionA;

    beforeEach(function(){
      model1 = new Model();
      model2 = new Model();

      singleCollectionA = new SingleSelectCollection([model1, model2]);
      singleCollectionB = new SingleSelectCollection([model1, model2]);
      multiCollectionA  = new MultiSelectCollection([model1, model2]);

      model1.select();
      singleCollectionA.select(model2);
    });

    it("should be selected in the originating collection", function(){
      expect(singleCollectionA.selected).toBe(model2);
    });

    it("should be selected in another single-select collection", function(){
      expect(singleCollectionB.selected).toBe(model2);
    });

    it("should be selected in another multi-select collection", function(){
      expect(multiCollectionA.selected[model2.cid]).not.toBeUndefined();
    });

    it("should be selected itself", function(){
      expect(model2.selected).toBe(true);
    });

    it("should deselect the first model", function(){
      expect(model1.selected).toBe(false);
    });

    it("should deselect the first model in another multi-select collection", function(){
      expect(multiCollectionA.selected[model1.cid]).toBeUndefined();
    });
  });

  describe("when a model is already selected and a different model is selected with its select method", function(){

    describe("when both models are shared among multi-select collections only", function() {
      var model1, model2, multiCollectionA, multiCollectionB;

      beforeEach(function(){
        model1 = new Model();
        model2 = new Model();

        multiCollectionA  = new MultiSelectCollection([model1, model2]);
        multiCollectionB  = new MultiSelectCollection([model1, model2]);

        model1.select();
        model2.select();
      });

     it("should be selected in all collections", function(){
       expect(multiCollectionA.selected[model2.cid]).not.toBeUndefined();
       expect(multiCollectionB.selected[model2.cid]).not.toBeUndefined();
     });

     it("should leave the first model selected in all collections", function(){
       expect(multiCollectionA.selected[model1.cid]).not.toBeUndefined();
       expect(multiCollectionB.selected[model1.cid]).not.toBeUndefined();
     });
    });

    describe("when both models are shared, with at least one single-select collection among the collections", function() {
      // As soon as both models are part of a single-select collection, only one of them can be flagged as selected.
      // That even extends to multi-select collections sharing those models.
      var model1, model2, singleCollectionA, multiCollectionA;

      beforeEach(function(){
        model1 = new Model();
        model2 = new Model();

        singleCollectionA = new SingleSelectCollection([model1, model2]);
        multiCollectionA  = new MultiSelectCollection([model1, model2]);

        model1.select();
        model2.select();
      });

      it("should be selected in the single-select collection", function(){
        expect(singleCollectionA.selected).toBe(model2);
      });

      it("should be selected in the multi-select collection", function(){
        expect(multiCollectionA.selected[model2.cid]).not.toBeUndefined();
      });

      it("should deselect the first model", function(){
        expect(model1.selected).toBe(false);
      });

      it("should deselect the first model in the multi-select collection", function(){
        expect(multiCollectionA.selected[model1.cid]).toBeUndefined();
      });
    });

    describe("when the first model is shared with at least one single-select collection, but not the second", function() {
      var model1, model2, singleCollectionA, multiCollectionA;

      beforeEach(function(){
        model1 = new Model();
        model2 = new Model();

        singleCollectionA = new SingleSelectCollection([model1]);
        multiCollectionA  = new MultiSelectCollection([model1, model2]);

        model1.select();
        model2.select();
      });

      it("should be selected itself", function(){
        expect(model2.selected).toBe(true);
      });

      it("should be selected in the multi-select collection", function(){
        expect(multiCollectionA.selected[model2.cid]).not.toBeUndefined();
      });

      it("should leave the first model selected", function(){
        expect(model1.selected).toBe(true);
      });

      it("should leave the first model selected in the single-select collection", function(){
        expect(singleCollectionA.selected).toBe(model1);
      });

      it("should leave the first model selected in the multi-select collection", function(){
        expect(multiCollectionA.selected[model1.cid]).not.toBeUndefined();
      });
    });

    describe("when the second model is shared with at least one single-select collection, but not the first", function() {

      var model1, model2, singleCollectionA, multiCollectionA;

      beforeEach(function(){
        model1 = new Model();
        model2 = new Model();

        singleCollectionA = new SingleSelectCollection([model2]);
        multiCollectionA  = new MultiSelectCollection([model1, model2]);

        model1.select();
        model2.select();
      });

      it("should be selected itself", function(){
        expect(model2.selected).toBe(true);
      });

      it("should be selected in the single-select collection", function(){
        expect(singleCollectionA.selected).toBe(model2);
      });

      it("should be selected in the multi-select collection", function(){
        expect(multiCollectionA.selected[model2.cid]).not.toBeUndefined();
      });

      it("should leave the first model selected", function(){
        expect(model1.selected).toBe(true);
      });

      it("should leave the first model selected in the multi-select collection", function(){
        expect(multiCollectionA.selected[model1.cid]).not.toBeUndefined();
      });
    });
  });

  describe("when a model is selected and deselect is called in a single-select collection", function(){
    var model1, model2, singleCollectionA, singleCollectionB, multiCollectionA;

    beforeEach(function(){
      model1 = new Model();
      model2 = new Model();
      singleCollectionA = new SingleSelectCollection([model1]);
      singleCollectionB = new SingleSelectCollection([model1]);
      multiCollectionA  = new MultiSelectCollection([model1, model2]);

      multiCollectionA.select(model2);
      singleCollectionA.select(model1);

      singleCollectionA.deselect();
    });

    it("should be deselected in the originating collection", function(){
      expect(singleCollectionA.selected).toBeUndefined();
    });

    it("should be deselected in another single-select collection", function(){
      expect(singleCollectionB.selected).toBeUndefined();
    });

    it("should be deselected in another multi-select collection", function(){
      expect(multiCollectionA.selected[model1.cid]).toBeUndefined();
    });

    it("should not deselected another selected model in a multi-select collection", function(){
      expect(multiCollectionA.selected[model2.cid]).not.toBeUndefined();
    });

    it("should be deselected itself", function(){
      expect(model1.selected).toBe(false);
    });
  });

  describe("when a selected model is deselected in a multi-select collection", function(){
    var model1, model2, singleCollectionA, singleCollectionB, multiCollectionA, multiCollectionB;

    beforeEach(function(){
      model1 = new Model();
      model2 = new Model();
      singleCollectionA = new SingleSelectCollection([model1]);
      singleCollectionB = new SingleSelectCollection([model2]);
      multiCollectionA  = new MultiSelectCollection([model1, model2]);
      multiCollectionB  = new MultiSelectCollection([model1, model2]);

      multiCollectionA.select(model2);
      multiCollectionA.select(model1);

      multiCollectionA.deselect(model1);
    });

    it("should be deselected in the originating collection", function(){
      expect(multiCollectionA.selected[model1.cid]).toBeUndefined();
    });

    it("should be deselected in another single-select collection which shares the model", function(){
      expect(singleCollectionA.selected).toBeUndefined();
    });

    it("should be deselected in another multi-select collection", function(){
      expect(multiCollectionB.selected[model1.cid]).toBeUndefined();
    });

    it("should be deselected itself", function(){
      expect(model1.selected).toBe(false);
    });

    it("should not deselect another selected model in a multi-select collection", function(){
      expect(multiCollectionA.selected[model2.cid]).not.toBeUndefined();
    });

    it("should not deselect another selected model which is shared between a multi-select collection and a single-select collection", function () {
      expect(singleCollectionB.selected).toBe(model2);
    });
  });

  describe("when a selected model is added", function(){
    var model1, model2, model3, model4,
        singleCollectionA, multiCollectionA;

    beforeEach(function(){
      model1 = new Model();
      model2 = new Model();
      model3 = new Model();
      model4 = new Model();

      singleCollectionA = new SingleSelectCollection([model1]);
      multiCollectionA  = new MultiSelectCollection([model1, model2, model3]);

      model1.select();
      model2.select();
      model3.select();
      model4.select();
    });

    it("should be selected in a single-select collection it is added to", function(){
      singleCollectionA.add(model2);
      expect(singleCollectionA.selected).toBe(model2);
    });

    it("should deselect any previously selected model in a single-select collection", function(){
      singleCollectionA.add(model2);
      expect(model1.selected).toBe(false);
    });

    it("should be added to the selected models in a multi-select collection", function(){
      multiCollectionA.add(model4);
      expect(multiCollectionA.selected[model4.cid]).not.toBeUndefined();
    });

    it("should deselect other selected models in a multi-select collection if they are shared with the single-select collection the new model is added to", function(){
      singleCollectionA.add(model2);
      expect(multiCollectionA.selected[model1.cid]).toBeUndefined();
    });

    it("should leave other selected models untouched in a multi-select collection, provided they are not shared with the single-select collection the new model is added to", function(){
      singleCollectionA.add(model2);
      expect(multiCollectionA.selected[model3.cid]).not.toBeUndefined();
    });

    it("should remain selected itself", function(){
      singleCollectionA.add(model2);
      expect(model2.selected).toBe(true);
    });
  });

  describe("when a selected model is removed", function(){
    var model1, model2,
        singleCollectionA, multiCollectionA;

    beforeEach(function(){
      model1 = new Model();
      model2 = new Model();

      singleCollectionA = new SingleSelectCollection([model1, model2]);
      multiCollectionA  = new MultiSelectCollection([model1, model2]);

      model1.select();
    });

    it("should no longer be selected in a single-select collection", function(){
      singleCollectionA.remove(model1);
      expect(singleCollectionA.selected).toBeUndefined();
    });

    it("should no longer be selected in a multi-select collection", function(){
      multiCollectionA.remove(model1);
      expect(multiCollectionA.selected[model1.cid]).toBeUndefined();
    });

    it("should no longer be selected if removed from all collections", function(){
      singleCollectionA.remove(model1);
      multiCollectionA.remove(model1);
      expect(model1.selected).toBe(false);
    });

    it("should no longer be selected if removed from all collections, even if it had accidentally been re-added to a collection already holding it", function(){
      // This is to make sure that the reference counting, which is going on behind the scenes, does not get out of
      // step.
      singleCollectionA.add(model1);      // model is already part of the collection, adding it for the second time
      multiCollectionA.add(model1);       // adding the model for the second time

      singleCollectionA.remove(model1);
      multiCollectionA.remove(model1);
      expect(model1.selected).toBe(false);
    });

    it("should remain selected in those collections it has not been removed from (removed from single-select)", function(){
      singleCollectionA.remove(model1);
      expect(multiCollectionA.selected[model1.cid]).not.toBeUndefined();
    });

    it("should remain selected in those collections it has not been removed from (removed from multi-select)", function(){
      multiCollectionA.remove(model1);
      expect(singleCollectionA.selected).toBe(model1);
    });

    it("should remain selected itself if not removed from all collections", function(){
      singleCollectionA.remove(model1);
      expect(model1.selected).toBe(true);
    });
  });

  describe("when a selected model is added by resetting the collection", function(){
    var model1, model2, model3,
      singleCollectionA, singleCollectionB, multiCollectionA;

    beforeEach(function(){
      model1 = new Model();
      model2 = new Model();
      model3 = new Model();

      singleCollectionA = new SingleSelectCollection([model1]);
      singleCollectionB = new SingleSelectCollection([model3]);
      multiCollectionA  = new MultiSelectCollection([model1, model2, model3]);

      model1.select();
      model2.select();
      model3.select();

      spyOn(model1, "trigger").andCallThrough();
      spyOn(model2, "trigger").andCallThrough();
      spyOn(singleCollectionA, "trigger").andCallThrough();
      spyOn(multiCollectionA, "trigger").andCallThrough();
    });

    it("should be selected in a single-select collection it is added to", function(){
      singleCollectionA.reset([model1]);
      expect(singleCollectionA.selected).toBe(model1);
    });

    it("should be selected in a single-select collection if multiple models with selected status are added, and it is the last of them", function(){
      singleCollectionA.reset([model1, model2]);
      expect(model2.selected).toBe(true);
      expect(singleCollectionA.selected).toBe(model2);
    });

    it("should be deselected in a single-select collection if multiple models with selected status are added, and it is not the last of them", function(){
      singleCollectionA.reset([model1, model2]);
      expect(model1.selected).toBe(false);
    });

    it("should be added to the selected models in a multi-select collection (being the first of multiple selected models)", function(){
      multiCollectionA.reset([model1, model3]);
      expect(multiCollectionA.selected[model1.cid]).not.toBeUndefined();
    });

    it("should be added to the selected models in a multi-select collection (being the last of multiple selected models)", function(){
      multiCollectionA.reset([model1, model3]);
      expect(multiCollectionA.selected[model3.cid]).not.toBeUndefined();
    });

    it("should deselect other selected models in a multi-select collection if they are shared with the single-select collection the new model is added to", function(){
      singleCollectionA.reset([model1, model2]);
      expect(multiCollectionA.selected[model1.cid]).toBeUndefined();
    });

    it("should leave other selected models untouched in a multi-select collection, provided they are not shared with the single-select collection the new model is added to", function(){
      singleCollectionA.reset([model1, model2]);
      expect(multiCollectionA.selected[model3.cid]).not.toBeUndefined();
    });

    it("should become deselected if it is not part of any other collections, and is being re-added to the original collection (single-select)", function(){
      // By resetting the collection, the selected model is first removed, then re-added. If the model is not part of
      // any other collection, it loses its 'selected' status while being removed.
      //
      // This is expected behaviour, and it serves a purpose. A reset, with models which are not shared by any other
      // collection, should provide a clean slate.
      multiCollectionA.reset();
      singleCollectionA.reset([model1]);
      expect(model1.selected).toBe(false);
      expect(singleCollectionA.selected).toBeUndefined();
    });

    it("should become deselected if it is not part of any other collections, and is being re-added to the original collection (multi-select)", function(){
      // The model loses its 'selected' status while being removed. See comment above.
      singleCollectionA.reset();
      multiCollectionA.reset([model1, model2]);
      expect(model1.selected).toBe(false);
      expect(model2.selected).toBe(false);
      expect(multiCollectionA.selected).toEqual({});
    });

    it('should not trigger a selected/select:one event when added to a single-select collection', function () {
      singleCollectionA.reset([model1]);
      expect(model1.trigger).not.toHaveBeenCalledWith("selected", model1);
      expect(singleCollectionA.trigger).not.toHaveBeenCalledWith("select:one", model1);
    });

    it('should not trigger a selected/select:some/select:all event when added to a multi-select collection', function () {
      multiCollectionA.reset([model1]);
      expect(model1.trigger).not.toHaveBeenCalledWith("selected", model1);
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWith("select:some", multiCollectionA);
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWith("select:all", multiCollectionA);
    });

    it('should trigger a deselected/select:some event when the reset is inducing a deselection in another multi-select collection', function () {
      singleCollectionA.reset([model1, model2]);
      expect(model2.trigger).not.toHaveBeenCalledWith("deselected", model1);
      expect(multiCollectionA.trigger).toHaveBeenCalledWith("select:some", multiCollectionA);
    });

    it("should remain selected itself", function(){
      singleCollectionA.reset([model1]);
      expect(model1.selected).toBe(true);
    });
  });

  describe("when a selected model is removed by resetting the collection", function(){
    var model1, model2,
      singleCollectionA, multiCollectionA;

    beforeEach(function(){
      model1 = new Model();
      model2 = new Model();

      singleCollectionA = new SingleSelectCollection([model1, model2]);
      multiCollectionA  = new MultiSelectCollection([model1, model2]);

      model1.select();

      spyOn(model1, "trigger").andCallThrough();
      spyOn(singleCollectionA, "trigger").andCallThrough();
      spyOn(multiCollectionA, "trigger").andCallThrough();
    });

    it("should no longer be selected in a single-select collection", function(){
      singleCollectionA.reset();
      expect(singleCollectionA.selected).toBeUndefined();
    });

    it("should no longer be selected in a multi-select collection", function(){
      multiCollectionA.reset();
      expect(multiCollectionA.selected[model1.cid]).toBeUndefined();
    });

    it("should no longer be selected if removed from all collections", function(){
      singleCollectionA.reset();
      multiCollectionA.reset();
      expect(model1.selected).toBe(false);
    });

    it("should remain selected in those collections it has not been removed from (removed from single-select)", function(){
      singleCollectionA.reset();
      expect(multiCollectionA.selected[model1.cid]).not.toBeUndefined();
    });

    it("should remain selected in those collections it has not been removed from (removed from multi-select)", function(){
      multiCollectionA.reset();
      expect(singleCollectionA.selected).toBe(model1);
    });

    it("should remain selected itself if not removed from all collections", function(){
      singleCollectionA.reset();
      expect(model1.selected).toBe(true);
    });

    it('should not trigger a deselected/deselect:one event when removed from a single-select collection', function () {
      singleCollectionA.reset();
      expect(model1.trigger).not.toHaveBeenCalledWith("deselected", model1);
      expect(singleCollectionA.trigger).not.toHaveBeenCalledWith("deselect:one", model1);
    });

    it('should not trigger a deselected/select:none event when removed from a multi-select collection', function () {
      multiCollectionA.reset();
      expect(model1.trigger).not.toHaveBeenCalledWith("deselected", model1);
      expect(model1.trigger).not.toHaveBeenCalledWith("deselected", model2);
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWith("select:none", multiCollectionA);
    });

    it('should not trigger a deselected/deselect:one event when removed from all collections, single-select collection last', function () {
      multiCollectionA.reset();
      singleCollectionA.reset();
      expect(model1.trigger).not.toHaveBeenCalledWith("deselected", model1);
      expect(singleCollectionA.trigger).not.toHaveBeenCalledWith("deselect:one", model1);
    });

    it('should not trigger a deselected/select:none event when removed from all collections, multi-select collection last', function () {
      singleCollectionA.reset();
      multiCollectionA.reset();
      expect(model1.trigger).not.toHaveBeenCalledWith("deselected", model1);
      expect(model1.trigger).not.toHaveBeenCalledWith("deselected", model2);
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWith("select:none", multiCollectionA);
    });
  });

});
