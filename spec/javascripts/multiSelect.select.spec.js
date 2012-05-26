describe("multi-select collection selecting", function(){
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
  
  describe("when no models are selected, and selecting all", function(){
    var m1, m2, collection;

    beforeEach(function(){
      m1 = new Model();
      m2 = new Model();

      collection = new Collection([m1, m2]);
      spyOn(collection, "trigger").andCallThrough();

      collection.selectAll();
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

  describe("when 1 model is selected, and selecting all", function(){
    var m1, m2, collection;

    beforeEach(function(){
      m1 = new Model();
      m2 = new Model();

      collection = new Collection([m1, m2]);
      m1.select();

      spyOn(collection, "trigger").andCallThrough();
      collection.selectAll();
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

});
