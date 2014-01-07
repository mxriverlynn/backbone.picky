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

    this.collection.listenTo(this.collection, '_selected', this.select);
    this.collection.listenTo(this.collection, '_deselected', this.deselect);

    this.collection.listenTo(this.collection, 'reset', onResetSingleSelect);
    this.collection.listenTo(this.collection, 'add', onAdd);
    this.collection.listenTo(this.collection, 'remove', onRemove);
  };

  _.extend(Picky.SingleSelect.prototype, {

    // Select a model, deselecting any previously
    // selected model
    select: function(model, options){
      options || (options = {});
      if (model && this.selected === model) { return; }

      this.deselect(undefined, options);

      this.selected = model;
      this.selected.select(options);
      if (!options.silent) this.trigger("select:one", model);
    },

    // Deselect a model, resulting in no model
    // being selected
    deselect: function(model, options){
      options || (options = {});
      if (!this.selected){ return; }

      model = model || this.selected;
      if (this.selected !== model){ return; }

      if (!options._skipModelCall) this.selected.deselect(options);
      if (!options.silent) this.trigger("deselect:one", this.selected);
      delete this.selected;
    }

  });

  // Picky.MultiSelect
  // -----------------
  // A multi-select mixin for Backbone.Collection, allowing a collection to
  // have multiple items selected, including `selectAll` and `selectNone`
  // capabilities.

  Picky.MultiSelect = function (collection, models) {
    this._pickyCid = _.uniqueId('multiSelect-');
    this.collection = collection;
    this.selected = {};

    _.each(models || [], function (model) {
      registerCollectionWithModel(model, this);
      if (model.selected) this.selected[model.cid] = model;
    }, this);

    this.collection.listenTo(this.collection, '_selected', this.select);
    this.collection.listenTo(this.collection, '_deselected', this.deselect);

    this.collection.listenTo(this.collection, 'reset', onResetMultiSelect);
    this.collection.listenTo(this.collection, 'add', onAdd);
    this.collection.listenTo(this.collection, 'remove', onRemove);
  };

  _.extend(Picky.MultiSelect.prototype, {

    // Select a specified model, make sure the
    // model knows it's selected, and hold on to
    // the selected model.
    select: function (model, options) {
      if (this.selected[model.cid]) { return; }

      this.selected[model.cid] = model;
      model.select(options);
      calculateSelectedLength(this, options);
    },

    // Deselect a specified model, make sure the
    // model knows it has been deselected, and remove
    // the model from the selected list.
    deselect: function (model, options) {
      options || (options = {});
      if (!this.selected[model.cid]) { return; }

      delete this.selected[model.cid];
      if (!options._skipModelCall) model.deselect(options);
      calculateSelectedLength(this, options);
    },

    // Select all models in this collection
    selectAll: function (options) {
      this.each(function (model) { model.select(options); });
      calculateSelectedLength(this, options);
    },

    // Deselect all models in this collection
    selectNone: function (options) {
      if (this.selectedLength === 0) { return; }
      this.each(function (model) { model.deselect(options); });
      calculateSelectedLength(this, options);
    },

    // Toggle select all / none. If some are selected, it
    // will select all. If all are selected, it will select 
    // none. If none are selected, it will select all.
    toggleSelectAll: function (options) {
      if (this.selectedLength === this.length) {
        this.selectNone(options);
      } else {
        this.selectAll(options);
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
    select: function (options) {
      options || (options = {});
      if (this.selected) { return; }

      this.selected = true;
      this.trigger("_selected", this);
      if (!options.silent) this.trigger("selected", this);
    },

    // Deselect this model, and tell our
    // collection that we're deselected
    deselect: function (options) {
      options || (options = {});
      if (!this.selected) { return; }

      this.selected = false;
      this.trigger("_deselected", this);
      if (!options.silent) this.trigger("deselected", this);
    },

    // Change selected to the opposite of what
    // it currently is
    toggleSelected: function (options) {
      if (this.selected) {
        this.deselect(options);
      } else {
        this.select(options);
      }
    }
  });

  // Helper Methods
  // --------------

  // Calculate the number of selected items in a collection
  // and update the collection with that length. Trigger events
  // from the collection based on the number of selected items.
  var calculateSelectedLength = function (collection, options) {
    options || (options = {});
    collection.selectedLength = _.size(collection.selected);

    if (options.silent) return;

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

  function onRemove (model, collection, options) {
    if (model._pickyCollections) model._pickyCollections = _.without(model._pickyCollections, collection._pickyCid);
    if (model.selected) {
      if (model._pickyCollections && model._pickyCollections.length == 0) {
        collection.deselect(model, options);
      } else {
        collection.deselect(model, _.extend({}, options, {_skipModelCall: true}));
      }
    }
  }

  function onResetSingleSelect (collection, options) {
    var selected,
        excessiveSelections,
        deselectOnRemove = _.find(options.previousModels, function (model) { return model.selected; });

    if (deselectOnRemove) onRemove(deselectOnRemove, collection, {silent: true});

    selected = collection.filter(function (model) { return model.selected; });
    excessiveSelections = _.initial(selected);
    if (excessiveSelections.length) _.each(excessiveSelections, function (model) { model.deselect({silent: true}); });
    if (selected.length) collection.select(_.last(selected), {silent: true});
  }

  function onResetMultiSelect (collection, options) {
    var select,
        deselect = _.filter(options.previousModels, function (model) { return model.selected; });

    if (deselect) _.each(deselect, function (model) { onRemove(model, collection, {silent: true}); });

    select = collection.filter(function (model) { return model.selected; });
    if (select.length) _.each(select, function (model) { collection.select(model, {silent: true}); });
  }

  function registerCollectionWithModel(model, collection) {
    model._pickyCollections || (model._pickyCollections = []);
    model._pickyCollections.push(collection._pickyCid);
  }

  return Picky;
})(Backbone, _);
