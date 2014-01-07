Backbone.Picky = (function (Backbone, _) {
  var Picky = {};

  // Picky.SingleSelect
  // ------------------
  // A single-select mixin for Backbone.Collection, allowing a single
  // model to be selected within a collection. Selection of another
  // model within the collection causes the previous model to be
  // deselected.

  Picky.SingleSelect = function(collection, models){
    this._pickyCid = _.uniqueId('singleSelect-');
    this.collection = collection;

    _.each(models || [], function (model) {
      registerCollectionWithModel(model, this);
      if (model.selected) this.selected = model;
    }, this);

    this.collection.listenTo(this.collection, 'selected', this.select);
    this.collection.listenTo(this.collection, 'deselected', this.deselect);

    this.collection.listenTo(this.collection, 'reset', onResetSingleSelect);
    this.collection.listenTo(this.collection, 'add', onAdd);
    this.collection.listenTo(this.collection, 'remove', onRemove);
  };

  _.extend(Picky.SingleSelect.prototype, {

    // Select a model, deselecting any previously
    // selected model
    select: function(model){
      if (model && this.selected === model) { return; }

      this.deselect();

      this.selected = model;
      this.selected.select();
      this.trigger("select:one", model);
    },

    // Deselect a model, resulting in no model
    // being selected
    deselect: function(model, options){
      options || (options = {});
      if (!this.selected){ return; }

      model = model || this.selected;
      if (this.selected !== model){ return; }

      if (!options.skipModelCall) this.selected.deselect();
      this.trigger("deselect:one", this.selected);
      delete this.selected;
    }

  });

  // Picky.MultiSelect
  // -----------------
  // A multi-select mixin for Backbone.Collection, allowing a collection to
  // have multiple items selected, including `selectAll` and `deselectAll`
  // capabilities.

  Picky.MultiSelect = function (collection, models) {
    this._pickyCid = _.uniqueId('multiSelect-');
    this.collection = collection;
    this.selected = {};

    _.each(models || [], function (model) {
      registerCollectionWithModel(model, this);
      if (model.selected) this.selected[model.cid] = model;
    }, this);

    this.collection.listenTo(this.collection, 'selected', this.select);
    this.collection.listenTo(this.collection, 'deselected', this.deselect);

    this.collection.listenTo(this.collection, 'reset', onResetMultiSelect);
    this.collection.listenTo(this.collection, 'add', onAdd);
    this.collection.listenTo(this.collection, 'remove', onRemove);
  };

  _.extend(Picky.MultiSelect.prototype, {

    // Select a specified model, make sure the
    // model knows it's selected, and hold on to
    // the selected model.
    select: function (model) {
      if (this.selected[model.cid]) { return; }

      this.selected[model.cid] = model;
      model.select();
      calculateSelectedLength(this);
    },

    // Deselect a specified model, make sure the
    // model knows it has been deselected, and remove
    // the model from the selected list.
    deselect: function (model, options) {
      options || (options = {});
      if (!this.selected[model.cid]) { return; }

      delete this.selected[model.cid];
      if (!options.skipModelCall) model.deselect();
      calculateSelectedLength(this);
    },

    // Select all models in this collection
    selectAll: function () {
      this.each(function (model) { model.select(); });
      calculateSelectedLength(this);
    },

    // Deselect all models in this collection
    deselectAll: function () {
      if (this.selectedLength === 0) { return; }
      this.each(function (model) { model.deselect(); });
      calculateSelectedLength(this);
    },

    selectNone: function () {
      this.deselectAll();
    },

      // Toggle select all / none. If some are selected, it
    // will select all. If all are selected, it will select 
    // none. If none are selected, it will select all.
    toggleSelectAll: function () {
      if (this.selectedLength === this.length) {
        this.deselectAll();
      } else {
        this.selectAll();
      }
    }
  });

  // Picky.Selectable
  // ----------------
  // A selectable mixin for Backbone.Model, allowing a model to be selected,
  // enabling it to work with Picky.MultiSelect or on it's own

  Picky.Selectable = function (model) {
    this.model = model;
  };

  _.extend(Picky.Selectable.prototype, {

    // Select this model, and tell our
    // collection that we're selected
    select: function () {
      if (this.selected) { return; }

      this.selected = true;
      this.trigger("selected", this);
    },

    // Deselect this model, and tell our
    // collection that we're deselected
    deselect: function () {
      if (!this.selected) { return; }

      this.selected = false;
      this.trigger("deselected", this);
    },

    // Change selected to the opposite of what
    // it currently is
    toggleSelected: function () {
      if (this.selected) {
        this.deselect();
      } else {
        this.select();
      }
    }
  });

  // Helper Methods
  // --------------

  // Calculate the number of selected items in a collection
  // and update the collection with that length. Trigger events
  // from the collection based on the number of selected items.
  var calculateSelectedLength = function (collection) {
    collection.selectedLength = _.size(collection.selected);

    var selectedLength = collection.selectedLength;
    var length = collection.length;

    if (selectedLength === length) {
      collection.trigger("select:all", collection);
      return;
    }

    if (selectedLength === 0) {
      collection.trigger("select:none", collection);
      return;
    }

    if (selectedLength > 0 && selectedLength < length) {
      collection.trigger("select:some", collection);
      return;
    }
  };

  function onAdd (model, collection) {
    registerCollectionWithModel(model, collection);
    if (model.selected) collection.select(model);
  }

  function deselectLocal (model, collection){
    if (model.selected){
      if (model._pickyCollections && model._pickyCollections.length == 0) {
        collection.deselect(model);
      } else {
        collection.deselect(model, {skipModelCall: true});
      }
    }
  }

  function onRemove (model, collection) {
    if (model._pickyCollections) model._pickyCollections = _.without(model._pickyCollections, collection._pickyCid);
    deselectLocal(model, collection);
  }

  function onResetSingleSelect (collection, options) {
    var selected,
        deselectOnAdd,
        deselectOnRemove = _.find(options.previousModels, function (model) { return model.selected; });

    if (deselectOnRemove) onRemove(deselectOnRemove, collection);

    selected = collection.filter(function (model) { return model.selected; });
    deselectOnAdd = _.initial(selected);
    if (deselectOnAdd.length) _.each(deselectOnAdd, function (model) { model.deselect(); });
    if (selected.length) collection.select(_.last(selected));
  }

  function onResetMultiSelect (collection, options) {
    var select,
        deselect = _.filter(options.previousModels, function (model) { return model.selected; });

    if (deselect) _.each(deselect, function (model) { onRemove(model, collection); });

    select = collection.filter(function (model) { return model.selected; });
    if (select.length) _.each(select, function (model) { collection.select(model); });
  }

  function registerCollectionWithModel(model, collection) {
    model._pickyCollections || (model._pickyCollections = []);
    model._pickyCollections.push(collection._pickyCid);
  }

  return Picky;
})(Backbone, _);
