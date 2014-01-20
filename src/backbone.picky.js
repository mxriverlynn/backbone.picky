Backbone.Picky = (function (Backbone, _) {
  var Picky = {};

  // Picky.SingleSelect
  // ------------------
  // A single-select mixin for Backbone.Collection, allowing a single
  // model to be selected within a collection. Selection of another
  // model within the collection causes the previous model to be
  // deselected.

  Picky.SingleSelect = function(collection, models){
    this._pickyCid = _.uniqueId('singleSelect');
    this.collection = collection;

    if (arguments.length > 1) {

      // 'models' argument provided, model-sharing mode
      _.each(models || [], function (model) {
        registerCollectionWithModel(model, this);
        if (model.selected) this.selected = model;
      }, this);

      this.collection.listenTo(this.collection, '_selected', this.select);
      this.collection.listenTo(this.collection, '_deselected', this.deselect);

      this.collection.listenTo(this.collection, 'reset', onResetSingleSelect);
      this.collection.listenTo(this.collection, 'add', onAdd);
      this.collection.listenTo(this.collection, 'remove', onRemove);

    }

  };

  _.extend(Picky.SingleSelect.prototype, {

    // Select a model, deselecting any previously
    // selected model
    select: function(model, options){
      var reselected = model && this.selected === model ? model : undefined;

      options || (options = {});
      options._processedBy || (options._processedBy = []);
      if (options._processedBy[this._pickyCid]) { return; }

      if (!reselected) {
        this.deselect(undefined, _.omit(options, "_silentLocally"));
        this.selected = model;
      }
      options._processedBy[this._pickyCid] = this;

      if (!options._processedBy[this.selected.cid]) this.selected.select(_.omit(options, "_silentLocally"));

      if (!(options.silent || options._silentLocally)) {
        if (reselected) {
          if (!options._silentReselect) this.trigger("reselect:one", model);
        } else {
          this.trigger("select:one", model);
        }
      }
    },

    // Deselect a model, resulting in no model
    // being selected
    deselect: function(model, options){
      options || (options = {});
      if (!this.selected){ return; }

      model = model || this.selected;
      if (this.selected !== model){ return; }

      delete this.selected;
      if (!options._skipModelCall) model.deselect(_.omit(options, "_silentLocally"));
      if (!(options.silent || options._silentLocally)) this.trigger("deselect:one", model);
    },

    close: function () {
      unregisterCollectionWithModels(this);
      this.stopListening();
    }

  });

  // Picky.MultiSelect
  // -----------------
  // A multi-select mixin for Backbone.Collection, allowing a collection to
  // have multiple items selected, including `selectAll` and `deselectAll`
  // capabilities.

  Picky.MultiSelect = function (collection, models) {
    this._pickyCid = _.uniqueId('multiSelect');
    this.collection = collection;
    this.selected = {};

    if (arguments.length > 1) {

      // 'models' argument provided, model-sharing mode
      _.each(models || [], function (model) {
        registerCollectionWithModel(model, this);
        if (model.selected) this.selected[model.cid] = model;
      }, this);

      this.collection.listenTo(this.collection, '_selected', this.select);
      this.collection.listenTo(this.collection, '_deselected', this.deselect);

      this.collection.listenTo(this.collection, 'reset', onResetMultiSelect);
      this.collection.listenTo(this.collection, 'add', onAdd);
      this.collection.listenTo(this.collection, 'remove', onRemove);

    }

  };

  _.extend(Picky.MultiSelect.prototype, {

    // Select a specified model, make sure the
    // model knows it's selected, and hold on to
    // the selected model.
    select: function (model, options) {
      var prevSelectedCids = _.keys(this.selected),
          reselected = this.selected[model.cid] ? [ model ] : [];

      options || (options = {});
      options._processedBy || (options._processedBy = []);

      if (reselected.length && options._processedBy[this._pickyCid]) { return; }

      if (!reselected.length) {
        this.selected[model.cid] = model;
        this.selectedLength = _.size(this.selected);
      }
      options._processedBy[this._pickyCid] = this;

      if (!options._processedBy[model.cid]) model.select(_.omit(options, "_silentLocally"));
      triggerMultiSelectEvents(this, prevSelectedCids, options, reselected);
    },

    // Deselect a specified model, make sure the
    // model knows it has been deselected, and remove
    // the model from the selected list.
    deselect: function (model, options) {
      var prevSelectedCids = _.keys(this.selected);

      options || (options = {});
      if (!this.selected[model.cid]) { return; }

      delete this.selected[model.cid];
      this.selectedLength = _.size(this.selected);

      if (!options._skipModelCall) model.deselect(_.omit(options, "_silentLocally"));
      triggerMultiSelectEvents(this, prevSelectedCids, options);
    },

    // Select all models in this collection
    selectAll: function (options) {
      var prevSelectedCids = _.keys(this.selected),
          reselected = [];

      options || (options = {});
      options._processedBy || (options._processedBy = []);

      this.selectedLength = 0;
      this.each(function (model) {
        this.selectedLength++;
        if (this.selected[model.cid]) reselected.push(model);
        this.select(model, _.extend({}, options, {_silentLocally: true}));
      }, this);
      options._processedBy[this._pickyCid] = this;

      triggerMultiSelectEvents(this, prevSelectedCids, options, reselected);
    },

    // Deselect all models in this collection
    deselectAll: function (options) {
      var prevSelectedCids;

      if (this.selectedLength === 0) { return; }
      prevSelectedCids = _.keys(this.selected);

      this.each(function (model) {
        if (model.selected) this.selectedLength--;
        this.deselect(model, _.extend({}, options, {_silentLocally: true}));
      }, this);

      this.selectedLength = 0;
      triggerMultiSelectEvents(this, prevSelectedCids, options);
    },

    selectNone: function (options) {
      this.deselectAll(options);
    },

      // Toggle select all / none. If some are selected, it
    // will select all. If all are selected, it will select 
    // none. If none are selected, it will select all.
    toggleSelectAll: function (options) {
      if (this.selectedLength === this.length) {
        this.deselectAll(options);
      } else {
        this.selectAll(options);
      }
    },

    close: function () {
      unregisterCollectionWithModels(this);
      this.stopListening();
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
      var reselected = this.selected;

      options || (options = {});
      options._processedBy || (options._processedBy = []);

      if (options._processedBy[this.cid]) { return; }

      this.selected = true;
      options._processedBy[this.cid] = this;

      if (this._pickyCollections) {
        // Model-sharing mode: notify collections with an event
        this.trigger("_selected", this, _.omit(options, "_silentLocally"));
      } else if (this.collection) {
        // Single collection only: no event listeners set up in collection, call
        // it directly
        if (!options._processedBy[this.collection._pickyCid]) this.collection.select(this, _.omit(options, "_silentLocally"));
      }

      if (!(options.silent || options._silentLocally)) {
        if (reselected) {
          if (!options._silentReselect) this.trigger("reselected", this);
        } else {
          this.trigger("selected", this);
        }
      }
    },

    // Deselect this model, and tell our
    // collection that we're deselected
    deselect: function (options) {
      options || (options = {});
      if (!this.selected) { return; }

      this.selected = false;

      if (this._pickyCollections) {
        // Model-sharing mode: notify collections with an event
        this.trigger("_deselected", this, _.omit(options, "_silentLocally"));
      } else if (this.collection) {
        // Single collection only: no event listeners set up in collection, call
        // it directly
        this.collection.deselect(this, _.omit(options, "_silentLocally"));
      }

      if (!(options.silent || options._silentLocally)) this.trigger("deselected", this);
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

  // Trigger events from a multi-select collection based on the number of
  // selected items.
  var triggerMultiSelectEvents = function (collection, prevSelectedCids, options, reselected) {
    options || (options = {});
    if (options.silent || options._silentLocally) return;

    var selectedLength = collection.selectedLength,
        length = collection.length,
        unchanged = (selectedLength === prevSelectedCids.length && _.intersection(_.keys(collection.selected), prevSelectedCids).length === selectedLength);

    if (reselected && reselected.length && !options._silentReselect) {
      collection.trigger("reselect:any", reselected);
    }

    if (unchanged) return;

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
    if (model.selected) collection.select(model, {_silentReselect: true});
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

    if (deselectOnRemove) onRemove(deselectOnRemove, collection, {_silentLocally: true});

    selected = collection.filter(function (model) { return model.selected; });
    excessiveSelections = _.initial(selected);
    if (excessiveSelections.length) _.each(excessiveSelections, function (model) { model.deselect(); });
    if (selected.length) collection.select(_.last(selected), {silent: true});
  }

  function onResetMultiSelect (collection, options) {
    var select,
        deselect = _.filter(options.previousModels, function (model) { return model.selected; });

    if (deselect) _.each(deselect, function (model) { onRemove(model, collection, {_silentLocally: true}); });

    select = collection.filter(function (model) { return model.selected; });
    if (select.length) _.each(select, function (model) { collection.select(model, {silent: true}); });
  }

  function registerCollectionWithModel(model, collection) {
    model._pickyCollections || (model._pickyCollections = []);
    model._pickyCollections.push(collection._pickyCid);
  }

  function unregisterCollectionWithModels (collection) {
    collection.each(function (model) {
      onRemove(model, collection, {_silentLocally: true});
    });
  }

  return Picky;
})(Backbone, _);
