describe("multi-select selectable interaction", function(){
  var Model = Backbone.Model.extend({
    initialize: function(){
      var selectable = new Backbone.Picky.Selectable();
      _.extend(this, selectable);
    }
  });

  var Collection = Backbone.Collection.extend({
    model: Model,

      initialize: function(){
        var multiSelect = new Backbone.Picky.MultiSelect();
        _.extend(this, multiSelect);
      }
  });

  describe("select / deselect the model directly", function(){

    describe("when 1 out of 2 models in a collection is selected", function(){
      var m1, m2, collection;

      beforeEach(function(){
        m1 = new Model();
        m2 = new Model();

        collection = new Collection([m1, m2]);
        spyOn(collection, "trigger").andCallThrough();

        m1.select();
      });

      it("should trigger 'some' selected event", function(){
        expect(collection.trigger).toHaveBeenCalledWith("select:some", collection);
      });

      it("should have a selected count of 1", function(){
        expect(collection.selectedLength).toBe(1);
      });

      it("should have the selected model in the selected list", function(){
        expect(collection.selected[m1.cid]).toBe(m1);
      });

      it("should not have the unselected model in the selected list", function(){
        expect(collection.selected[m2.cid]).toBeUndefined();
      });

    });

    describe("when 2 out of 2 models in a collection are selected", function(){
      var m1, m2, collection;

      beforeEach(function(){
        m1 = new Model();
        m2 = new Model();

        collection = new Collection([m1, m2]);
        spyOn(collection, "trigger").andCallThrough();

        m1.select();
        m2.select();
      });

      it("should trigger 'all' selected event", function(){
        expect(collection.trigger).toHaveBeenCalledWith("select:all", collection);
      });

      it("should have a selected count of 2", function(){
        expect(collection.selectedLength).toBe(2);
      });

      it("should have the first selected model in the selected list", function(){
        expect(collection.selected[m1.cid]).toBe(m1);
      });

      it("should have the second selected model in the selected list", function(){
        expect(collection.selected[m2.cid]).toBe(m2);
      });
    });

    describe("when a model is selected and then deselected", function(){
      var m1, collection;

      beforeEach(function(){
        m1 = new Model();

        collection = new Collection([m1]);
        spyOn(collection, "trigger").andCallThrough();

        m1.select();
        m1.deselect();
      });

      it("should trigger 'none' selected event", function(){
        expect(collection.trigger).toHaveBeenCalledWith("select:none", collection);
      });

      it("should trigger 'selected' event with the selected model", function(){
        expect(collection.trigger).toHaveBeenCalledWith("selected", m1);
      });

      it("should trigger 'deselected' event with the deselected model", function(){
        expect(collection.trigger).toHaveBeenCalledWith("deselected", m1);
      });

      it("should have a selected count of 0", function(){
        expect(collection.selectedLength).toBe(0);
      });

      it("should not have the model in the selected list", function(){
        expect(collection.selected[m1.cid]).toBeUndefined();
      });
    });

    describe("when 1 out of 2 models in a collection is selected, and selecting the last one via the model's select", function(){
      var m1, m2, collection;

      beforeEach(function(){
        m1 = new Model();
        m2 = new Model();

        collection = new Collection([m1, m2]);
        m1.select();

        spyOn(collection, "trigger").andCallThrough();

        m2.select();
      });

      it("should trigger 'all' selected event", function(){
        expect(collection.trigger).toHaveBeenCalledWith("select:all", collection);
      });

      it("should have a selected count of 2", function(){
        expect(collection.selectedLength).toBe(2);
      });

      it("should have the first selected model in the selected list", function(){
        expect(collection.selected[m1.cid]).toBe(m1);
      });

      it("should have the second selected model in the selected list", function(){
        expect(collection.selected[m2.cid]).toBe(m2);
      });

    });

    describe("when all models are selected and deselecting one via the model's deselect", function(){
      var m1, m2, collection;

      beforeEach(function(){
        m1 = new Model();
        m2 = new Model();

        collection = new Collection([m1, m2]);
        m1.select();
        m2.select();

        spyOn(collection, "trigger").andCallThrough();

        m1.deselect();
      });

      it("should trigger 'some' selected event", function(){
        expect(collection.trigger).toHaveBeenCalledWith("select:some", collection);
      });

      it("should have a selected count of 1", function(){
        expect(collection.selectedLength).toBe(1);
      });

      it("should not have the first selected model in the selected list", function(){
        expect(collection.selected[m1.cid]).toBeUndefined();
      });

      it("should have the second selected model in the selected list", function(){
        expect(collection.selected[m2.cid]).toBe(m2);
      });

    });

    describe("when 1 out of 2 models in a collection is selected, and deselecting the last one via the model's deselect", function(){
      var m1, m2, collection;

      beforeEach(function(){
        m1 = new Model();
        m2 = new Model();

        collection = new Collection([m1, m2]);
        m1.select();

        spyOn(collection, "trigger").andCallThrough();

        m1.deselect();
      });

      it("should trigger 'none' selected event", function(){
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

  });

  describe("select / deselect through the collection", function(){

    describe("when selecting a model through the collection's select method", function(){
      var m1, collection;

      beforeEach(function(){
        m1 = new Model();
        spyOn(m1, "select").andCallThrough();
        collection = new Collection([m1]);

        collection.select(m1);
      });

      it("should select the model", function(){
        expect(m1.select).toHaveBeenCalled();
      });
    });

    describe("when deselecting a model through the collection's select method", function(){
      var m1, collection;

      beforeEach(function(){
        m1 = new Model();
        spyOn(m1, "deselect").andCallThrough();

        collection = new Collection([m1]);
        m1.select();

        collection.deselect(m1);
      });

      it("should deselect the model", function(){
        expect(m1.deselect).toHaveBeenCalled();
      });
    });

    describe("when 1 out of 2 models in a collection is selected, and selecting the last one via the collection's select", function(){
      var m1, m2, collection;

      beforeEach(function(){
        m1 = new Model();
        m2 = new Model();

        collection = new Collection([m1, m2]);
        collection.select(m1);

        spyOn(collection, "trigger").andCallThrough();

        collection.select(m2);
      });

      it("should trigger 'all' selected event", function(){
        expect(collection.trigger).toHaveBeenCalledWith("select:all", collection);
      });

      it("should have a selected count of 2", function(){
        expect(collection.selectedLength).toBe(2);
      });

      it("should have the first selected model in the selected list", function(){
        expect(collection.selected[m1.cid]).toBe(m1);
      });

      it("should have the second selected model in the selected list", function(){
        expect(collection.selected[m2.cid]).toBe(m2);
      });

    });

    describe("when all models are selected and deselecting one via the collection's deselect", function(){
      var m1, m2, collection;

      beforeEach(function(){
        m1 = new Model();
        m2 = new Model();

        collection = new Collection([m1, m2]);
        collection.select(m1);
        collection.select(m2);

        spyOn(collection, "trigger").andCallThrough();

        collection.deselect(m1);
      });

      it("should trigger 'some' selected event", function(){
        expect(collection.trigger).toHaveBeenCalledWith("select:some", collection);
      });

      it("should have a selected count of 1", function(){
        expect(collection.selectedLength).toBe(1);
      });

      it("should not have the first selected model in the selected list", function(){
        expect(collection.selected[m1.cid]).toBeUndefined();
      });

      it("should have the second selected model in the selected list", function(){
        expect(collection.selected[m2.cid]).toBe(m2);
      });

    });

    describe("when 1 out of 2 models in a collection is selected, and deselecting the last one via the collection's deselect", function(){
      var m1, m2, collection;

      beforeEach(function(){
        m1 = new Model();
        m2 = new Model();

        collection = new Collection([m1, m2]);
        collection.select(m1);

        spyOn(collection, "trigger").andCallThrough();

        collection.deselect(m1);
      });

      it("should trigger 'none' selected event", function(){
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

  });

});
