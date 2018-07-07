sap.ui.define([
	"sap/ui/base/Object"
], function(Object) {
	"use strict";
	/*eslint-env es6*/

	return Object.extend("my.sapui5_components_library.yandex.maps.PlacemarkDetail", {
		constructor: function({
				oContext = null, 
				oParams: {
					sIcon = undefined,
					sIconWidth = "0px",
					sIconHeight = "0px",
					fnText = (oContext) => "",
					fnIcon = undefined,
					fnIsVisible = (oContext) => true
				} = {}
		} = {}) {
			this._oModelContext = oContext;
			this._sIcon = sIcon;
			this._sIconWidth = sIconWidth;
			this._sIconHeight = sIconHeight;
			this._fnText = fnText;
			this._fnIcon = fnIcon;
			this._fnIsVisible = fnIsVisible;
		},
		getProperty: function(sPath) {
			return this._oModelContext.getProperty(sPath);
		},
		renderHtml: function() {
			if (!this._fnIsVisible(this._oModelContext)) {
				return "";
			}
			return '<span class="map_placemark_detail">' + this.renderIcon() + this._fnText(this._oModelContext) + '</span>';
		},
		renderIcon: function() {
			if (!this._sIcon && !this._fnIcon) {
				return "";
			}
			return '<img ' + 
						'src="' + this.getIconSrc() + '" ' + 
						'width="' + this._sIconWidth + '" ' + 
						'height="' + this._sIconHeight + '" ' + 
					'/>';
		},
		getIconSrc: function() {
			if (this._fnIcon) {
				return this._fnIcon(this._oModelContext);
			} else {
				return this._sIcon;
			}
		},
		renderText: function() {
			if (!this._sText || this._sText === "") {
				return "";
			}
			return this.replaceBinding(this._sText);
		},
		replaceBinding: function(sText) {
			return sText;
		}
	});
});