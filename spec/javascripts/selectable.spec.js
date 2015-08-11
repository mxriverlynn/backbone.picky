describe("selectable model", function(){
  var Model = Backbone.Model.extend({
    initialize: function(){
      var selectable = new Backbone.Picky.Selectable(this);
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
      expect(model.trigger).toHaveBeenCalledWith("selected", model);
    });
  });

  describe("when selecting a model, with options.silent enabled", function(){
    var model;

    beforeEach(function(){
      model = new Model();
      spyOn(model, "trigger").andCallThrough();

      model.select({silent: true});
    });

    it("should be selected", function(){
      expect(model.selected).toBe(true);
    });

    it("should not notify of selection", function(){
      expect(model.trigger).not.toHaveBeenCalledWith("selected", model);
    });
  });

  describe("when selecting a model that is already selected", function(){
    var model;

    beforeEach(function(){
      model = new Model();
      model.select();

      spyOn(model, "trigger").andCallThrough();
      model.select();
    });

    it("should still be selected", function(){
      expect(model.selected).toBe(true);
    });

    it("should not notify of selection", function(){
      expect(model.trigger).not.toHaveBeenCalledWith("selected", model);
    });
  });

  describe("when deselecting a model that has been selected", function(){
    var model;

    beforeEach(function(){
      model = new Model();
      model.select();

      spyOn(model, "trigger").andCallThrough();
      model.deselect();
    });

    it("should not be selected", function(){
      expect(model.selected).toBe(false);
    });

    it("should notify of deselection", function(){
      expect(model.trigger).toHaveBeenCalledWith("deselected", model);
    });
  });

  describe("when deselecting a model that has been selected, with options.silent enabled", function(){
    var model;

    beforeEach(function(){
      model = new Model();
      model.select();

      spyOn(model, "trigger").andCallThrough();
      model.deselect({silent: true});
    });

    it("should not be selected", function(){
      expect(model.selected).toBe(false);
    });

    it("should not notify of deselection", function(){
      expect(model.trigger).not.toHaveBeenCalledWith("deselected", model);
    });
  });

  describe("when deselecting a model that is not selected", function(){
    var model;

    beforeEach(function(){
      model = new Model();

      spyOn(model, "trigger").andCallThrough();
      model.deselect();
    });

    it("should not be selected", function(){
      expect(model.selected).toBeFalsy();
    });

    it("should not notify of deselection", function(){
      expect(model.trigger).not.toHaveBeenCalledWith("deselected", model);
    });
  });

  describe("when toggling the selected status of a model that is selected", function(){
    var model;

    beforeEach(function(){
      model = new Model();
      model.select();

      spyOn(model, "trigger").andCallThrough();
      model.toggleSelected();
    });

    it("should not be selected", function(){
      expect(model.selected).toBe(false);
    });

    it("should notify of deselection", function(){
      expect(model.trigger).toHaveBeenCalledWith("deselected", model);
    });
  });

  describe("when toggling the selected status of a model that is not selected", function(){
    var model;

    beforeEach(function(){
      model = new Model();

      spyOn(model, "trigger").andCallThrough();
      model.toggleSelected();
    });

    it("should be selected", function(){
      expect(model.selected).toBe(true);
    });

    it("should notify of selection", function(){
      expect(model.trigger).toHaveBeenCalledWith("selected", model);
    });
  });

});
