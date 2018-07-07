sap.ui.define([
	"sap/ui/base/Object"
], function(Object) {
	"use strict";
	/*eslint-env es6*/
	/*global ymaps*/

	return Object.extend("my.sapui5_components_library.yandex.maps.LocationPlacemark", {
		constructor: function(oMapControl, oContext) {
			this._oParent = oMapControl;
			this._oModelContext = oContext;
		},
		createPlacemark: function() {
			let that = this;
			let sShipFromGeoLocation = that.getProperty("ShippingLocationDetails/GeoLocation");
			//let sShipToGeoLocation = that._oODataModel.getProperty(that.getProperty("ShippingLocationDetails1/GeoLocation"));
			that._oPlacemark = new ymaps.Placemark(that._oParent.convertGeoLocation(sShipFromGeoLocation), {
				hintContent: 'Склад-отправитель',
				balloonContent: 'Отправитель'
			}, {
				iconLayout: that.createIconLayout(),
				iconShape: {
					type: 'Rectangle',
					coordinates: [
						[0, 0],
						[50, 50]
					]
				},
				hideIconOnBalloonOpen: false
			});
			return that._oPlacemark;
			//this._oMap.geoObjects.add(this._oShipFromPlaceMark);
		},
		createContextMenu: function(oEvent) {
			var menuContent =
				'<div id="menu">\
                    <ul id="menu_list">\
                        <li>Название: <br /> <input type="text" name="icon_text" /></li>\
                        <li>Подсказка: <br /> <input type="text" name="hint_text" /></li>\
                    </ul>\
                <div align="center"><input type="submit" value="Сохранить" /></div>\
                </div>';
			$('body').append(menuContent);
			$('#menu').css({
				left: oEvent.get('pagePixels')[0],
				top: oEvent.get('pagePixels')[1]
			});

			$('#menu input[type="submit"]').click(function() {
				$('#menu').remove();
			});
			return menuContent;
		},
		createIconLayout: function() {
			let sAdditionalCssClass = "";
			let sAcceptedMark = "";
			if (this.getProperty("Selected")) {
				sAdditionalCssClass = "location_placemark_container_selected";
			}
			if (this.getProperty("Status") === "ACCEPTED") {
				sAcceptedMark = '<div class="location_placemark_accepted">\
									<img src="images/checked.png" weight="12" height="12">\
								</div>';
			}
			return ymaps.templateLayoutFactory.createClass(
				'<div class="location_placemark_container ' + sAdditionalCssClass + '">\
						<div class="location_placemark_top"> <img src="images/warehouse.png" height="33px", weight="33px"> </div>\
						<div class="location_placemark_bottom">\
							<img src="images/status_3_of_5.png" weight="12" height="12">\
							$[properties.iconContent]\
						</div>\
						<div class="location_placemark_index"> ' +
							this.getProperty("AssignmentIndex") +
						'</div>' +
						sAcceptedMark +
				'</div>'
			);
		},
		createHintLayout: function() {
			return ymaps.templateLayoutFactory.createClass("<div class='my-hint'>" +
				"<b>{{ properties.object }}</b><br />" +
				"{{ properties.address }}" +
				"</div>", {
					getShape: function() {
						var el = this.getElement(),
							result = null;
						if (el) {
							var firstChild = el.firstChild;
							result = new ymaps.shape.Rectangle(
								new ymaps.geometry.pixel.Rectangle([
									[0, 0],
									[firstChild.offsetWidth, firstChild.offsetHeight]
								])
							);
						}
						return result;
					}
				}
			);
		},
		getProperty: function(sPath) {
			return this._oModelContext.getProperty(sPath);
		},
		setProperty: function(sPath, oValue) {
				return this._oModelContext.getModel().setProperty(this._oModelContext.getPath() + "/" + sPath, oValue);
			}
			/*createBalloonContentLayout: function() {
				let that = this;
				let oBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
					'<div style="margin: 2px;">' +
					'<b>{{properties.name}}</b><br/>' +
					'<br/>' +
					'<button id="counter-button"> +1 </button>' +
					'<button id="zBalloonContectSelectId"> Select </button>' +
					'<button id="z2"> Отменить привязку </button>' +
					'<button id="z3"> Подробнее </button>' +
					'</div>', {
						build: function() {
							oBalloonContentLayout.superclass.build.call(this);
							$('#zBalloonContectSelectId').bind('click', this.onCounterClick);
						},
						clear: function() {
							$('#zBalloonContectSelectIdn').unbind('click', this.onCounterClick);
							oBalloonContentLayout.superclass.clear.call(this);
						},
						onCounterClick: function() {
							if (that._oParent._oODataModel.getProperty(that._sBindingPath + "/Selected")) {
								that._oParent._oODataModel.setProperty(that._sBindingPath + "/Selected", false);
							} else {
								that._oParent._oODataModel.setProperty(that._sBindingPath + "/Selected", true);
							}
						}
					});
				return oBalloonContentLayout;
			},*/

	});
});