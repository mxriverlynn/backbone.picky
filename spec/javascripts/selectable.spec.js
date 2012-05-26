describe("selectable model", function(){
  var Model = Backbone.Model.extend({
    initialize: function(){
      var selectable = new Backbone.Picky.Selectable();
      _.extend(this, selectable);
    }
  });

  describe("when selecting a model", function(){
    var model;

    beforeEach(function(){
      model = new Model();
      spyOn(model, "trigger").andCallThrough();

      model.select();
    });

    it("should be selected", function(){
      expect(model.selected).toBe(true);
    });

    it("should notify of selection", function(){
      expect(model.trigger).toHaveBeenCalledWith("selected");
    });
  });

});
