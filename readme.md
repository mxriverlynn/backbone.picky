# Backbone.Picky

Selectable entities as mixins for Backbone.Model and Backbone.Collection!

#### NOTE: THIS CODE IS UNTESTED

I hacked this together over the last hour, while building out some functionality
for a client project. I have not written any automated tests for this
project specifically. I've tested this through my client project only,
which means 

**THIS CODE IS UNTESTED. USE AT YOUR OWN RISK**

## Picky.Selectable

Creates selectable capabilities for a model, including tracking whether or
not the model is selected, and raising events when selection changes.

```js
var selectable = new Backbone.Picky.Selectable(myModel);
```

### Basic Usage

Extend your model with the `Selectable` instance to make your model
selectable directly.

```js
SelectableModel = Backbone.Model.extend({
  initialize: function(){
    var selectable = new Backbone.Picky.Selectable(this);
    _.extend(this, selectable);
  }
});
```

### Selectable Methods

The following methods are included in the `Selectable` object

#### Selectable#select

Select a model, setting the model's `selected` attribute to true and 
triggering a "select" event.

```js
var myModel = new SelectableModel();

myModel.on("select", function(){
  console.log("I'm selected!");
});

myModel.select(); //=> logs "I'm selected!"
myModel.selected; //=> true
```
#### Selectable#deselect

Deselect a model, setting the model's `selected` attribute to false and 
triggering a "deselect" event.

```js
var myModel = new SelectableModel();

myModel.on("deselect", function(){
  console.log("I'm no longer selected!");
});

// must select it before it can be deselected
myModel.select();

myModel.deselect(); //=> logs "I'm no longer selected!";
myModel.selected; //=> false
```

#### Selectable#toggleSelected

Toggles the selection state between selected and deselected by calling
the `select` or `deselect` method appropriately.

```js
var myModel = new SelectableModel();

myModel.on("select", function(){
  console.log("I'm selected!");
});

myModel.on("deselect", function(){
  console.log("I'm no longer selected!");
});

// toggle selection
myModel.toggleSelected(); //=> "I'm selected!"
myModel.toggleSelected(); //=> "I'm no longer selected!"
```

## Picky.MultiSelect

Creates multi-select capabilities for a `Backbone.Collection`, including
select all, select none and select some features.

```js
var multiSelect = new Backbone.Picky.MultiSelect(myCollection) ;
```

### Model Requirements

Your model for the collection must implement the following API to be
usable by a `MultiSelect` collection:

* `select: function(){...}`
* `deselect: function(){...}`

The easiest way to do this is to have your model extend `Selectable` as
shown above.

### Model and Collection Interactions

If you implement a `Selectable` model, the methods on the models and the
`MultiSelect` collection will keep each other in sync. That is, if you
call `model.select()` on a model, the collection will be notified of the
model being selected and it will correctly update the `selectedLength` and
fire the correct events.

### Basic Usage

Extend your collection with the `MultiSleect` instance to make your 
collection support multiple selections directly.

```js

SelectableModel = Backbone.Model.extend({
  initialize: function(){
    var selectable = new Backbone.Picky.Selectable(this);
    _.extend(this, selectable);
  }
});

MultiCollection = Backbone.Collection.extend({
  
  model: SelectableModel,

  initialize: function(){
    var multiSelect = new Backbone.Picky.MultiSelect(this);
    _.extend(this, multiSelect);
  }
});
```
### MultiSelect Methods

The following methods are provided by the `MultiSelect` object

#### select(model)

#### deselect(model)

#### selectAll

#### deselectAll

#### toggleSelectAll

### MultiSelect Attributes

The following attribute is set by the multi-select automatically

### selected

Returns a hash of selected models, keyed from the model `cid`.

#### selectedLength

Returns the number of items in the collection that are selected.

### MultiSelect Events

The following events are triggered by the MultiSelect based on changes
in selection:

#### "select:all"

Triggered when all models have been selected

#### "select:none"

Triggered when all models have been deselected

#### "select:some"

Triggered when at least 1 model is selected, but less than all models have
been selected

## Release Notes

### v0.0.1

* Initial release of untested code
* Basic "Selectable" mixin for models
* Basic "MultiSelect" mixin for collections

## Legal Mumbo Jumbo (MIT License)

Copyright (c) 2012 Derick Bailey, Muted Solutions, LLC

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
