sap.ui.define([
	"sap/ui/base/Object"
], function(Object) {
	"use strict";
	/*eslint-env es6*/

	return Object.extend("my.sapui5_components_library.yandex.maps.PlacemarkAction", {
		constructor: function({
				oController = null,
				oContext = null, 
				oParams: {
					sActionType = "Button",
					sIcon = undefined,
					sIconWidth = "0px",
					sIconHeight = "0px",
					fnText = (oContext) => "",
					fnIsVisible = (oContext) => true,
					fnOnPress = (oContext) => {}
				} = {}
		} = {}) {
			this._oController = oController;
			this._oModelContext = oContext;
			this._sActionType = sActionType;
			this._sIcon = sIcon;
			this._sIconWidth = sIconWidth;
			this._sIconHeight = sIconHeight;
			this._fnText = fnText;
			this._fnIsVisible = fnIsVisible;
			this._fnOnPress = fnOnPress;
			if (this._oController) {
				this._fnOnPress.bind(this._oController);
			}
			this._sDomId = "PlacemarkAction_" + Math.random().toString(36).substr(2, 9);
		},
		bindElement: function(oContext) {
			this._oModelContext = oContext;
		},
		isVisible: function() {
			return this._fnIsVisible(this._oModelContext);
		},
		getDomId: function() {
			return this._sDomId;
		},
		fireOnPress: function() {
			this._fnOnPress(this._oModelContext);
		},
		renderHtml: function() {
			if (!this.isVisible()) {
				return "";
			}
			return `<input id="${this._sDomId}" type="submit" value="${this._fnText(this._oModelContext)}" />`;
		},
		renderIcon: function() {
			if (!this._sIcon || this._sIcon === "") {
				return "";
			}
			return '<img ' + 
						'src="' + this._sIcon + '" ' + 
						'width="' + this._sIconWidth + '" ' + 
						'height="' + this._sIconHeight + '" ' + 
					'/>';
		},
		renderText: function() {
			if (!this._sText || this._sText === "") {
				return "";
			}
			return this.replaceBinding(this._sText);
		},
		replaceBinding: function(sText) {
			return sText;
		},
		getProperty: function(sPath) {
			return this._oModelContext.getProperty(sPath);
		},
	});
});