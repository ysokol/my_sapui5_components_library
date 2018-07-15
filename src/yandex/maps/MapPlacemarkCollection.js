sap.ui.define([
	"sap/ui/base/Object"
], function(Object) {
	"use strict";
	/*eslint-env es6*/
	/*global ymaps*/

	// https://codeburst.io/es6-destructuring-the-complete-guide-7f842d08b98f
	return Object.extend("my.sapui5_components_library.yandex.maps.MapPlacemarkCollection", {
		constructor: function({
			oMapControl = null,
			oContext = null,
			oParams: {
				sItemsPath = undefined,
				fnPlacemarkConstructor = (oMapControl, sItemPath) => null
			} = {}
		} = {}) {
			this._oParent = oMapControl;
			this._oModelContext = oContext;
			this._sItemsPath = sItemsPath;
			this._fnPlacemarkConstructor = fnPlacemarkConstructor;
			this._aPlacemarks = [];
			this._oGeoObjectCollection = new ymaps.GeoObjectCollection({}, {
				strokeWidth: 4,
				geodesic: true
			});
			
			let that = this;
			that._oBinding = new sap.ui.model.Binding(that._oModelContext.getModel(),
				that._oModelContext.getPath() + "/" + that._sItemsPath,
				that._oModelContext.getModel().getContext(that._oModelContext.getPath() + "/" + that._sItemsPath));
			that._oBinding.attachChange((oEvent) => that.refreshPlacemarks());

		},
		bindElement: function(oContext) {
			this.removeAll();
			this._oModelContext = oContext;
			this._oBinding = new sap.ui.model.Binding(this._oModelContext.getModel(),
				this._oModelContext.getPath() + "/" + this._sItemsPath,
				this._oModelContext.getModel().getContext(this._oModelContext.getPath() + "/" + this._sItemsPath));
			this._oBinding.attachChange(this.refreshPlacemarks, this);
			if (this._oModelContext.getProperty(this._sItemsPath)) {
				this.createPlacemarks();
			}
		},
		createPlacemarks: function() {
			if (this._aPlacemarks.length === 0 && this._oParent._oMap) {
				let that = this;
				that._oModelContext.getProperty(that._sItemsPath)
					.forEach((sItemPath) => {
						let oPlacemark = this._fnPlacemarkConstructor(that._oParent, sItemPath);
						that._aPlacemarks.push(oPlacemark);
						that._oGeoObjectCollection.add(oPlacemark.createPlacemark());
					});
				that._oParent._oMap.geoObjects.add(that._oGeoObjectCollection);
			}
		},
		removeAll: function() {
			this._oGeoObjectCollection.removeAll();
			this._aPlacemarks = [];
		},
		refreshPlacemarks: function() {
			this.removeAll();
			this.createPlacemarks();
		}
	});
});