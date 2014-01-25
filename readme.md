# Backbone.Picky

Selectable entities as mixins for Backbone.Model and Backbone.Collection!

## Source Code And Downloads

You can download the raw source code from the "src" 
folder above, or grab one of the builds from the 
"lib" folder. 

To get the latest stable release, use these links 
which point to the 'master' branch's builds:

### Standard Builds

Development: [backbone.picky.js](https://raw.github.com/derickbailey/backbone.picky/master/lib/backbone.picky.js)

Production: [backbone.picky.min.js](https://raw.github.com/derickbailey/backbone.picky/master/lib/backbone.picky.min.js)

### AMD/RequireJS Builds

Development: [backbone.picky.js](https://raw.github.com/derickbailey/backbone.picky/master/lib/amd/backbone.picky.js)

Production: [backbone.picky.min.js](https://raw.github.com/derickbailey/backbone.picky/master/lib/amd/backbone.picky.min.js)

## Documentation

This readme file contains basic usage examples and 
details on the full API, including methods, 
properties and events.

### Annotated Source Code

Picky has annotated source code using the Docco tool to turn
comments in to documentation. This provides an in-depth look
at what each section of is doing.

##### [View The Annotated Source Code](http://derickbailey.github.com/backbone.picky/docs/backbone.picky.html)

## Requirements

Backbone.Picky requires Backbone 0.9.9 or later.

## Method Name Overrides

#### IMPORTANT NOTE ABOUT METHOD NAME "select"

The Picky collections override the method `select` on collections. At this
point, I can't think of a better name for specifying a model has been
selected. Once I find a better name, the API will change. But for now,
you will not be able to use the standard `select` method on any
collection that has a Picky collection mixin.

## Model and Collection Interactions

If you implement a `Selectable` model, the methods on the models and the
`MultiSelect` collection will keep each other in sync. That is, if you
call `model.select()` on a model, the collection will be notified of the
model being selected and it will correctly update the `selectedLength` and
fire the correct events.

Therefore, the following are functionally the same:

```js
model = new MyModel();
col = new MyCollection([model]);

model.select();
```

```js
model = new MyModel();
col = new MyCollection([model]);

col.select(model);
```

### Model Requirements For Picky Collections

Your model for a Picky collection must extend `Selectable`.

## Components of Backbone.Picky:

* **Picky.Selectable:** Creates select / deselect capabilities for a model
* **Picky.MultiSelect:** Allows a collection to know about the selection of multiple models, including select all / deselect all
* **Picky.SingleSelect:** Allow a collection to have an exclusively selected model

## Picky.Selectable

Creates selectable capabilities for a model, including tracking whether or
not the model is selected, and raising events when selection changes.

### Basic Usage

You can create selectable models

- from a selectable model type, which extends your base model,
- from an existing model instance.

To create a selectable model type, apply the mixin in its `initialize` method.
Assuming your base type is `Backbone.Model`, augment it with

```js
SelectableModel = Backbone.Model.extend({
  initialize: function(){
    Backbone.Picky.Selectable.applyTo(this);
  }
});
```

Replace `Backbone.Model` in the example above with whatever base type you work
with.

If, on the other hand, you just want to create a selectable version of a
specific model instance, make a new object based on that model.

```js
var selectable = new Backbone.Picky.Selectable(myModel);
```

### Selectable Methods

The following methods are included in the `Selectable` object.

#### Selectable#select([options])

Select a model, setting the model's `selected` property to true and
triggering a "select" event.

```js
var myModel = new SelectableModel();

myModel.on("select", function(){
  console.log("I'm selected!");
});

myModel.select(); //=> logs "I'm selected!"
myModel.selected; //=> true
```

The `select` method can be called with the `{silent: true}` option to prevent
selection-related events from firing. See the [events section](#selectable-events)
below.

#### Selectable#deselect([options])

Deselect a model, setting the model's `selected` property to false and
triggering a "deselected" event.

```js
var myModel = new SelectableModel();

myModel.on("deselected", function(){
  console.log("I'm no longer selected!");
});

// must select it before it can be deselected
myModel.select();

myModel.deselect(); //=> logs "I'm no longer selected!";
myModel.selected; //=> false
```

The `deselect` method supports the `silent` option.

#### Selectable#toggleSelected([options])

Toggles the selection state between selected and deselected by calling
the `select` or `deselect` method appropriately.

```js
var myModel = new SelectableModel();

myModel.on("select", function(){
  console.log("I'm selected!");
});

myModel.on("deselected", function(){
  console.log("I'm no longer selected!");
});

// toggle selection
myModel.toggleSelected(); //=> "I'm selected!"
myModel.toggleSelected(); //=> "I'm no longer selected!"
```

The `toggleSelected` method supports the `silent` option.

### Selectable Properties

The following properties are manipulated by the Selectable object.

#### Selectable#selected

Returns a boolean value indicating whether or not the model is
currently selected.

### Selectable Events

The events listed below are are triggered from Selectable models. Events can be
prevented from firing when Backbone.Picky methods are called with the `silent`
option, as in `myModel.select({silent: true})`.

Event handlers with standard names are invoked automatically. Standard names are
`onSelect`, `onDeselect`, and `onReselect`. If these methods exist on the model,
they are run without having to be wired up with the event manually.

Custom options can be used when invoking any method. See the [section on custom
options](#custom-options), below.

#### "selected"

Triggers when a model has been selected. Provides the selected model as the
first parameter. Runs the `onSelect` event handler if the method exists on the
model.

#### "deselected"

Triggers when a model has been deselected. Provides the selected model as the
first parameter. Runs the `onDeselect` event handler if the method exists on the
model.

#### "reselected"

Triggers when a model, which is already selected, is selected again. Provides
the re-selected model as the first parameter. Runs the `onReselect` event
handler if the method exists on the model.

## Picky.SingleSelect

Creates single-select capabilities for a `Backbone.Collection`, allowing
a single model to be exclusively selected within the collection. Selecting
another model will cause the first one to be deselected.

### Basic Usage

You can create collections supporting exclusive selections

- from a single-select collection type, which extends your base collection,
- from an existing collection instance.

#### Creating a single-select collection type

To create a single-select collection type, apply the mixin in its `initialize`
method. Assuming your base type is `Backbone.Collection`, augment it with

```js
SelectableModel = Backbone.Model.extend({
  initialize: function(){
    Backbone.Picky.Selectable.applyTo(this);
  }
});

SingleCollection = Backbone.Collection.extend({
  model: SelectableModel,

  initialize: function(){
    Backbone.Picky.SingleSelect.applyTo(this);
  }
});
```

Replace `Backbone.Collection` in the example above with whatever base type you
work with.

If you share models among multiple collections, Backbone.Picky will handle the
interaction for you. To turn on model-sharing mode, you must provide the models
as a second argument during initialization:

```js
SingleCollection = Backbone.Collection.extend({
  model: SelectableModel,

  initialize: function(models){
    Backbone.Picky.SingleSelect.applyTo(this, models);
  }
});
```

See the [section on model sharing](#sharing-models-among-collections), below,
for more.

#### Creating a single-select collection from an existing collection instance

If you just want to create a single-select version of a specific collection
instance, make a new object based on that collection.

```js
var singleSelect = new Backbone.Picky.SingleSelect(myCollection);
```

To enable [model sharing among multiple collections](#sharing-models-among-collections),
provide the models to the SingleSelect constructor:

```js
var singleSelect = new Backbone.Picky.SingleSelect(myCollection, myCollection.models);
```

### SingleSelect Methods

The following methods are provided by the `SingleSelect` object.

#### SingleSelect#select(model, [options])

Select a model. This method will store the selected model in
the collection's `selected` property, and call the model's `select`
method to ensure the model knows it has been selected.

```js
myModel = new SelectableModel();
myCol = new SingleCollection([myModel]);
myCol.select(myModel);
```

Or

```js
myModel = new SelectableModel();
myCol = new SingleCollection([myModel]);
myModel.select();
```

If the model is already selected, this is a no-op. If a previous model
is already selected, the previous model will be deselected.

The `select` method supports the `silent` option.

#### SingleSelect#deselect([model], [options])

Deselect the currently selected model. This method will remove the 
model from the collection's `selected` property, and call the model's
`deselect` method to ensure the model knows it has been deselected.

```js
myModel = new SelectableModel();
myCol = new SingleCollection([myModel]);
myCol.deselect(myModel);
```

Or

```js
myModel = new SelectableModel();
myCol = new SingleCollection([myModel]);
myModel.deselect();
```

If the model is not currently selected, this is a no-op. If you try to
deselect a model that is not the currently selected model, the actual
selected model will not be deselected.

You can call `deselect` without a model argument. The currently selected model,
if any, will be deselected in that case.

The `deselect` method supports the `silent` option.

### SingleSelect Properties

The following property is set by the multi-select automatically.

### SingleSelect#selected

Returns the one selected model for this collection

```js
myCol = new SingleCollection();
myCol.select(model);

myCol.selected; //=> model
```

### SingleSelect Events

The events listed below are triggered by the SingleSelect based on changes in
selection. Events can be prevented from firing when Backbone.Picky methods are
called with the `silent` option, as in `myCol.select(myModel, {silent: true})`.

Event handlers with standard names are invoked automatically. Standard names are
`onSelect`, `onDeselect`, and `onReselect`. If these methods exist on the
collection, they are run without having to be wired up with the event manually.

Custom options can be used when invoking any method. See the [section on custom
options](#custom-options), below.

#### "select:one"

Triggered when a model has been selected. Provides the selected model as the
first parameter, and the collection as the second. Runs the `onSelect` event
handler if the method exists on the collection.

#### "deselect:one"

Triggered when a model has been deselected. Provides the deselected model as the
first parameter, and the collection as the second.. Runs the `onDeselect` event
handler if the method exists on the collection.

The event fires when `deselect` has been called explicitly, and also when the
selection is being replaced through another call to `select`.

#### "reselect:one"

Triggered when a model, which is already selected, is selected again. Provides
the selected model as the first parameter, and the collection as the second.
Runs the `onReselect` event handler if the method exists on the collection.

## Picky.MultiSelect

Creates multi-select capabilities for a `Backbone.Collection`, including
"select all", "select none" and "select some" features.

### Basic Usage

You can create collections supporting multiple selections

- from a multi-select collection type, which extends your base collection,
- from an existing collection instance.

#### Creating a multi-select collection type

To create a multi-select collection type, apply the mixin in its `initialize`
method. Assuming your base type is `Backbone.Collection`, augment it with

```js
SelectableModel = Backbone.Model.extend({
  initialize: function(){
    Backbone.Picky.Selectable.applyTo(this);
  }
});

MultiCollection = Backbone.Collection.extend({
  model: SelectableModel,

  initialize: function(){
    Backbone.Picky.MultiSelect.applyTo(this);
  }
});
```

Replace `Backbone.Collection` in the example above with whatever base type you
work with.

If you share models among different collections, Backbone.Picky will handle the
interaction for you. To turn on model-sharing mode, you must provide the models
as a second argument during initialization:

```js
MultiCollection = Backbone.Collection.extend({
  model: SelectableModel,

  initialize: function(models){
    Backbone.Picky.MultiSelect.applyTo(this, models);
  }
});
```

See the [section on model sharing](#sharing-models-among-collections), below,
for more.

#### Creating a multi-select collection from an existing collection instance

If you just want to create a multi-select version of a specific collection
instance, make a new object based on that collection.

```js
var multiSelect = new Backbone.Picky.MultiSelect(myCollection);
```

To enable [model sharing among multiple collections](#sharing-models-among-collections),
provide the models to the MultiSelect constructor:

```js
var multiSelect = new Backbone.Picky.MultiSelect(myCollection, myCollection.models);
```

### MultiSelect Methods

The following methods are provided by the `MultiSelect` object.

#### MultiSelect#select(model, [options])

Select a model. This method will store the selected model in
the collection's `selected` list, and call the model's `select`
method to ensure the model knows it has been selected.

```js
myCol = new MultiCollection([myModel]);

myCol.select(myModel);
```

If the model is already selected, this is a no-op.

The `select` method supports the `silent` option.

#### MultiSelect#deselect(model, [options])

Deselect a model. This method will remove the  model from
the collection's `selected` list, and call the model's `deselect`
method to ensure the model knows it has been deselected.

```js
myCol = new MultiCollection([myModel]);

myCol.deselect(myModel);
```

If the model is not currently selected, this is a no-op.

The `deselect` method supports the `silent` option.

#### MultiSelect#selectAll([options])

Select all models in the collection.

```js
myCol = new MultiCollection();

myCol.selectAll();
```

Models that are already selected will not be re-selected. 
Models that are not currently selected will be selected.
The end result will be all models in the collection are
selected.

The `selectAll` method supports the `silent` option.

#### MultiSelect#deselectAll([options])

Deselect all models in the collection.

```js
myCol = new MultiCollection();

myCol.deselectAll();
```

Models that are selected will be deselected. 
Models that are not selected will not be deselected again.
The end result will be no models in the collection are
selected.

The `deselectAll` method supports the `silent` option.

#### MultiSelect#toggleSelectAll([options])

Toggle selection of all models in the collection:

```js
myCol = new MultiCollection();

myCol.toggleSelectAll(); // select all models in the collection

myCol.toggleSelectAll(); // de-select all models in the collection
```

The following rules are used when toggling:

* If no models are selected, select them all
* If 1 or more models, but less than all models are selected, select them all
* If all models are selected, deselect them all

The `toggleSelectAll` method supports the `silent` option.

### MultiSelect Properties

The following property is set by the multi-select automatically.

### MultiSelect#selected

Returns a hash of selected models, keyed from the model `cid`.

```js
myCol = new MultiCollection();
myCol.select(model);

myCol.selected;

//=> produces
// {
//   "c1": (model object here)
// }
```

#### MultiSelect#selectedLength

Returns the number of items in the collection that are selected.

```js
myCol = new MultiCollection();
myCol.select(model);

myCol.selectedLength; //=> 1
```

### MultiSelect Events

The events below are triggered by the MultiSelect based on changes in selection.
Events can be prevented from firing when Backbone.Picky methods are called with
the `silent` option, as in `myCol.select(myModel, {silent: true})`.

MultiSelect events, with the exception of `reselect:any`, pass a "diff" hash to
event handlers as the first parameter: `{ selected: [...], deselected: [...] }`.
The `selected` array holds models which have been newly selected by the action
triggering the event. Likewise, models in the `deselected` array have changed
their status from selected to deselected.

_(Note that up to version 0.2, the first parameter passed to event handlers had
been the collection.)_

Event handlers with standard names are invoked automatically. Standard names are
`onSelectNone`, `onSelectSome`, `onSelectAll` and `onReselect`. If these methods
exist on the collection, they are run without having to be wired up with the
event manually.

Custom options can be used when invoking any method. See the [section on custom
options](#custom-options), below.

#### "select:all"

Triggered when all models have been selected. Provides the ["diff" hash]
(#multiselect-events) as the first parameter, and the collection as the second.
Runs the `onSelectAll` event handler if the method exists on the collection.

#### "select:none"

Triggered when all models have been deselected. Provides the ["diff" hash]
(#multiselect-events) as the first parameter, and the collection as the second.
Runs the `onSelectNone` event handler if the method exists on the collection.

#### "select:some"

Triggered when at least 1 model is selected, but less than all models have
been selected. Provides the ["diff" hash](#multiselect-events) as the first
parameter, and the collection as the second. Runs the `onSelectSome` event
handler if the method exists on the collection.

#### "reselect:any"

Triggered when at least one model, which is already selected, is selected again.
Provides an array of the re-selected models as the first parameter. Runs the
`onReselect` event handler if the method exists on the collection.

In contrast to the other events, this event fires even if there isn't any change
in the resulting selection at all. Note that there is no separate reselect:all
event; the re-selection of all items in the collection is also covered by
`reselect:any`.

## Sharing models among collections

Models can be part of more than one collection, and Backbone.Picky still manages
selections correctly.

Collections don't have to be of the same type. A model can be part of single-
select and multi-select collections at the same time. Backbone.Picky handles all
aspects of it:

- Suppose you have selected a model (or models) in one collection, and then you
  create another one with these models. The new collection will pick up the
  selections you have already made. That also works when adding models to
  existing collections.

- The selections in a collection are updated as needed when models are removed.
  A model loses its `selected` status when it is removed from the last collection
  holding it. Resetting collections is governed by the same rules.

- When a selection, or deselection, is made with the `silent` option enabled,
  selection-related events will be silenced in all of the collections sharing
  the model.

- Edge cases are covered as well. Suppose a number of models are selected in a
  multi-select collection. You then proceed to add them to a single-select
  collection. Only one model can be selected there, so Backbone.Picky will
  deselect all but one of them. The last model added to the single-select
  collection "wins", ie its `selected` status survives.

That said, there are a few things you must and mustn't do in order to make
sharing work.

- Models passed in during instantiation must be passed on to the mixin
  constructor. Create the mixin with `Backbone.Picky.SingleSelect.applyTo(this, models)`
  instead of `Backbone.Picky.SingleSelect.applyTo(this)` (without the `models`
  argument).

  Setting up the second parameter like this turns on the "model-sharing mode".
  See the Basic Usage sections of SingleSelect and MultiSelect.

- Don't use the `silent` option when adding models, removing them, or resetting
  a collection. If you change the contents of a collection silently, the
  `selected`/`deselected` status of the shared models won't be synced across
  collections reliably.

- When a collection is no longer in use, call `close()` on it to avoid memory
  leaks.

  So don't just replace a collection like this:

        var myCol = new MySelectableCollection([myModel]);
        // ... do stuff
        myCol = new MySelectableCollection([myModel]);  // WRONG!

  Instead, call `close()` before you let an obsolete collection fade away into
  oblivion:

        var myCol = new MySelectableCollection([myModel]);
        // ... do stuff
        myCol.close();
        myCol = new MySelectableCollection([myModel]);

  Note that you don't need to call `close()` if you use Backbone.Picky in
  "single-collection mode", without sharing models among collections.

## Custom options

With custom options, you can send additional information to event handlers. Just
pass an arbitrary, custom option (or a whole bunch of them) to any method. The
option doesn't affect the operation of Backbone.Picky, but it is passed on to
the event handlers as the last argument.

```js
myCol = new SingleCollection([myModel]);
myCol.on("select:one", function (model, collection, options) {
  if (options) console.log("Selected while foo=" + options.foo);
});

myCol.select(myModel, {foo: "bar"});    // prints "Selected while foo=bar"
```

Options get passed around to all event handlers which are running. In the
example above, the event handler is set up for the collection. But it will also
pick up an option passed to the `select` method of the model, for instance.

```js
myModel.select({foo: "baz"});    // prints "Selected while foo=baz"
```

## Building Backbone.Picky

If you wish to build Backbone.Picky on your system, you will
need Ruby to run the Jasmine specs, and NodeJS to run the
grunt build. 

### To Run The Jasmine Specs

1. Be sure you have Bundler installed in your Ruby Gems. Then
run `bundle install` from the project folder

2. Once this is done, you can run `rake jasmine` to run the 
Jasmine server

3. Point your browser at `http://localhost:8888` and you will
see all of the specs for Backbone.Picky

### To Build The Packages

1. Be sure you have NodeJS and NPM installed on your system

2. Run `npm install -g grunt` to install the grunt build system

3. From the project folder, run `grunt` to produce a build

## Release Notes

### pre v0.3.0

* Added `applyTo` class methods for setup
* Event handlers with standard names are invoked automatically if they exist (`onSelect`, `onDeselect`, `onReselect`, `onSelectNone`, `onSelectSome`, `onSelectAll`)
* Options - including arbitrary, custom ones - are passed on to event handlers
* The collection is also passed to event handlers (single-select collection)
* A "diff" hash is passed to select:* event handlers (multi-select collection)
* New events capture when models are re-selected: `reselected` (model), `reselect:one` (single-select collection), `reselect:any` (multi-select collection)
* Multi-select events no longer fire when `selectAll`, `deselectAll` actions are a no-op (change in spec)
* Added support for sharing models among collections
* Added a `silent` option
* Improved events, now firing when model and collection are in a consistent state (issue #18)
* Added `deselectAll`, while keeping `selectNone` around as an alias
* More comprehensive testing
* Added config file for the Karma test runner

### v0.2.0

* Renamed `SingleSelect` events from "select" and "deselect" to "select:one" and "deselect:one"
* Pass model as argument in select:one / deselect:one events
* Updated the build to use latest grunt and related tools
* Removed reliance on ruby for any part of this project

### v0.1.0

* Added Picky.SingleSelect
* Fleshed out the specs more

### v0.0.1

* Initial release of untested code
* Basic "Selectable" mixin for models
* Basic "MultiSelect" mixin for collections

## Legal Mumbo Jumbo (MIT License)

Copyright (c) 2012 Derick Bailey, Muted Solutions, LLC

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
