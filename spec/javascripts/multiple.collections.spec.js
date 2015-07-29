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

      spyOn(model, "trigger").andCallThrough();
      spyOn(singleCollectionA, "trigger").andCallThrough();
      spyOn(singleCollectionB, "trigger").andCallThrough();
      spyOn(multiCollectionA, "trigger").andCallThrough();

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

    it('should trigger a selected event on the model', function () {
      expect(model.trigger).toHaveBeenCalledWithInitial("selected", model);
    });

    it('should trigger a select:one event on the originating collection', function () {
      expect(singleCollectionA.trigger).toHaveBeenCalledWithInitial("select:one", model);
    });

    it('should trigger a select:one event on another single-select collection', function () {
      expect(singleCollectionB.trigger).toHaveBeenCalledWithInitial("select:one", model);
    });

    it('should trigger a select:some or selected:all event on another multi-select collection', function () {
      expect(multiCollectionA.trigger).toHaveBeenCalledWithInitial("select:all", multiCollectionA);
    });

    it('should not trigger a reselected event on the model', function () {
      expect(model.trigger).not.toHaveBeenCalledWithInitial("reselected", model);
    });

    it("should not trigger a reselect:one event on the originating collection", function(){
      expect(singleCollectionA.trigger).not.toHaveBeenCalledWithInitial("reselect:one", model);
    });

    it("should not trigger a reselect:one event on another single-select collection", function(){
      expect(singleCollectionB.trigger).not.toHaveBeenCalledWithInitial("reselect:one", model);
    });

    it("should not trigger a reselect:any event on another multi-select collection", function(){
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("reselect:any");
    });
  });

  describe("when selecting a model in a single-select collection, with options.silent enabled", function(){
    var model, singleCollectionA, singleCollectionB, multiCollectionA;

    beforeEach(function(){
      model = new Model();
      singleCollectionA = new SingleSelectCollection([model]);
      singleCollectionB = new SingleSelectCollection([model]);
      multiCollectionA  = new MultiSelectCollection([model]);

      spyOn(model, "trigger").andCallThrough();
      spyOn(singleCollectionA, "trigger").andCallThrough();
      spyOn(singleCollectionB, "trigger").andCallThrough();
      spyOn(multiCollectionA, "trigger").andCallThrough();

      singleCollectionA.select(model, {silent: true});
    });

    it("should be selected in another single-select collection", function(){
      expect(singleCollectionB.selected).toBe(model);
    });

    it("should be among the selected models in another multi-select collection", function(){
      expect(multiCollectionA.selected[model.cid]).not.toBeUndefined();
    });

    it('should not trigger a selected event on the model', function () {
      expect(model.trigger).not.toHaveBeenCalledWithInitial("selected", model);
    });

    it('should not trigger a select:one event on the originating collection', function () {
      expect(singleCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:one", model);
    });

    it('should not trigger a select:one event on another single-select collection', function () {
      expect(singleCollectionB.trigger).not.toHaveBeenCalledWithInitial("select:one", model);
    });

    it('should not trigger a select:some or selected:all event on another multi-select collection', function () {
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:some", multiCollectionA);
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:all", multiCollectionA);
    });
  });

  describe("when selecting a model in a multi-select collection", function(){
    var model, singleCollectionA, multiCollectionA, multiCollectionB;

    beforeEach(function(){
      model = new Model();
      singleCollectionA = new SingleSelectCollection([model]);
      multiCollectionA  = new MultiSelectCollection([model]);
      multiCollectionB  = new MultiSelectCollection([model]);

      spyOn(model, "trigger").andCallThrough();
      spyOn(singleCollectionA, "trigger").andCallThrough();
      spyOn(multiCollectionA, "trigger").andCallThrough();
      spyOn(multiCollectionB, "trigger").andCallThrough();

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

    it('should trigger a selected event on the model', function () {
      expect(model.trigger).toHaveBeenCalledWithInitial("selected", model);
    });

    it('should trigger a select:some or selected:all event on the originating collection', function () {
      expect(multiCollectionA.trigger).toHaveBeenCalledWithInitial("select:all", multiCollectionA);
    });

    it('should trigger a select:one event on another single-select collection', function () {
      expect(singleCollectionA.trigger).toHaveBeenCalledWithInitial("select:one", model);
    });

    it('should trigger a select:some or selected:all event on another multi-select collection', function () {
      expect(multiCollectionB.trigger).toHaveBeenCalledWithInitial("select:all", multiCollectionB);
    });

    it('should not trigger a reselected event on the model', function () {
      expect(model.trigger).not.toHaveBeenCalledWithInitial("reselected", model);
    });

    it("should not trigger a reselect:any event on the originating collection", function(){
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("reselect:any");
    });

    it("should not trigger a reselect:one event on another single-select collection", function(){
      expect(singleCollectionA.trigger).not.toHaveBeenCalledWithInitial("reselect:one", model);
    });

    it("should not trigger a reselect:any event on another multi-select collection", function(){
      expect(multiCollectionB.trigger).not.toHaveBeenCalledWithInitial("reselect:any");
    });
  });

  describe("when selecting a model in a multi-select collection, with options.silent enabled", function(){
    var model, singleCollectionA, multiCollectionA, multiCollectionB;

    beforeEach(function(){
      model = new Model();
      singleCollectionA = new SingleSelectCollection([model]);
      multiCollectionA  = new MultiSelectCollection([model]);
      multiCollectionB  = new MultiSelectCollection([model]);

      spyOn(model, "trigger").andCallThrough();
      spyOn(singleCollectionA, "trigger").andCallThrough();
      spyOn(multiCollectionA, "trigger").andCallThrough();
      spyOn(multiCollectionB, "trigger").andCallThrough();

      multiCollectionA.select(model, {silent: true});
    });

    it("should be selected in another single-select collection", function(){
      expect(singleCollectionA.selected).toBe(model);
    });

    it("should be among the selected models in another multi-select collection", function(){
      expect(multiCollectionB.selected[model.cid]).not.toBeUndefined();
    });

    it('should not trigger a selected event on the model', function () {
      expect(model.trigger).not.toHaveBeenCalledWithInitial("selected", model);
    });

    it('should not trigger a select:some or selected:all event on the originating collection', function () {
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:some", multiCollectionA);
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:all", multiCollectionA);
    });

    it('should not trigger a select:one event on another single-select collection', function () {
      expect(singleCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:one", model);
    });

    it('should not trigger a select:some or selected:all event on another multi-select collection', function () {
      expect(multiCollectionB.trigger).not.toHaveBeenCalledWithInitial("select:some", multiCollectionB);
      expect(multiCollectionB.trigger).not.toHaveBeenCalledWithInitial("select:all", multiCollectionB);
    });
  });

  describe("when selecting a model, which is shared across collections, with its select method", function(){
    var model, singleCollectionA, multiCollectionA;

    beforeEach(function(){
      model = new Model();
      singleCollectionA = new SingleSelectCollection([model]);
      multiCollectionA  = new MultiSelectCollection([model]);

      spyOn(model, "trigger").andCallThrough();
      spyOn(singleCollectionA, "trigger").andCallThrough();
      spyOn(multiCollectionA, "trigger").andCallThrough();

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

    it('should trigger a selected event on the model', function () {
      expect(model.trigger).toHaveBeenCalledWithInitial("selected", model);
    });

    it('should trigger a select:one event on the single-select collection', function () {
      expect(singleCollectionA.trigger).toHaveBeenCalledWithInitial("select:one", model);
    });

    it('should trigger a select:some or selected:all event on the multi-select collection', function () {
      expect(multiCollectionA.trigger).toHaveBeenCalledWithInitial("select:all", multiCollectionA);
    });

    it('should not trigger a reselected event on the model', function () {
      expect(model.trigger).not.toHaveBeenCalledWithInitial("reselected", model);
    });

    it("should not trigger a reselect:one event on the single-select collection", function(){
      expect(singleCollectionA.trigger).not.toHaveBeenCalledWithInitial("reselect:one", model);
    });

    it("should not trigger a reselect:any event on the multi-select collection", function(){
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("reselect:any");
    });
  });

  describe("when selecting a model, which is shared across collections, with its select method and options.silent enabled", function(){
    var model, singleCollectionA, multiCollectionA;

    beforeEach(function(){
      model = new Model();
      singleCollectionA = new SingleSelectCollection([model]);
      multiCollectionA  = new MultiSelectCollection([model]);

      spyOn(model, "trigger").andCallThrough();
      spyOn(singleCollectionA, "trigger").andCallThrough();
      spyOn(multiCollectionA, "trigger").andCallThrough();

      model.select({silent: true});
    });

    it("should be selected in a single-select collection", function(){
      expect(singleCollectionA.selected).toBe(model);
    });

    it("should be among the selected models in a multi-select collection", function(){
      expect(multiCollectionA.selected[model.cid]).not.toBeUndefined();
    });

    it('should not trigger a selected event on the model', function () {
      expect(model.trigger).not.toHaveBeenCalledWithInitial("selected", model);
    });

    it('should not trigger a select:one event on the single-select collection', function () {
      expect(singleCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:one", model);
    });

    it('should not trigger a select:some or selected:all event on the multi-select collection', function () {
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:some", multiCollectionA);
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:all", multiCollectionA);
    });
  });

  describe("when re-selecting a model in a single-select collection", function(){
    var model1, model2, singleCollectionA, singleCollectionB, multiCollectionA;

    beforeEach(function(){
      model1 = new Model();
      model2 = new Model();
      singleCollectionA = new SingleSelectCollection([model1]);
      singleCollectionB = new SingleSelectCollection([model1]);
      multiCollectionA  = new MultiSelectCollection([model1, model2]);

      multiCollectionA.select(model2);
      multiCollectionA.select(model1);


      spyOn(model1, "trigger").andCallThrough();
      spyOn(singleCollectionA, "trigger").andCallThrough();
      spyOn(singleCollectionB, "trigger").andCallThrough();
      spyOn(multiCollectionA, "trigger").andCallThrough();

      singleCollectionA.select(model1);
    });

    it("should not deselect other selected models in a multi-select collection", function(){
      expect(multiCollectionA.selected[model2.cid]).not.toBeUndefined();
    });

    it('should not trigger a selected event on the model', function () {
      expect(model1.trigger).not.toHaveBeenCalledWithInitial("selected", model1);
    });

    it('should not trigger a select:one event on the originating collection', function () {
      expect(singleCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:one", model1);
    });

    it('should not trigger a select:one event on another single-select collection', function () {
      expect(singleCollectionB.trigger).not.toHaveBeenCalledWithInitial("select:one", model1);
    });

    it('should not trigger a select:some or selected:all event on another multi-select collection', function () {
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:some", multiCollectionA);
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:all", multiCollectionA);
    });

    it('should trigger a reselected event on the model', function () {
      expect(model1.trigger).toHaveBeenCalledWithInitial("reselected", model1);
    });

    it("should trigger a reselect:one event on the originating collection", function(){
      expect(singleCollectionA.trigger).toHaveBeenCalledWithInitial("reselect:one", model1);
    });

    it("should trigger a reselect:one event on another single-select collection", function(){
      expect(singleCollectionB.trigger).toHaveBeenCalledWithInitial("reselect:one", model1);
    });

    it("should trigger a reselect:any event on another multi-select collection, with an array containing the model as second parameter", function(){
      expect(multiCollectionA.trigger).toHaveBeenCalledWithInitial("reselect:any", [model1]);
    });
  });

  describe("when re-selecting a model in a single-select collection, with options.silent enabled", function(){
    var model1, model2, singleCollectionA, singleCollectionB, multiCollectionA;

    beforeEach(function(){
      model1 = new Model();
      model2= new Model();
      singleCollectionA = new SingleSelectCollection([model1, model2]);
      singleCollectionB = new SingleSelectCollection([model1, model2]);
      multiCollectionA  = new MultiSelectCollection([model1, model2]);

      singleCollectionA.select(model1);

      spyOn(model1, "trigger").andCallThrough();
      spyOn(singleCollectionA, "trigger").andCallThrough();
      spyOn(singleCollectionB, "trigger").andCallThrough();
      spyOn(multiCollectionA, "trigger").andCallThrough();

      singleCollectionA.select(model1, {silent: true});
    });

    it('should not trigger a selected event on the model', function () {
      expect(model1.trigger).not.toHaveBeenCalledWithInitial("selected", model1);
    });

    it('should not trigger a select:one event on the originating collection', function () {
      expect(singleCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:one", model1);
    });

    it('should not trigger a select:one event on another single-select collection', function () {
      expect(singleCollectionB.trigger).not.toHaveBeenCalledWithInitial("select:one", model1);
    });

    it('should not trigger a select:some or selected:all event on another multi-select collection', function () {
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:some", multiCollectionA);
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:all", multiCollectionA);
    });

    it('should not trigger a reselected event on the model', function () {
      expect(model1.trigger).not.toHaveBeenCalledWithInitial("reselected", model1);
    });

    it("should not trigger a reselect:one event on the originating collection", function(){
      expect(singleCollectionA.trigger).not.toHaveBeenCalledWithInitial("reselect:one", model1);
    });

    it("should not trigger a reselect:one event on another single-select collection", function(){
      expect(singleCollectionB.trigger).not.toHaveBeenCalledWithInitial("reselect:one", model1);
    });

    it("should not trigger a reselect:any event on another multi-select collection", function(){
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("reselect:any");
    });
  });

  describe("when re-selecting a model in a multi-select collection", function(){
    var model1, model2, singleCollectionA, multiCollectionA, multiCollectionB;

    beforeEach(function(){
      model1 = new Model();
      model2 = new Model();
      singleCollectionA = new SingleSelectCollection([model1, model2]);
      multiCollectionA  = new MultiSelectCollection([model1, model2]);
      multiCollectionB  = new MultiSelectCollection([model1, model2]);

      multiCollectionA.select(model1);

      spyOn(model1, "trigger").andCallThrough();
      spyOn(singleCollectionA, "trigger").andCallThrough();
      spyOn(multiCollectionA, "trigger").andCallThrough();
      spyOn(multiCollectionB, "trigger").andCallThrough();

      multiCollectionA.select(model1);
    });

    it('should not trigger a selected event on the model', function () {
      expect(model1.trigger).not.toHaveBeenCalledWithInitial("selected", model1);
    });

    it('should not trigger a select:some or selected:all event on the originating collection', function () {
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:some", multiCollectionA);
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:all", multiCollectionA);
    });

    it('should not trigger a select:one event on another single-select collection', function () {
      expect(singleCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:one", model1);
    });

    it('should not trigger a select:some or selected:all event on another multi-select collection', function () {
      expect(multiCollectionB.trigger).not.toHaveBeenCalledWithInitial("select:some", multiCollectionB);
      expect(multiCollectionB.trigger).not.toHaveBeenCalledWithInitial("select:all", multiCollectionB);
    });

    it('should trigger a reselected event on the model', function () {
      expect(model1.trigger).toHaveBeenCalledWithInitial("reselected", model1);
    });

    it("should trigger a reselect:any event on the originating collection, with an array containing the model as second parameter", function(){
      expect(multiCollectionA.trigger).toHaveBeenCalledWithInitial("reselect:any", [model1]);
    });

    it("should trigger a reselect:one event on another single-select collection", function(){
      expect(singleCollectionA.trigger).toHaveBeenCalledWithInitial("reselect:one", model1);
    });

    it("should trigger a reselect:any event on another multi-select collection, with an array containing the model as second parameter", function(){
      expect(multiCollectionB.trigger).toHaveBeenCalledWithInitial("reselect:any", [model1]);
    });
  });

  describe("when re-selecting a model in a multi-select collection, with options.silent enabled", function(){
    var model1, model2, singleCollectionA, multiCollectionA, multiCollectionB;

    beforeEach(function(){
      model1 = new Model();
      model2 = new Model();
      singleCollectionA = new SingleSelectCollection([model1, model2]);
      multiCollectionA  = new MultiSelectCollection([model1, model2]);
      multiCollectionB  = new MultiSelectCollection([model1, model2]);

      multiCollectionA.select(model1);

      spyOn(model1, "trigger").andCallThrough();
      spyOn(singleCollectionA, "trigger").andCallThrough();
      spyOn(multiCollectionA, "trigger").andCallThrough();
      spyOn(multiCollectionB, "trigger").andCallThrough();

      multiCollectionA.select(model1, {silent: true});
    });

    it('should not trigger a selected event on the model', function () {
      expect(model1.trigger).not.toHaveBeenCalledWithInitial("selected", model1);
    });

    it('should not trigger a select:some or selected:all event on the originating collection', function () {
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:some", multiCollectionA);
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:all", multiCollectionA);
    });

    it('should not trigger a select:one event on another single-select collection', function () {
      expect(singleCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:one", model1);
    });

    it('should not trigger a select:some or selected:all event on another multi-select collection', function () {
      expect(multiCollectionB.trigger).not.toHaveBeenCalledWithInitial("select:some", multiCollectionB);
      expect(multiCollectionB.trigger).not.toHaveBeenCalledWithInitial("select:all", multiCollectionB);
    });

    it('should not trigger a reselected event on the model', function () {
      expect(model1.trigger).not.toHaveBeenCalledWithInitial("reselected", model1);
    });

    it("should not trigger a reselect:any event on the originating collection", function(){
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("reselect:any");
    });

    it("should not trigger a reselect:one event on another single-select collection", function(){
      expect(singleCollectionA.trigger).not.toHaveBeenCalledWithInitial("reselect:one", model1);
    });

    it("should not trigger a reselect:any event on another multi-select collection", function(){
      expect(multiCollectionB.trigger).not.toHaveBeenCalledWithInitial("reselect:any");
    });
  });

  describe("when re-selecting a model, which is shared across collections, with its select method", function(){
    var model1, model2, singleCollectionA, multiCollectionA;

    beforeEach(function(){
      model1 = new Model();
      model2 = new Model();
      singleCollectionA = new SingleSelectCollection([model1, model2]);
      multiCollectionA  = new MultiSelectCollection([model1, model2]);

      model1.select();

      spyOn(model1, "trigger").andCallThrough();
      spyOn(singleCollectionA, "trigger").andCallThrough();
      spyOn(multiCollectionA, "trigger").andCallThrough();

      model1.select();
    });

    it("should remain selected in a single-select collection", function(){
      expect(singleCollectionA.selected).toBe(model1);
    });

    it("should remain among the selected models in a multi-select collection", function(){
      expect(multiCollectionA.selected[model1.cid]).not.toBeUndefined();
    });

    it("should remain selected itself", function(){
      expect(model1.selected).toBe(true);
    });

    it('should not trigger a selected event on the model', function () {
      expect(model1.trigger).not.toHaveBeenCalledWithInitial("selected", model1);
    });

    it('should not trigger a select:one event on the single-select collection', function () {
      expect(singleCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:one", model1);
    });

    it('should not trigger a select:some or selected:all event on the multi-select collection', function () {
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:some", multiCollectionA);
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:all", multiCollectionA);
    });

    it('should trigger a reselected event on the model', function () {
      expect(model1.trigger).toHaveBeenCalledWithInitial("reselected", model1);
    });

    it("should trigger a reselect:one event on the single-select collection", function(){
      expect(singleCollectionA.trigger).toHaveBeenCalledWithInitial("reselect:one", model1);
    });

    it("should trigger a reselect:any event on the multi-select collection, with an array containing the model as second parameter", function(){
      expect(multiCollectionA.trigger).toHaveBeenCalledWithInitial("reselect:any", [model1]);
    });
  });

  describe("when selecting a model, which is shared across collections and has already been selected, with its select method and options.silent enabled", function(){
    var model1, model2, singleCollectionA, multiCollectionA;

    beforeEach(function(){
      model1 = new Model();
      model2 = new Model();
      singleCollectionA = new SingleSelectCollection([model1, model2]);
      multiCollectionA  = new MultiSelectCollection([model1, model2]);

      model1.select();

      spyOn(model1, "trigger").andCallThrough();
      spyOn(singleCollectionA, "trigger").andCallThrough();
      spyOn(multiCollectionA, "trigger").andCallThrough();

      model1.select({silent: true});
    });

    it('should not trigger a selected event on the model', function () {
      expect(model1.trigger).not.toHaveBeenCalledWithInitial("selected", model1);
    });

    it('should not trigger a select:one event on the single-select collection', function () {
      expect(singleCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:one", model1);
    });

    it('should not trigger a select:some or selected:all event on the multi-select collection', function () {
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:some", multiCollectionA);
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:all", multiCollectionA);
    });

    it('should not trigger a reselected event on the model', function () {
      expect(model1.trigger).not.toHaveBeenCalledWithInitial("reselected", model1);
    });

    it("should not trigger a reselect:one event on the single-select collection", function(){
      expect(singleCollectionA.trigger).not.toHaveBeenCalledWithInitial("reselect:one", model1);
    });

    it("should not trigger a reselect:any event on the multi-select collection", function(){
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("reselect:any");
    });
  });

  describe("when creating additional collections with a model that is already selected", function(){
    var selectLogger, reselectLogger, LoggedSingleSelectCollection, LoggedMultiSelectCollection,
        model, singleCollectionA, singleCollectionB, multiCollectionA;

    beforeEach(function(){
      selectLogger = new Logger();
      reselectLogger = new Logger();

      // Always create `var selectLogger = new Logger(); var reselectLogger =
      // new Logger();` before instantiating LoggedMultiSelectCollection
      LoggedSingleSelectCollection = SingleSelectCollection.extend({
        initialize: function(models){
          this.on("select:one", function (model) {
            selectLogger.log( "select:one event: Model " + model.cid + " selected in collection " + this._pickyCid );
          });
          this.on("deselect:one", function (model) {
            selectLogger.log( "deselect:one event: Model " + model.cid + " deselected in collection " + this._pickyCid );
          });
          this.on("reselect:one", function (model) {
            reselectLogger.log( "reselect:one event: Model " + model.cid + " reselected in collection " + this._pickyCid );
          });

          SingleSelectCollection.prototype.initialize.call(this, models);
        }
      });

      // Always create `var selectLogger = new Logger(); var reselectLogger =
      // new Logger();` before instantiating LoggedMultiSelectCollection
      LoggedMultiSelectCollection = MultiSelectCollection.extend({
        initialize: function(models){
          this.on("select:none", function () {
            selectLogger.log( "select:none event fired in collection " + this._pickyCid );
          });
          this.on("select:some", function () {
            selectLogger.log( "select:some event fired in collection " + this._pickyCid );
          });
          this.on("select:all", function () {
            selectLogger.log( "select:all event fired in collection " + this._pickyCid );
          });
          this.on("reselect:any", function () {
            reselectLogger.log( "reselect:any event fired in selected in collection " + this._pickyCid );
          });

          MultiSelectCollection.prototype.initialize.call(this, models);
        }
      });

      model = new Model();
      singleCollectionA = new SingleSelectCollection([model]);
      singleCollectionA.select(model);

      spyOn(model, "trigger").andCallThrough();
      spyOn(singleCollectionA, "trigger").andCallThrough();

      singleCollectionB = new LoggedSingleSelectCollection([model]);
      multiCollectionA  = new LoggedMultiSelectCollection([model]);
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

    it('should not trigger a selected event on the model', function () {
      expect(model.trigger).not.toHaveBeenCalledWithInitial("selected", model);
    });

    it('should not trigger a select:one event on the originating collection', function () {
      expect(singleCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:one", model);
    });

    it('should not trigger a select:one, select:some or select:all events on a collections it is added to', function () {
      // That is because
      //
      // - the initialize method of a collection is called before the models are
      //   added to it, so it would be too early to fire select:* events
      // - the models are added with a silent reset, so there is nothing to
      //   listen to when the addition is done.
      //
      // These events, if they occurred, would be captured by the logger.
      expect(selectLogger.entries.length).toEqual(0);
    });

    it('should not trigger a reselected event on the model', function () {
      // The reselect event implies some sort of active 'select' action. Simply
      // registering the model status in the new collection does not belong into
      // that category. It does not reflect the action of a user reaffirming a
      // selection.
      expect(model.trigger).not.toHaveBeenCalledWithInitial("reselected", model);
    });

    it("should not trigger a reselect:one event on the originating collection", function(){
      expect(singleCollectionA.trigger).not.toHaveBeenCalledWithInitial("reselect:one", model);
    });

    it("should not trigger a reselect:one or reselect:any event on a collection it is added to", function(){
      expect(reselectLogger.entries.length).toEqual(0);
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

      spyOn(model1, "trigger").andCallThrough();
      spyOn(model2, "trigger").andCallThrough();
      spyOn(singleCollectionA, "trigger").andCallThrough();
      spyOn(singleCollectionB, "trigger").andCallThrough();
      spyOn(multiCollectionA, "trigger").andCallThrough();

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

    it('should trigger a selected event on the selected model', function () {
      expect(model2.trigger).toHaveBeenCalledWithInitial("selected", model2);
    });

    it('should trigger a deselected event on the first model', function () {
      expect(model1.trigger).toHaveBeenCalledWithInitial("deselected", model1);
    });

    it('should trigger a deselect:one event on the originating collection', function () {
      expect(singleCollectionA.trigger).toHaveBeenCalledWithInitial("deselect:one", model1);
    });

    it('should trigger a select:one event on the originating collection', function () {
      expect(singleCollectionA.trigger).toHaveBeenCalledWithInitial("select:one", model2);
    });

    it('should trigger a deselect:one event on another single-select collection', function () {
      expect(singleCollectionB.trigger).toHaveBeenCalledWithInitial("deselect:one", model1);
    });

    it('should trigger a select:one event on another single-select collection', function () {
      expect(singleCollectionB.trigger).toHaveBeenCalledWithInitial("select:one", model2);
    });

    it('should trigger a select:some event on another multi-select collection', function () {
      expect(multiCollectionA.trigger).toHaveBeenCalledWithInitial("select:some", multiCollectionA);
    });

    it('should not trigger a reselected event on the selected model', function () {
      expect(model2.trigger).not.toHaveBeenCalledWithInitial("reselected", model2);
    });

    it("should not trigger a reselect:one event on the originating collection", function(){
      expect(singleCollectionA.trigger).not.toHaveBeenCalledWithInitial("reselect:one", model2);
    });

    it("should not trigger a reselect:one event on another single-select collection", function(){
      expect(singleCollectionB.trigger).not.toHaveBeenCalledWithInitial("reselect:one", model2);
    });

    it("should not trigger a reselect:any event on another multi-select collection", function(){
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("reselect:any");
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

        spyOn(model1, "trigger").andCallThrough();
        spyOn(model2, "trigger").andCallThrough();
        spyOn(multiCollectionA, "trigger").andCallThrough();

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

      it('should not trigger a selected event on the first model', function () {
        expect(model1.trigger).not.toHaveBeenCalledWithInitial("selected", model1);
      });

      it('should not trigger a deselected event on the first model', function () {
        expect(model1.trigger).not.toHaveBeenCalledWithInitial("deselected", model1);
      });

      it('should trigger a selected event on the second model', function () {
        expect(model2.trigger).toHaveBeenCalledWithInitial("selected", model2);
      });

      it('should trigger a select:some or selected:all event on a multi-select collection', function () {
        expect(multiCollectionA.trigger).toHaveBeenCalledWithInitial("select:all", multiCollectionA);
      });

      it('should not trigger a reselected event on the first model', function () {
        expect(model1.trigger).not.toHaveBeenCalledWithInitial("reselected", model1);
      });

      it('should not trigger a reselected event on the second model', function () {
        expect(model2.trigger).not.toHaveBeenCalledWithInitial("reselected", model2);
      });

      it("should not trigger a reselect:any event on a multi-select collection", function(){
        expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("reselect:any");
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

        spyOn(model1, "trigger").andCallThrough();
        spyOn(model2, "trigger").andCallThrough();
        spyOn(singleCollectionA, "trigger").andCallThrough();
        spyOn(multiCollectionA, "trigger").andCallThrough();

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

      it('should not trigger a selected event on the first model', function () {
        expect(model1.trigger).not.toHaveBeenCalledWithInitial("selected", model1);
      });

      it('should trigger a deselected event on the first model', function () {
        expect(model1.trigger).toHaveBeenCalledWithInitial("deselected", model1);
      });

      it('should trigger a selected event on the second model', function () {
        expect(model2.trigger).toHaveBeenCalledWithInitial("selected", model2);
      });

      it('should trigger a deselect:one event on the single-select collection', function () {
        expect(singleCollectionA.trigger).toHaveBeenCalledWithInitial("deselect:one", model1);
      });

      it('should trigger a select:one event on the single-select collection', function () {
        expect(singleCollectionA.trigger).toHaveBeenCalledWithInitial("select:one", model2);
      });

      it('should trigger a select:some event on the multi-select collection', function () {
        expect(multiCollectionA.trigger).toHaveBeenCalledWithInitial("select:some", multiCollectionA);
      });

      it('should not trigger a reselected event on the first model', function () {
        expect(model1.trigger).not.toHaveBeenCalledWithInitial("reselected", model1);
      });

      it('should not trigger a reselected event on the second model', function () {
        expect(model2.trigger).not.toHaveBeenCalledWithInitial("reselected", model2);
      });

     it("should not trigger a reselect:one event on the single-select collection", function(){
        expect(singleCollectionA.trigger).not.toHaveBeenCalledWithInitial("reselect:one", model2);
      });

      it("should not trigger a reselect:any event on the multi-select collection", function(){
        expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("reselect:any");
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

        spyOn(model1, "trigger").andCallThrough();
        spyOn(model2, "trigger").andCallThrough();
        spyOn(singleCollectionA, "trigger").andCallThrough();
        spyOn(multiCollectionA, "trigger").andCallThrough();

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

      it('should not trigger a selected event on the first model', function () {
        expect(model1.trigger).not.toHaveBeenCalledWithInitial("selected", model1);
      });

      it('should not trigger a deselected event on the first model', function () {
        expect(model1.trigger).not.toHaveBeenCalledWithInitial("deselected", model1);
      });

      it('should trigger a selected event on the second model', function () {
        expect(model2.trigger).toHaveBeenCalledWithInitial("selected", model2);
      });

      it('should not trigger a deselect:one event on the single-select collection', function () {
        expect(singleCollectionA.trigger).not.toHaveBeenCalledWithInitial("deselect:one", model1);
      });

      it('should not trigger a select:one event on the single-select collection', function () {
        expect(singleCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:one", model2);
      });

      it('should trigger a select:some or select:all event on the multi-select collection', function () {
        expect(multiCollectionA.trigger).toHaveBeenCalledWithInitial("select:all", multiCollectionA);
      });

      it('should not trigger a reselected event on the first model', function () {
        expect(model1.trigger).not.toHaveBeenCalledWithInitial("reselected", model1);
      });

      it('should not trigger a reselected event on the second model', function () {
        expect(model2.trigger).not.toHaveBeenCalledWithInitial("reselected", model2);
      });

      it("should not trigger a reselect:one event on the single-select collection", function(){
        expect(singleCollectionA.trigger).not.toHaveBeenCalledWithInitial("reselect:one", model2);
      });

      it("should not trigger a reselect:any event on the multi-select collection", function(){
        expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("reselect:any");
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

        spyOn(model1, "trigger").andCallThrough();
        spyOn(model2, "trigger").andCallThrough();
        spyOn(singleCollectionA, "trigger").andCallThrough();
        spyOn(multiCollectionA, "trigger").andCallThrough();

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

      it('should not trigger a selected event on the first model', function () {
        expect(model1.trigger).not.toHaveBeenCalledWithInitial("selected", model1);
      });

      it('should not trigger a deselected event on the first model', function () {
        expect(model1.trigger).not.toHaveBeenCalledWithInitial("deselected", model1);
      });

      it('should trigger a selected event on the second model', function () {
        expect(model2.trigger).toHaveBeenCalledWithInitial("selected", model2);
      });

      it('should trigger a select:one event on the single-select collection', function () {
        expect(singleCollectionA.trigger).toHaveBeenCalledWithInitial("select:one", model2);
      });

      it('should trigger a select:some or select:all event on the multi-select collection', function () {
        expect(multiCollectionA.trigger).toHaveBeenCalledWithInitial("select:all", multiCollectionA);
      });

      it('should not trigger a reselected event on the first model', function () {
        expect(model1.trigger).not.toHaveBeenCalledWithInitial("reselected", model1);
      });

      it('should not trigger a reselected event on the second model', function () {
        expect(model2.trigger).not.toHaveBeenCalledWithInitial("reselected", model2);
      });

      it("should not trigger a reselect:one event on the single-select collection", function(){
        expect(singleCollectionA.trigger).not.toHaveBeenCalledWithInitial("reselect:one", model2);
      });

      it("should not trigger a reselect:any event on the multi-select collection", function(){
        expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("reselect:any");
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

      spyOn(model1, "trigger").andCallThrough();
      spyOn(model2, "trigger").andCallThrough();
      spyOn(singleCollectionA, "trigger").andCallThrough();
      spyOn(singleCollectionB, "trigger").andCallThrough();
      spyOn(multiCollectionA, "trigger").andCallThrough();

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

    it('should trigger a deselected event on the model', function () {
      expect(model1.trigger).toHaveBeenCalledWithInitial("deselected", model1);
    });

    it('should not trigger a selected event on another selected model in a multi-select collection', function () {
      expect(model2.trigger).not.toHaveBeenCalledWithInitial("deselected", model2);
    });

    it('should trigger a deselect:one event on the originating collection', function () {
      expect(singleCollectionA.trigger).toHaveBeenCalledWithInitial("deselect:one", model1);
    });

    it('should trigger a deselect:one event on another single-select collection', function () {
      expect(singleCollectionB.trigger).toHaveBeenCalledWithInitial("deselect:one", model1);
    });

    it('should trigger a select:some or selected:none event on another multi-select collection', function () {
      expect(multiCollectionA.trigger).toHaveBeenCalledWithInitial("select:some", multiCollectionA);
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

      spyOn(model1, "trigger").andCallThrough();
      spyOn(model2, "trigger").andCallThrough();
      spyOn(singleCollectionA, "trigger").andCallThrough();
      spyOn(multiCollectionA, "trigger").andCallThrough();
      spyOn(multiCollectionB, "trigger").andCallThrough();

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

    it('should trigger a deselected event on the model', function () {
      expect(model1.trigger).toHaveBeenCalledWithInitial("deselected", model1);
    });

    it('should not trigger a deselected event on another selected model in a multi-select collection', function () {
      expect(model2.trigger).not.toHaveBeenCalledWithInitial("deselected", model2);
    });

     it('should trigger a select:some or select:none event on the originating collection', function () {
       expect(multiCollectionA.trigger).toHaveBeenCalledWithInitial("select:some", multiCollectionA);
    });

    it('should trigger a deselect:one event on a single-select collection sharing the model', function () {
      expect(singleCollectionA.trigger).toHaveBeenCalledWithInitial("deselect:one", model1);
    });

    it('should trigger a select:some or selected:none event on another multi-select collection', function () {
      expect(multiCollectionB.trigger).toHaveBeenCalledWithInitial("select:some", multiCollectionB);
    });
  });

  describe("when a selected model is added", function(){
    var model1, model2, model3, model4, model5,
        singleCollectionA, singleCollectionB, multiCollectionA;

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

      spyOn(model1, "trigger").andCallThrough();
      spyOn(model2, "trigger").andCallThrough();
      spyOn(model3, "trigger").andCallThrough();
      spyOn(model4, "trigger").andCallThrough();
      spyOn(singleCollectionA, "trigger").andCallThrough();
      spyOn(multiCollectionA, "trigger").andCallThrough();
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

    it('should not trigger a selected event on the model when added to a single-select collection', function () {
      singleCollectionA.add(model2);
      expect(model2.trigger).not.toHaveBeenCalledWithInitial("selected", model2);
    });

    it('should not trigger a reselected event on the model when added to a single-select collection', function () {
      // The reselect event implies some sort of active 'select' action. Simply
      // registering the model status in the new collection does not belong into
      // that category. It does not reflect the action of a user reaffirming a
      // selection.
      singleCollectionA.add(model2);
      expect(model2.trigger).not.toHaveBeenCalledWithInitial("reselected", model2);
    });

    it('should not trigger a selected event on the model when added to a multi-select collection', function () {
      multiCollectionA.add(model4);
      expect(model4.trigger).not.toHaveBeenCalledWithInitial("selected", model4);
    });

    it('should not trigger a reselected event on the model when added to a multi-select collection', function () {
      // See the comment above for the rationale.
      multiCollectionA.add(model4);
      expect(model4.trigger).not.toHaveBeenCalledWithInitial("reselected", model4);
    });

    it('should trigger a deselected event on the previously selected model when added to a single-select collection', function () {
      singleCollectionA.add(model2);
      expect(model1.trigger).toHaveBeenCalledWithInitial("deselected", model1);
    });

    it('should not trigger a deselected event on a previously selected model when added to a multi-select collection, as long as old and new models are not shared with a single-select collection', function () {
      // ... in which case only one of them can remain selected, of course. See test below.
      multiCollectionA.add(model4);
      expect(model1.trigger).not.toHaveBeenCalledWithInitial("deselected", model1);
    });

    it('should trigger a select:one event when added to a single-select collection', function () {
      singleCollectionA.add(model2);
      expect(singleCollectionA.trigger).toHaveBeenCalledWithInitial("select:one", model2);
    });

    it('should trigger a deselect:one event when added to a single-select collection', function () {
      singleCollectionA.add(model2);
      expect(singleCollectionA.trigger).toHaveBeenCalledWithInitial("deselect:one", model1);
    });

    it('should not trigger a reselect:one event when added to a single-select collection', function () {
      singleCollectionA.add(model2);
      expect(singleCollectionA.trigger).not.toHaveBeenCalledWithInitial("reselect:one", model2);
    });

    it('should trigger a select:some/select:all event when added to a multi-select collection', function () {
      multiCollectionA.add(model4);
      expect(multiCollectionA.trigger).toHaveBeenCalledWithInitial("select:all", multiCollectionA);
    });

    it('should not trigger a reselect:any event when added to a multi-select collection', function () {
      multiCollectionA.add(model4);
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("reselect:any");
    });

    it('should trigger a select:some or select:none event when the addition is inducing a deselection in another multi-select collection', function () {
      singleCollectionA.add(model2);
      expect(multiCollectionA.trigger).toHaveBeenCalledWithInitial("select:some", multiCollectionA);
    });

    it('should not trigger a select:all, select:some or select:none event when the addition does not deselect a model in another multi-select collection', function () {
      model5 = new Model();
      singleCollectionB = new SingleSelectCollection([model5]);
      model5.select();

      singleCollectionB.add(model2);

      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:none", multiCollectionA);
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:some", multiCollectionA);
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:all", multiCollectionA);
    });

    it('should not trigger a reselect:one event on another single-select collection holding the model', function () {
      singleCollectionB = new SingleSelectCollection();
      singleCollectionB.add(model1);

      expect(singleCollectionA.trigger).not.toHaveBeenCalledWithInitial("reselect:one", model1);
    });

    it('should not trigger a reselect:any event on another multi-select collection holding the model', function () {
      singleCollectionA.add(model2);
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("reselect:any");
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

      spyOn(model1, "trigger").andCallThrough();
      spyOn(model2, "trigger").andCallThrough();
      spyOn(singleCollectionA, "trigger").andCallThrough();
      spyOn(multiCollectionA, "trigger").andCallThrough();
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

    it("should no longer be selected if removed from all collections, even if it had been part of a collection which had simply been closed and all references to it removed (single-select collection, closed first)", function(){
      singleCollectionA.close();
      singleCollectionA = undefined;

      multiCollectionA.remove(model1);
      expect(model1.selected).toBe(false);
    });

    it("should no longer be selected if removed from all collections, even if it had been part of a collection which had simply been closed and all references to it removed (multi-select collection, closed first)", function(){
      multiCollectionA.close();
      multiCollectionA = undefined;

      singleCollectionA.remove(model1);
      expect(model1.selected).toBe(false);
    });

    it("should no longer be selected if removed from all collections, even if it had been part of a collection which had simply been closed and all references to it removed (single-select collection, closed last)", function(){
      multiCollectionA.remove(model1);

      singleCollectionA.close();
      singleCollectionA = undefined;

      expect(model1.selected).toBe(false);
    });

    it("should no longer be selected if removed from all collections, even if it had been part of a collection which had simply been closed and all references to it removed (multi-select collection, closed last)", function(){
      singleCollectionA.remove(model1);

      multiCollectionA.close();
      multiCollectionA = undefined;

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

    it('should not trigger a deselected event on the model when it is still part of another collection (removed from single-select)', function () {
      singleCollectionA.remove(model1);
      expect(model1.trigger).not.toHaveBeenCalledWithInitial("deselected", model1);
    });

    it('should not trigger a deselected event on the model when it is still part of another collection (removed from multi-select)', function () {
      multiCollectionA.remove(model1);
      expect(model1.trigger).not.toHaveBeenCalledWithInitial("deselected", model1);
    });

    it('should trigger a deselected event on the model when removed from all collections (single-select collection last)', function () {
      multiCollectionA.remove(model1);
      singleCollectionA.remove(model1);
      expect(model1.trigger).toHaveBeenCalledWithInitial("deselected", model1);
    });

    it('should trigger a deselected event on the model when removed from all collections (multi-select collection last)', function () {
      singleCollectionA.remove(model1);
      multiCollectionA.remove(model1);
      expect(model1.trigger).toHaveBeenCalledWithInitial("deselected", model1);
    });

    it('should trigger a deselect:one event on a single-select collection it is removed from', function () {
      singleCollectionA.remove(model1);
      expect(singleCollectionA.trigger).toHaveBeenCalledWithInitial("deselect:one", model1);
    });

    it('should trigger a select:some or select:none event on a multi-select collection it is removed from', function () {
      multiCollectionA.remove(model1);
      expect(multiCollectionA.trigger).toHaveBeenCalledWithInitial("select:none", multiCollectionA);
    });

    it('should not trigger a deselect:one or select:one event on a single-select collection it remains part of', function () {
      multiCollectionA.remove(model1);
      expect(singleCollectionA.trigger).not.toHaveBeenCalledWithInitial("deselect:one", model1);
      expect(singleCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:one", model1);
    });

    it('should not trigger a select:none, select:some or select:all event on a multi-select collection it remains part of', function () {
      singleCollectionA.remove(model1);
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:none", multiCollectionA);
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:some", multiCollectionA);
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:all", multiCollectionA);
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
      spyOn(singleCollectionB, "trigger").andCallThrough();
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

    it('should not trigger a selected event on the model (added to a single-select collection)', function () {
      singleCollectionA.reset([model1]);
      expect(model1.trigger).not.toHaveBeenCalledWithInitial("selected", model1);
    });

    it('should not trigger a selected event on the model (added to a multi-select collection)', function () {
      multiCollectionA.reset([model1]);
      expect(model1.trigger).not.toHaveBeenCalledWithInitial("selected", model1);
    });

    it('should not trigger a reselected event on the model (added to a single-select collection)', function () {
      // For one, reset() is meant to suppress individual notifications. Also,
      // the reselect event implies some sort of active 'select' action, which
      // is not present here. See comments in the 'add' tests for more on the
      // rationale.
      singleCollectionA.reset([model1]);
      expect(model1.trigger).not.toHaveBeenCalledWithInitial("reselected", model1);
    });

    it('should not trigger a reselected event on the model (added to a multi-select collection)', function () {
      multiCollectionA.reset([model1]);
      expect(model1.trigger).not.toHaveBeenCalledWithInitial("reselected", model1);
    });

    it('should not trigger a select:one event when added to a single-select collection', function () {
      // reset() is meant to suppress individual notifications. Just like the add event, selection events are silenced.
      // Whatever needs to be done, should be dealt with in the reset event handler.
      singleCollectionA.reset([model1]);
      expect(singleCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:one", model1);
    });

    it('should not trigger a reselect:one event when added to a single-select collection', function () {
      singleCollectionA.reset([model1]);
      expect(singleCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:one", model1);
    });

    it('should not trigger a select:some or select:all event when added to a multi-select collection', function () {
      // For the rationale, see above.
      multiCollectionA.reset([model1]);
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:some", multiCollectionA);
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:all", multiCollectionA);
    });

    it('should not trigger a reselect:any event when added to a multi-select collection', function () {
      // For the rationale, see above.
      multiCollectionA.reset([model1]);
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("reselect:any");
    });

    it('should trigger a deselected event on a different model when the reset is inducing a deselection in another multi-select collection', function () {
      singleCollectionA.reset([model1, model2]);
      expect(model1.trigger).toHaveBeenCalledWithInitial("deselected", model1);
    });

    it('should not trigger a deselect:one event when added to a singe-select collection, even if multiple models with selected status are added, and all but the last one are deselected', function () {
      singleCollectionA.reset([model1, model2]);
      expect(singleCollectionA.trigger).not.toHaveBeenCalledWithInitial("deselect:one", model1);
    });

    it('should not trigger a reselect:one event when added to a singe-select collection, even if multiple models with selected status are added, and all but the last one are deselected', function () {
      singleCollectionA.reset([model1, model2]);
      expect(singleCollectionA.trigger).not.toHaveBeenCalledWithInitial("reselect:one", model2);
    });

    it('should trigger a select:some or select:none event when the reset is inducing a deselection in another multi-select collection', function () {
      singleCollectionA.reset([model1, model2]);
      expect(multiCollectionA.trigger).toHaveBeenCalledWithInitial("select:some", multiCollectionA);
    });

    it('should not trigger a reselect:one event on another single-select collection holding the model', function () {
      singleCollectionA.reset([model3]);
      expect(singleCollectionB.trigger).not.toHaveBeenCalledWithInitial("reselect:one", model3);
    });

    it('should not trigger a reselect:any event on another multi-select collection holding the model', function () {
      singleCollectionA.reset([model1]);
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("reselect:any");
    });

    it('should not trigger a reselect:any event on another multi-select collection, even when the reset is inducing a change (a deselection) there', function () {
      singleCollectionA.reset([model1, model2]);
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("reselect:any");
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

    it('should not trigger a deselected event on the model when it is still part of another collection (removed from single-select)', function () {
      singleCollectionA.reset();
      expect(model1.trigger).not.toHaveBeenCalledWithInitial("deselected", model1);
    });

    it('should not trigger a deselected event on the model when it is still part of another collection (removed from multi-select)', function () {
      multiCollectionA.reset();
      expect(model1.trigger).not.toHaveBeenCalledWithInitial("deselected", model1);
    });

    it('should trigger a deselected event on the model when removed from all collections (single-select collection last)', function () {
      multiCollectionA.reset();
      singleCollectionA.reset();
      expect(model1.trigger).toHaveBeenCalledWithInitial("deselected", model1);
    });

    it('should trigger a deselected event on the model when removed from all collections (multi-select collection last)', function () {
      singleCollectionA.reset();
      multiCollectionA.reset();
      expect(model1.trigger).toHaveBeenCalledWithInitial("deselected", model1);
    });

    it('should not trigger a deselect:one event when removed from a single-select collection', function () {
      // reset() is meant to suppress individual notifications. Just like the add event, selection events are silenced.
      // Whatever needs to be done, should be dealt with in the reset event handler.
      singleCollectionA.reset();
      expect(singleCollectionA.trigger).not.toHaveBeenCalledWithInitial("deselect:one", model1);
    });

    it('should not trigger a select:none event when removed from a multi-select collection', function () {
      // For the rationale, see above.
      multiCollectionA.reset();
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:none", multiCollectionA);
    });

    it('should not trigger a deselect:one event when removed from all collections, single-select collection last', function () {
      // See above.
      multiCollectionA.reset();
      singleCollectionA.reset();
      expect(singleCollectionA.trigger).not.toHaveBeenCalledWithInitial("deselect:one", model1);
    });

    it('should not trigger a select:none event when removed from all collections, multi-select collection last', function () {
      // See above.
      singleCollectionA.reset();
      multiCollectionA.reset();
      expect(multiCollectionA.trigger).not.toHaveBeenCalledWithInitial("select:none", multiCollectionA);
    });
  });

  describe('custom options', function () {

    describe("when selecting a model in a single-select collection with a custom option", function(){
      var model, singleCollectionA, singleCollectionB, multiCollectionA;

      beforeEach(function(){
        model = new Model();
        singleCollectionA = new SingleSelectCollection([model]);
        singleCollectionB = new SingleSelectCollection([model]);
        multiCollectionA  = new MultiSelectCollection([model]);

        spyOn(model, "trigger").andCallThrough();
        spyOn(singleCollectionA, "trigger").andCallThrough();
        spyOn(singleCollectionB, "trigger").andCallThrough();
        spyOn(multiCollectionA, "trigger").andCallThrough();

        singleCollectionA.select(model, {foo: "bar"});
      });

      it('should trigger a selected event on the model and pass the options object along as the last parameter', function () {
        expect(model.trigger).toHaveBeenCalledWith("selected", model, {foo: "bar"});
      });

      it('should trigger a select:one event on the originating collection and pass the options object along as the last parameter', function () {
        expect(singleCollectionA.trigger).toHaveBeenCalledWith("select:one", model, {foo: "bar"});
      });

      it('should trigger a select:one event on another single-select collection and pass the options object along as the last parameter', function () {
        expect(singleCollectionB.trigger).toHaveBeenCalledWith("select:one", model, {foo: "bar"});
      });

      it('should trigger a select:some or selected:all event on another multi-select collection and pass the options object along as the last parameter', function () {
        expect(multiCollectionA.trigger).toHaveBeenCalledWith("select:all", multiCollectionA, {foo: "bar"});
      });
    });

    describe("when re-selecting a model in a single-select collection with a custom option", function(){
      var model, singleCollectionA, singleCollectionB, multiCollectionA;

      beforeEach(function(){
        model = new Model();
        singleCollectionA = new SingleSelectCollection([model]);
        singleCollectionB = new SingleSelectCollection([model]);
        multiCollectionA  = new MultiSelectCollection([model]);

        model.select();

        spyOn(model, "trigger").andCallThrough();
        spyOn(singleCollectionA, "trigger").andCallThrough();
        spyOn(singleCollectionB, "trigger").andCallThrough();
        spyOn(multiCollectionA, "trigger").andCallThrough();

        singleCollectionA.select(model, {foo: "bar"});
      });

      it('should trigger a reselected event on the model and pass the options object along as the last parameter', function () {
        expect(model.trigger).toHaveBeenCalledWith("reselected", model, {foo: "bar"});
      });

      it("should trigger a reselect:one event on the originating collection and pass the options object along as the last parameter", function(){
        expect(singleCollectionA.trigger).toHaveBeenCalledWith("reselect:one", model, {foo: "bar"});
      });

      it("should trigger a reselect:one event on another single-select collection and pass the options object along as the last parameter", function(){
        expect(singleCollectionB.trigger).toHaveBeenCalledWith("reselect:one", model, {foo: "bar"});
      });

      it("should trigger a reselect:any event on another multi-select collection and pass the options object along as the last parameter", function(){
        expect(multiCollectionA.trigger).toHaveBeenCalledWith("reselect:any", [model], {foo: "bar"});
      });
    });

    describe("when a model is already selected and a different model is selected in a single-select collection with a custom option", function(){
      var model1, model2, singleCollectionA, singleCollectionB, multiCollectionA;

      beforeEach(function(){
        model1 = new Model();
        model2 = new Model();

        singleCollectionA = new SingleSelectCollection([model1, model2]);
        singleCollectionB = new SingleSelectCollection([model1, model2]);
        multiCollectionA  = new MultiSelectCollection([model1, model2]);

        model1.select();

        spyOn(model1, "trigger").andCallThrough();
        spyOn(model2, "trigger").andCallThrough();
        spyOn(singleCollectionA, "trigger").andCallThrough();
        spyOn(singleCollectionB, "trigger").andCallThrough();
        spyOn(multiCollectionA, "trigger").andCallThrough();

        singleCollectionA.select(model2, {foo: "bar"});
      });

      it('should trigger a selected event on the selected model and pass the options object along as the last parameter', function () {
        expect(model2.trigger).toHaveBeenCalledWith("selected", model2, {foo: "bar"});
      });

      it('should trigger a deselected event on the first model and pass the options object along as the last parameter', function () {
        expect(model1.trigger).toHaveBeenCalledWith("deselected", model1, {foo: "bar"});
      });

      it('should trigger a deselect:one event on the originating collection and pass the options object along as the last parameter', function () {
        expect(singleCollectionA.trigger).toHaveBeenCalledWith("deselect:one", model1, {foo: "bar"});
      });

      it('should trigger a select:one event on the originating collection and pass the options object along as the last parameter', function () {
        expect(singleCollectionA.trigger).toHaveBeenCalledWith("select:one", model2, {foo: "bar"});
      });

      it('should trigger a deselect:one event on another single-select collection and pass the options object along as the last parameter', function () {
        expect(singleCollectionB.trigger).toHaveBeenCalledWith("deselect:one", model1, {foo: "bar"});
      });

      it('should trigger a select:one event on another single-select collection and pass the options object along as the last parameter', function () {
        expect(singleCollectionB.trigger).toHaveBeenCalledWith("select:one", model2, {foo: "bar"});
      });

      it('should trigger a select:some event on another multi-select collection and pass the options object along as the last parameter', function () {
        expect(multiCollectionA.trigger).toHaveBeenCalledWith("select:some", multiCollectionA, {foo: "bar"});
      });
    });

    describe("when selecting a model in a multi-select collection with a custom option", function(){
      var model, singleCollectionA, multiCollectionA, multiCollectionB;

      beforeEach(function(){
        model = new Model();
        singleCollectionA = new SingleSelectCollection([model]);
        multiCollectionA  = new MultiSelectCollection([model]);
        multiCollectionB  = new MultiSelectCollection([model]);

        spyOn(model, "trigger").andCallThrough();
        spyOn(singleCollectionA, "trigger").andCallThrough();
        spyOn(multiCollectionA, "trigger").andCallThrough();
        spyOn(multiCollectionB, "trigger").andCallThrough();

        multiCollectionA.select(model, {foo: "bar"});
      });

      it('should trigger a selected event on the model and pass the options object along as the last parameter', function () {
        expect(model.trigger).toHaveBeenCalledWith("selected", model, {foo: "bar"});
      });

      it('should trigger a select:some or selected:all event on the originating collection and pass the options object along as the last parameter', function () {
        expect(multiCollectionA.trigger).toHaveBeenCalledWith("select:all", multiCollectionA, {foo: "bar"});
      });

      it('should trigger a select:one event on another single-select collection and pass the options object along as the last parameter', function () {
        expect(singleCollectionA.trigger).toHaveBeenCalledWith("select:one", model, {foo: "bar"});
      });

      it('should trigger a select:some or selected:all event on another multi-select collection and pass the options object along as the last parameter', function () {
        expect(multiCollectionB.trigger).toHaveBeenCalledWith("select:all", multiCollectionB, {foo: "bar"});
      });
    });

    describe("when re-selecting a model in a multi-select collection with a custom option", function(){
      var model1, model2, singleCollectionA, multiCollectionA, multiCollectionB;

      beforeEach(function(){
        model1 = new Model();
        model2 = new Model();
        singleCollectionA = new SingleSelectCollection([model1, model2]);
        multiCollectionA  = new MultiSelectCollection([model1, model2]);
        multiCollectionB  = new MultiSelectCollection([model1, model2]);

        multiCollectionA.select(model1);

        spyOn(model1, "trigger").andCallThrough();
        spyOn(singleCollectionA, "trigger").andCallThrough();
        spyOn(multiCollectionA, "trigger").andCallThrough();
        spyOn(multiCollectionB, "trigger").andCallThrough();

        multiCollectionA.select(model1, {foo: "bar"});
      });

      it('should trigger a reselected event on the model and pass the options object along as the last parameter', function () {
        expect(model1.trigger).toHaveBeenCalledWith("reselected", model1, {foo: "bar"});
      });

      it("should trigger a reselect:any event on the originating collection and pass the options object along as the last parameter", function(){
        expect(multiCollectionA.trigger).toHaveBeenCalledWith("reselect:any", [model1], {foo: "bar"});
      });

      it("should trigger a reselect:one event on another single-select collection and pass the options object along as the last parameter", function(){
        expect(singleCollectionA.trigger).toHaveBeenCalledWith("reselect:one", model1, {foo: "bar"});
      });

      it("should trigger a reselect:any event on another multi-select collection and pass the options object along as the last parameter", function(){
        expect(multiCollectionB.trigger).toHaveBeenCalledWith("reselect:any", [model1], {foo: "bar"});
      });
    });

    describe("when a selected model is deselected in a multi-select collection with a custom option", function(){
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

        spyOn(model1, "trigger").andCallThrough();
        spyOn(model2, "trigger").andCallThrough();
        spyOn(singleCollectionA, "trigger").andCallThrough();
        spyOn(multiCollectionA, "trigger").andCallThrough();
        spyOn(multiCollectionB, "trigger").andCallThrough();

        multiCollectionA.deselect(model1, {foo: "bar"});
      });

      it('should trigger a deselected event on the model and pass the options object along as the last parameter', function () {
        expect(model1.trigger).toHaveBeenCalledWith("deselected", model1, {foo: "bar"});
      });

      it('should trigger a select:some or select:none event on the originating collection and pass the options object along as the last parameter', function () {
        expect(multiCollectionA.trigger).toHaveBeenCalledWith("select:some", multiCollectionA, {foo: "bar"});
      });

      it('should trigger a deselect:one event on a single-select collection sharing the model and pass the options object along as the last parameter', function () {
        expect(singleCollectionA.trigger).toHaveBeenCalledWith("deselect:one", model1, {foo: "bar"});
      });

      it('should trigger a select:some or selected:none event on another multi-select collection and pass the options object along as the last parameter', function () {
        expect(multiCollectionB.trigger).toHaveBeenCalledWith("select:some", multiCollectionB, {foo: "bar"});
      });
    });

  });

});
