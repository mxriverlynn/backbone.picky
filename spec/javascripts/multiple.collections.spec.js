describe("models shared between multiple collections", function(){

  var Model = Backbone.Model.extend({
    initialize: function(){
      var selectable = new Backbone.Picky.Selectable(this);
      _.extend(this, selectable);
    }
  });

  var SingleSelectCollection = Backbone.Collection.extend({
    model: Model,

    initialize: function(){
      var singleSelect = new Backbone.Picky.SingleSelect(this);
      _.extend(this, singleSelect);
    }
  });
  var MultiSelectCollection = Backbone.Collection.extend({
    model: Model,

    initialize: function(){
      var multiSelect = new Backbone.Picky.MultiSelect(this);
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

  describe("when adding a selected model to additional collections", function(){
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

});
