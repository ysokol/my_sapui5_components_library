sap.ui.define([
	"sap/ui/base/Object"
], function (Object) {
	"use strict";
	/*eslint-env es6*/
	/*global ymaps*/

	// https://codeburst.io/es6-destructuring-the-complete-guide-7f842d08b98f
	return Object.extend("my.sapui5_components_library.yandex.maps.MapRoute", {
		constructor: function ({
			oMapControl = null,
			oContext = null,
			oParams: {
				sFromProperty = undefined,
				sToProperty = undefined,
				sColor = undefined,
				sActiveColor = undefined
			} = {}
		} = {}) {
			this._oParent = oMapControl;
			this._oModelContext = oContext;
			this._sFromProperty = sFromProperty;
			this._sToProperty = sToProperty;
			this._sColor = sColor;
			this._sActiveColor = sActiveColor;
		},
		createRoute: function () {
			let that = this;
			let multiRoute = new ymaps.multiRouter.MultiRoute({
				// Описание опорных точек мультимаршрута.
				referencePoints: [
					that._oParent.convertGeoLocation(that._oModelContex.getProperty(that._sFromProperty)),
					that._oParent.convertGeoLocation(that._oModelContex.getProperty(that._sToProperty))
				],
				// Параметры маршрутизации.
				params: {
					// Ограничение на максимальное количество маршрутов, возвращаемое маршрутизатором.
					results: 2
				}
			}, {
				// Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
				boundsAutoApply: true,
				wayPointStartIconLayout: "default#image",
        		wayPointStartIconImageHref: "",
        		wayPointFinishIconLayout: "default#image",
        		wayPointFinishIconImageHref: "",
        		routeActiveStrokeColor: that._sActiveColor,
        		routeStrokeColor: that._sColor
			});
			return multiRoute;
		}
	});
});