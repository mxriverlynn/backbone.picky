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

  describe("when selecting a model", function(){
    var model, collection;

    beforeEach(function(){
      model = new Model();
      collection = new Collection([model]);

      spyOn(collection, "trigger").andCallThrough();

      model.select();
    });

    it("should hang on to the currently selected model", function(){
      expect(collection.selected).toBe(model);
    });

    it("should trigger a selected event", function(){
      expect(collection.trigger).toHaveBeenCalledWith("selected", model);
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
      expect(collection.trigger).not.toHaveBeenCalledWith("selected", model);
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

      m2.select();
    });

    it("should hang on to the currently selected model", function(){
      expect(collection.selected).toBe(m2);
    });

    it("should trigger a selected event", function(){
      expect(collection.trigger).toHaveBeenCalledWith("selected", m2);
    });

    it("should deselect the first model", function(){
      expect(m1.selected).toBe(false);
    });

    it("should fire a deselect event for the first model", function(){
      expect(collection.trigger).toHaveBeenCalledWith("deselected", m1);
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
      expect(collection.trigger).toHaveBeenCalledWith("deselected", model);
    });
  });

});
