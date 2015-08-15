describe("selectable model", function(){
  var Model = Backbone.Model.extend({
    initialize: function(){
      Backbone.Picky.Selectable.applyTo(this);
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
      expect(model.trigger).toHaveBeenCalledWithInitial("selected", model);
    });

    it("should not trigger a reselected event", function(){
      expect(model.trigger).not.toHaveBeenCalledWithInitial("reselected");
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
      expect(model.trigger).not.toHaveBeenCalledWithInitial("selected");
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
      expect(model.trigger).not.toHaveBeenCalledWithInitial("selected");
    });

    it("should trigger a reselected event", function(){
      expect(model.trigger).toHaveBeenCalledWithInitial("reselected", model);
    });
  });

  describe("when selecting a model that is already selected, with options.silent enabled", function(){
    var model;

    beforeEach(function(){
      model = new Model();
      model.select();

      spyOn(model, "trigger").andCallThrough();
      model.select({silent: true});
    });

    it("should still be selected", function(){
      expect(model.selected).toBe(true);
    });

    it("should not notify of selection", function(){
      expect(model.trigger).not.toHaveBeenCalledWithInitial("selected");
    });

    it("should not trigger a reselected event", function(){
      expect(model.trigger).not.toHaveBeenCalledWithInitial("reselected");
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
      expect(model.trigger).toHaveBeenCalledWithInitial("deselected", model);
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
      expect(model.trigger).not.toHaveBeenCalledWithInitial("deselected");
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
      expect(model.trigger).not.toHaveBeenCalledWithInitial("deselected");
    });

    it("should not trigger a reselected event", function(){
      expect(model.trigger).not.toHaveBeenCalledWithInitial("reselected");
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
      expect(model.trigger).toHaveBeenCalledWithInitial("deselected", model);
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
      expect(model.trigger).toHaveBeenCalledWithInitial("selected", model);
    });
  });

  describe('custom options', function () {

    describe("when selecting a model with a custom option", function () {
      var model;

      beforeEach(function () {
        model = new Model();
        spyOn(model, "trigger").andCallThrough();

        model.select({foo: "bar"});
      });

      it("should trigger a selected event and pass the the options object along as the last parameter", function () {
        expect(model.trigger).toHaveBeenCalledWith("selected", model, {foo: "bar"});
      });
    });

    describe("when re-selecting a model with a custom option", function () {
      var model;

      beforeEach(function () {
        model = new Model();
        model.select();

        spyOn(model, "trigger").andCallThrough();
        model.select({foo: "bar"});
      });

      it("should trigger a reselected event and pass the the options object along as the last parameter", function () {
        expect(model.trigger).toHaveBeenCalledWith("reselected", model, {foo: "bar"});
      });
    });

    describe("when deselecting a model with a custom option", function () {
      var model;

      beforeEach(function () {
        model = new Model();
        model.select();

        spyOn(model, "trigger").andCallThrough();
        model.deselect({foo: "bar"});
      });

      it("should trigger a deselected event and pass the the options object along as the last parameter", function () {
        expect(model.trigger).toHaveBeenCalledWith("deselected", model, {foo: "bar"});
      });
    });

    describe("when toggling the selected status of a model that is selected, with a custom option", function () {
      var model;

      beforeEach(function () {
        model = new Model();
        model.select();

        spyOn(model, "trigger").andCallThrough();
        model.toggleSelected({foo: "bar"});
      });

      it("should trigger a deselected event and pass the the options object along as the last parameter", function () {
        expect(model.trigger).toHaveBeenCalledWith("deselected", model, {foo: "bar"});
      });
    });

    describe("when toggling the selected status of a model that is not selected, with a custom option", function () {
      var model;

      beforeEach(function () {
        model = new Model();

        spyOn(model, "trigger").andCallThrough();
        model.toggleSelected({foo: "bar"});
      });

      it("should trigger a selected event and pass the the options object along as the last parameter", function () {
        expect(model.trigger).toHaveBeenCalledWith("selected", model, {foo: "bar"});
      });
    });

  });

  describe('automatic invocation of onSelect, onDeselect, onReselect handlers', function () {
    var EventHandlingModel, model;

    beforeEach(function () {

      EventHandlingModel = Model.extend({
        onSelect:   function () {},
        onDeselect: function () {},
        onReselect: function () {}
      });

      model = new EventHandlingModel();

      spyOn(model, "onSelect").andCallThrough();
      spyOn(model, "onDeselect").andCallThrough();
      spyOn(model, "onReselect").andCallThrough();
    });

    it('calls the onSelect handler when triggering a selected event on the model', function () {
      model.trigger("selected", model, {foo: "bar"});
      expect(model.onSelect).toHaveBeenCalledWith(model, {foo: "bar"});
    });

    it('calls the onDeselect handler when triggering a deselected event on the model', function () {
      model.trigger("deselected", model, {foo: "bar"});
      expect(model.onDeselect).toHaveBeenCalledWith(model, {foo: "bar"});
    });

    it('calls the onReselect handler when triggering a reselected event on the model', function () {
      model.trigger("reselected", model, {foo: "bar"});
      expect(model.onReselect).toHaveBeenCalledWith(model, {foo: "bar"});
    });
  });

});
