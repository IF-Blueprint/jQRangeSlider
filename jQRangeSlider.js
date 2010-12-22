/* jQRangeSlider
 * A javascript slider selector that supports dates
 * 
 * Copyright (C) Guillaume Gautreau 2010
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
 
 (function ($, undefined) {
	$.widget("ui.rangeSlider", $.ui.draggable, {
		options: {
			bounds: {min:0, max:100},
			defaultValues: {min:20, max:50},
			theme: "dev",
			wheelMode: "zoom",
			wheelSpeed: 4
		},
		
		values: {min:20, max:50},
		
		// Created elements
		_bar: null,
		_leftHandle: null,
		_rightHandle: null,
		
		_create: function(){
			this._leftHandle = $("<div class='ui-rangeSlider-handle  ui-rangeSlider-leftHandle' />")
				.draggable({axis:"x", containment: "parent",
					drag: $.proxy(this._handleMoved, this), 
					stop: $.proxy(this._handleMoved, this)})
				.css("position", "absolute");
			this._rightHandle = $("<div class='ui-rangeSlider-handle ui-rangeSlider-rightHandle' />")
				.draggable({axis:"x", containment: "parent",
					drag: $.proxy(this._handleMoved, this), 
					stop: $.proxy(this._handleMoved, this)})
				.css("position", "absolute");
			this._bar = $("<div class='ui-rangeSlider-Bar' />")
				.draggable({axis:"x", containment: "parent",
					drag: $.proxy(this._barMoved, this), 
					stop: $.proxy(this._barMoved, this),
					containment: 'parent'})
				.css("position", "absolute")
				.bind("mousewheel", $.proxy(this._wheelOnBar, this));
			
			this.element
				.append(this._bar)
				.append(this._leftHandle)
				.append(this._rightHandle)
				.addClass("ui-rangeSlider");
			
			if (this.options.theme != "")
			{
				this.element.addClass("ui-rangeSlider-"+this.options.theme);
			}
			
			this._position();
		},
		
		_setOption: function(key, value) {
			if (key == "defaultValues")
			{
				if ((typeof value.min != "undefined") 
					&& (typeof value.max != "undefined") 
					&& parseFloat(value.min) === value.min 
					&& parseFloat(value.max) === value.max)
				{
					this.setValues(value.min, value.max);
				}
			}
		},
		
		_getPosition: function(value){
			return (value - this.options.bounds.min) * this.element.innerWidth() / (this.options.bounds.max - this.options.bounds.min);
		},
		
		_getValue: function(position){
			return position * (this.options.bounds.max - this.options.bounds.min) / this.element.innerWidth() + this.options.bounds.min;
		},
		
		_position: function(){
			var leftPosition = this._getPosition(this.values.min);
			var rightPosition = this._getPosition(this.values.max);
			
			this._positionHandles(leftPosition, rightPosition);
			this._bar
				.css("left", leftPosition)
				.css("width", rightPosition-leftPosition + this._bar.width() - this._bar.outerWidth(true) +1);
		},
		
		_positionHandles: function(){
			this._leftHandle.css("left", this._getPosition(this.values.min));
			this._rightHandle.css("left", this._getPosition(this.values.max) - this._rightHandle.outerWidth(true) + 1);
		},
		
		_barMoved: function(event){
			var left = this._bar.position().left;
			var right = left + this._bar.outerWidth(true) - 1;
			
			this.setValues(this._getValue(left), this._getValue(right));
		},
		
		_switchHandles: function(){
				var temp = this._leftHandle;
				this._leftHandle = this._rightHandle;
				this._rightHandle = temp;
				
				this._leftHandle
					.removeClass("ui-rangeSlider-rightHandle")
					.addClass("ui-rangeSlider-leftHandle");
				this._rightHandle
					.addClass("ui-rangeSlider-rightHandle")
					.removeClass("ui-rangeSlider-leftHandle");
		},
		
		_handleMoved: function(event){
			var left = this._leftHandle.position().left;
			var right = this._rightHandle.position().left + this._rightHandle.outerWidth(true) - 1;
			
			if (left > right){
				this._switchHandles();
				var temp = left;
				left = right;
				right = temp;
			}
				
			this.setValues(this._getValue(left), this._getValue(right));
		},
		
		_wheelOnBar: function(event, delta, deltaX, deltaY){
			if (this.options.wheelMode == "zoom"){
				var left = this._bar.position().left;
				var right = this._bar.innerWidth() + left;
				
				left -= deltaY * this.options.wheelSpeed;
				right += deltaY * this.options.wheelSpeed;
				
				if (left < 0){
					right -= left;
					left = 0;
				}
				
				if (right > this.element.innerWidth()){
					var difference = right - this.element.innerWidth();
					
					left = Math.max(0, left - difference);
					right = this.element.innerWidth();
				}
				
				this.setValues(this._getValue(left), this._getValue(right));
			}
		},
		
		_setValuesHandles: function(min, max){	
			this._setValues(min, max);
			this._positionHandles(min, max);
		},
		
		_setValues: function(min, max){	
			var diff = min - this.options.bounds.min;
			this.values.min = Math.max(this.options.bounds.min, min);
			this.values.max = Math.min(this.options.bounds.max, Math.max(max, max - diff));
			
			this.element.trigger("valuesChanged", [this.values.min, this.values.max]);
		},
		
		setValues: function(min, max){
			this._setValues(min, max);
			this._position();
		},
		
		destroy: function(){
			this._bar.detach();
			this._leftHandle.detach();
			this._rightHandle.detach();
			this.element.removeClass("ui-rangeSlider");
			
			if (this.options.theme != "")
			{
				this.element.removeClass("ui-rangeSlider-"+this.options.theme);
			}
		}
	});
})(jQuery);