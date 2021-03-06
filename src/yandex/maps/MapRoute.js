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
			this._oMultiRoute = null;
			
			this._sFromValue = undefined;
			this._sToValue = undefined;
		},
		bindElement: function(oContext) {
			this._oModelContext = oContext;
			
			let oBindingFrom = new sap.ui.model.Binding(this._oModelContext.getModel(),
				this._oModelContext.getPath() + "/" + this._sFromProperty,
				this._oModelContext.getModel().getContext(this._oModelContext.getPath() + "/" + this._sFromProperty));
			oBindingFrom.attachChange((oEvent) => this.onRefresh());
			let oBindingTo = new sap.ui.model.Binding(this._oModelContext.getModel(),
				this._oModelContext.getPath() + "/" + this._sToProperty,
				this._oModelContext.getModel().getContext(this._oModelContext.getPath() + "/" + this._sToProperty));
			oBindingTo.attachChange((oEvent) => this.onRefresh());
		},
		onRefresh: function () {
			if (this._oModelContext.getProperty(this._sFromProperty) === this._sFromValue && this._oModelContext.getProperty(this._sToProperty) === this._sToValue ) {
				return;
			}
			if (this._oMultiRoute) {
				this._oParent._oMap.geoObjects.remove(this._oMultiRoute);
				this._oMultiRoute = null;
				this._sFromValue = undefined;
				this._sToValue = undefined;
			}
			if (this._oModelContext.getProperty(this._sFromProperty) && this._oModelContext.getProperty(this._sToProperty) && this._oParent._oMap) {
				this._sFromValue = this._oModelContext.getProperty(this._sFromProperty);
				this._sToValue = this._oModelContext.getProperty(this._sToProperty);
				this._oMultiRoute = this._createRoute();
				this._oParent._oMap.geoObjects.add(this._oMultiRoute);
			}
		},
		_createRoute: function () {
			
			let that = this;
			let multiRoute = new ymaps.multiRouter.MultiRoute({
				// Описание опорных точек мультимаршрута.
				referencePoints: [
					that._oParent.convertGeoLocation(that._sFromValue),
					that._oParent.convertGeoLocation(that._sToValue)
				],
				// Параметры маршрутизации.
				params: {
					// Ограничение на максимальное количество маршрутов, возвращаемое маршрутизатором.
					results: 2
				}
			}, {
				// Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
				boundsAutoApply: false,
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