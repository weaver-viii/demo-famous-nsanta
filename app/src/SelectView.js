/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: mark@famo.us
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

define(function(require, exports, module) {
    var Surface = require('famous/core/Surface');
    var View = require('famous/core/View');
    var Deck = require('famous/views/Deck');
    var Transform = require('famous/core/Transform');
    var Modifier = require('famous/core/Modifier');
    var Transitionable = require('famous/transitions/Transitionable');
    var SpringTransition = require('famous/transitions/SpringTransition');
    Transitionable.registerMethod('spring', SpringTransition);

    function SelectView(options) {
        this._opts     = options.opts || [];
        this._button = new Surface(arguments);
        this._button.elementType = 'button';
        this._deckModifier = new Modifier({
          transform: Transform.translate(0,0, 1000),
          size: [window.innerWidth, window.innerHeight]
        });
        this._deck = new Deck({
            itemSpacing: this._opts.length,
            transition: {
                method: 'spring',
                period: 300,
                dampingRatio: 0.5
            },
            //stackRotation: 0.02
        });
        View.apply(this, arguments);
        this._add(this._button);
        this._buildSelect();
        this._add(this._deckModifier).add(this._deck); 
    }
    SelectView.prototype = Object.create(View.prototype);
    SelectView.prototype.constructor = SelectView;

    SelectView.prototype.setPlaceholder = function setPlaceholder(str) {
        this._placeholder = str;
        this._contentDirty = true;
        return this;
    };

    SelectView.prototype.setValue = function setValue(value) {
        this.value = value;
    };

    SelectView.prototype._buildSelect = function _buildSelect(){
       var surfaces = [];
       var self = this;
       this._deck.sequenceFrom(surfaces);
       for(var value in this._opts) {
           var state = undefined;
           if(value === this.value) state = 'active'; 
           var temp = new Surface({
               size: [100, 200],
               classes: ['famous-option', state],
               content: this._opts[value],
               properties: {
                  background: "#505050"
               }
           });
           temp.value = value;
           temp.on('click', function(){
               self.setValue(value);
               if(self._deck.active) self._deck.active.setClasses('');
               this.setClasses('active');
               self._deck.active = this;
               self._deck.close();
           });
           surfaces.push(temp);
       };
       this._button.on('click', function(){
          self._deck.open();
       });
    }
  
    module.exports = SelectView;
});