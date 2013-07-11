describe("single select collection", function(){

  var Model = Backbone.Model.extend({
    initialize: function(){
      var selectable = new Backbone.Picky.Selectable();
      _.extend(this, selectable);
    }
  });

  var Collection = Backbone.Collection.extend({
    model: Model,

    initialize: function(){
      var singleSelect = new Backbone.Picky.SingleSelect();
      _.extend(this, singleSelect);
    }
  });

  describe("when selecting a model via the model's select", function(){
    var model, collection;

    beforeEach(function(){
      model = new Model();
      collection = new Collection([model]);

      spyOn(model, "trigger").andCallThrough();
      spyOn(collection, "trigger").andCallThrough();

      model.select();
    });

    it("should hang on to the currently selected model", function(){
      expect(collection.selected).toBe(model);
    });

    it("should trigger a selected event", function(){
      expect(model.trigger).toHaveBeenCalledWith("selected", model);
    });

    it("should trigger a collection selected event", function(){
      expect(collection.trigger).toHaveBeenCalledWith("select:one", model);
    });
  });

  describe("when selecting a model via the collection's select", function(){
    var model, collection;

    beforeEach(function(){
      model = new Model();
      collection = new Collection([model]);

      spyOn(collection, "trigger").andCallThrough();
      spyOn(model, "select").andCallThrough();

      collection.select(model);
    });

    it("should hang on to the currently selected model", function(){
      expect(collection.selected).toBe(model);
    });

    it("should trigger a selected event", function(){
      expect(collection.trigger).toHaveBeenCalledWith("select:one", model);
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

  describe("when a model is selected and deselecting the model", function(){
    var model, collection;

    beforeEach(function(){
      model = new Model();
      collection = new Collection([model]);
      model.select();

      spyOn(collection, "trigger").andCallThrough();

      collection.deselect();
    });

    it("should not hang on to the currently selected model", function(){
      expect(collection.selected).toBeUndefined();
    });

    it("should trigger a deselected event", function(){
      expect(collection.trigger).toHaveBeenCalledWith("deselect:one", model);
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

});
