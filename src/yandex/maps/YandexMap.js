sap.ui.define([
	"sap/ui/base/Object",
	"my/sapui5_components_library/utils/ResourceLoader",
	"my/sapui5_components_library/yandex/maps/TruckPlacemark",
	"my/sapui5_components_library/yandex/maps/LocationPlacemark",
	"my/sapui5_components_library/yandex/maps/MapPlacemark",
	"my/sapui5_components_library/yandex/maps/PlacemarkDetail",
	"my/sapui5_components_library/yandex/maps/MapPlacemarkCollection"
], function (Object, ResourceLoader, TruckPlacemark, LocationPlacemark, MapPlacemark, PlacemarkDetail, MapPlacemarkCollection) {
	"use strict";
	/*eslint-env es6*/
	/*global ymaps*/

	// https://tech.yandex.ru/maps/jsbox/2.1/object_manager_spatial
	return Object.extend("my.sapui5_components_library.yandex.maps.YandexMap", {
		constructor: function () {
			this._oMap = null;

		},
		init: function ({
			oContext = null,
			sMapControlId = undefined,
			oParams: {
				sCenterProperty = undefined,
				aPlacemarks = [],
				aPlacemarkCollections = [],
				aRoutes = []
			}
		} = {}) {
			this._oModelContext = oContext;
			this._sMapControlId = sMapControlId;
			this._sCenterProperty = sCenterProperty;
			this._sCenterValue = null;
			this._aPlacemarks = aPlacemarks;
			this._oGeoObjectCollection = new ymaps.GeoObjectCollection({}, {
				strokeWidth: 4,
				geodesic: true
			});
			this._aPlacemarkCollections = aPlacemarkCollections;
			this._oGeoObjectCollectionForRoutes = new ymaps.GeoObjectCollection({}, {
				strokeWidth: 4,
				geodesic: true
			});
			this._aRoutes = aRoutes;
			this.createMap();
		},
		bindElement: function (oContext) {
			this._oModelContext = oContext;
			this._oCenterBinding = new sap.ui.model.Binding(
				this._oModelContext.getModel(),
				this._oModelContext.getPath() + "/" + this._sCenterProperty,
				this._oModelContext.getModel().getContext(this._oModelContext.getPath() + "/" + this._sCenterProperty));
			this._oCenterBinding.attachChange(this.renderMap, this);

			this._aPlacemarks.forEach((oPlacemark) => oPlacemark.bindElement(oContext));
			this.aRoutes.forEach((oRoute) => oRoute.bindElement(oContext));
			this._aPlacemarkCollections.forEach((oPlacemarkCollection) => oPlacemarkCollection.bindElement(oContext));

			this.renderMap();
			// ADD placemark rendering;
		},
		renderMap: function () {
			if (this._oModelContext.getProperty(this._sCenterProperty)) {
				this.setCenter(this._oModelContext.getProperty(this._sCenterProperty));
			}
			this.refreshPacemarks();
			this.refreshRoutes();
			/*if (this._oMap) {
				this.setCenter(this._oModelContext.getProperty(this._sCenterProperty));
			} else {
				this.createMapControl().then(this.renderMap);
			}*/
		},
		createMap: function () {
			/*if (!this._oModelContext.getProperty(this._sCenterProperty)) {
				this._oCenterBinding = new sap.ui.model.Binding(
					this._oModelContext.getModel(),
					this._oModelContext.getPath() + "/" + this._sCenterProperty,
					this._oModelContext.getModel().getContext(this._oModelContext.getPath() + "/" + this._sCenterProperty));
				let that = this;
				that._oCenterBinding.attachChange((oEvent) => that.createMapDelayed());
			} else {*/
			this.createMapDelayed();
			//}
		},
		createMapDelayed: function () {
			if (!this._oMap) {
				this.createMapControl().then(() => this.createMapObjects());
			}
		},
		createMapObjects: function () {
			this.createPlacemarks();
			this.cratePlacemarkCollections();
			this.refreshRoutes();
		},
		refreshPacemarks: function() {
			this._oMap._oGeoObjectCollection.removeAll();
			this.createPlacemarks();
		},
		createPlacemarks: function () {
			
			this._aPlacemarks.forEach((oPlacemark) => {
				//this._aPlacemarks.push(oPlacemark);
				this._oGeoObjectCollection.add(oPlacemark.createPlacemark());
			});
			this._oMap.geoObjects.add(this._oGeoObjectCollection);
		},
		cratePlacemarkCollections: function () {
			this._aPlacemarkCollections.forEach((oPlacemarkCollection) => oPlacemarkCollection.createPlacemarks());
		},
		refreshRoutes: function () {
			this._aRoutes.forEach((oRoute) => oRoute.onRefresh());
		},
		createMapControl: function () {
			let that = this;
			return new Promise(function (resolve, reject) {
				if (!that._oMap) {
					let oResourceLoader = new ResourceLoader();
					oResourceLoader.getScript("https://api-maps.yandex.ru/2.1/?lang=ru_RU")
						.then(() => ymaps.ready(function () {
							that._oMap = new ymaps.Map(that._sMapControlId, {
								//center: that.convertGeoLocation(that._oModelContext.getProperty(that._sCenterProperty)),
								center: [55.752515, 37.611786],
								zoom: 9
							}, {
								searchControlProvider: 'yandex#search'
							});
							resolve(that._oMap);
						}));
				} else {
					resolve(that._oMap);
				}
			});
		},
		setCenter: function (sGeoLocation) {
			if (this._sCenterValue !== sGeoLocation) {
				this._oMap.setCenter(this.convertGeoLocation(sGeoLocation), 9);
				this._sCenterValue = sGeoLocation;
			}
		},
		convertGeoLocation: function (sGeoLocation) {
			let aGeoLocationCoordinates = [0, 0];
			aGeoLocationCoordinates[0] = Number(sGeoLocation.split(",")[0].trim());
			aGeoLocationCoordinates[1] = Number(sGeoLocation.split(",")[1].trim());
			return aGeoLocationCoordinates;
		},
		initYandexMapsApi: function () {
				return new Promise(function (resolve, reject) {
					if (typeof ymaps === 'undefined') {
						let oResourceLoader = new ResourceLoader();
						oResourceLoader.getScript("https://api-maps.yandex.ru/2.1/?lang=ru_RU")
							.then(() => ymaps.ready(() => resolve(ymaps)));
					} else {
						resolve(ymaps);
					}
				});
			}
			/*bind: function(oODataModel, sTransportationPath, sMapControlId) {
				this._oODataModel = oODataModel;
				this._sTransportationPath = sTransportationPath;
				this._sMapControlId = sMapControlId;
				let that = this;
				that._oBinding = new sap.ui.model.Binding(that._oODataModel,
					sTransportationPath + "/TransportationAssignmentDetails",
					that._oODataModel.getContext(sTransportationPath + "/TransportationAssignmentDetails"));
				that._oBinding.attachChange(function(oEvent) {
					that.prepareMap(that._oODataModel.getProperty(sTransportationPath + "/ShippingLocationDetails/GeoLocation"))
						.then(() => that.renderMap());
				});
			},
			renderMap: function() {
				this._oMap.geoObjects.removeAll();
				this.aPlacemarks = [];
				this.addLocationsToMap();
				this.addTrucksToMap();
			},
			prepareMap: function(sCenterGeoLocation) {
				let that = this;
				return new Promise(function(resolve, reject) {
					if (!that._oMap) {
						let oResourceLoader = new ResourceLoader();
						oResourceLoader.getScript("https://api-maps.yandex.ru/2.1/?lang=ru_RU")
							.then(() => ymaps.ready(function() {
								that._oMap = new ymaps.Map(that._sMapControlId, {
									center: that.convertGeoLocation(sCenterGeoLocation),
									zoom: 9
								}, {
									searchControlProvider: 'yandex#search'
								});
								resolve(that._oMap);
							}));
					} else {
						resolve(that._oMap);
					}
				});
			},
		
			addLocationsToMap: function() {
				let that = this;
				if (that._oODataModel.getProperty(that._sTransportationPath + "/TransportationLocationAssignmentDetails")) {
					that._oODataModel.getProperty(that._sTransportationPath + "/TransportationLocationAssignmentDetails")
						.forEach((locationAssignment) => {
							let oLocationAssignment = new LocationPlacemark(that, new sap.ui.model.Context(that._oODataModel, "/" + locationAssignment));
							that.aPlacemarks.push(oLocationAssignment);
							that._oMap.geoObjects.add(oLocationAssignment.createPlacemark());
						});
				}
				//let oLocationPlacemark = new LocationPlacemark(this, new sap.ui.model.Context(this._oODataModel, this._sTransportationPath));

				let oShipFromPlaceMark = new MapPlacemark({
					oMapControl: that,
					oContext: new sap.ui.model.Context(that._oODataModel, that._sTransportationPath),
					oParams: {
						sGeoLocationProperty: "ShippingLocationDetails/GeoLocation",
						sIcon: "images/farm.png",
						aBottomDetails: [new PlacemarkDetail({
							oContext: new sap.ui.model.Context(that._oODataModel, that._sTransportationPath),
							oParams: {
								sIcon: "images/message_sent.png",
								sIconWidth: "12px",
								sIconHeight: "6px"
							}
						})],
						aHintDetails: [new PlacemarkDetail({
							oContext: new sap.ui.model.Context(that._oODataModel, that._sTransportationPath),
							oParams: {
								fnText: (oContext) => "Ship From: " + oContext.getProperty("ShipFrom")
							}
						})]
					}
				});
				that.aPlacemarks.push(oShipFromPlaceMark);
				that._oMap.geoObjects.add(oShipFromPlaceMark.createPlacemark());

				/*let sShipFromGeoLocation = that._oODataModel.getProperty(that._sTransportationPath + "/ShippingLocationDetails/GeoLocation");
				that._oShipFromPlaceMark = new ymaps.Placemark(that.convertGeoLocation(sShipFromGeoLocation), {
					hintContent: 'Склад-отправитель',
					balloonContent: 'Отправитель'
				}, {
					iconLayout: 'default#imageWithContent',
					iconImageHref: 'images/farm.png',
					iconImageSize: [37, 37],
					iconImageOffset: [0, 0],
					hideIconOnBalloonOpen: false
				});
				that._oMap.geoObjects.add(that._oShipFromPlaceMark);*/
			/*},
			addTrucksToMap: function() {
				let that = this;
				that._oODataModel.getProperty(that._sTransportationPath + "/TransportationAssignmentDetails")
					.forEach((transpAssignment) => {
						let truckPlacemark = new TruckPlacemark(that, new sap.ui.model.Context(that._oODataModel, "/" + transpAssignment));
						that.aPlacemarks.push(truckPlacemark);
						that._oMap.geoObjects.add(truckPlacemark.createPlacemark());
					});
			},*/

	});
});