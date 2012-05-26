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
      expect(collection.selected[m1.cid]).not.toBeUndefined();
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
      expect(collection.selected[m1.cid]).not.toBeUndefined();
    });

    it("should have the second selected model in the selected list", function(){
      expect(collection.selected[m2.cid]).not.toBeUndefined();
    });
  });

  describe("when a model is selected and then deselected", function(){
    var m1, collection;

    beforeEach(function(){
      m1 = new Model();

      collection = new Collection([m1]);
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

    it("should not have the model in the selected list", function(){
      expect(collection.selected[m1.cid]).toBeUndefined();
    });
  });

});
