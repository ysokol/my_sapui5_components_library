sap.ui.define([
	"sap/ui/base/Object"
], function (Object) {
	"use strict";
	/*eslint-env es6*/
	/*global ymaps*/

	// https://codeburst.io/es6-destructuring-the-complete-guide-7f842d08b98f
	return Object.extend("my.sapui5_components_library.yandex.maps.MapPlacemark", {
		constructor: function ({
			oMapControl = null,
			oContext = null,
			oParams: {
				sGeoLocationProperty = undefined,
				sSelectedProperty = undefined,
				sIcon = undefined,
				aBottomDetails = [],
				aRightDetails = [],
				oCenterDetails = null,
				oTopLeftDetails = null,
				oBottomRightDetails = null,
				oTopRightDetails = null,
				aHintDetails = [],
				aPlacemarkActions = [],
				fnIsActive = (oContext) => true      
			} = {}
		} = {}) {
			this._oParent = oMapControl;
			this._oModelContext = oContext;
			this._sGeoLocationProperty = sGeoLocationProperty;
			this._sSelectedProperty = sSelectedProperty;
			this._sIcon = sIcon;
			this._aBottomDetails = aBottomDetails;
			this._aRightDetails = aRightDetails;
			this._oCenterDetails = oCenterDetails;
			this._oTopLeftDetails = oTopLeftDetails;
			this._oBottomRightDetails = oBottomRightDetails;
			this._oTopRightDetails = oTopRightDetails;
			this._aHintDetails = aHintDetails;
			this._aPlacemarkAction = aPlacemarkActions;
			this._fnIsActive = fnIsActive;
		},
		createPlacemark: function () {
			let that = this;
			this._oPlacemark = new ymaps.Placemark(
				that._oParent.convertGeoLocation(
					that.getProperty(that._sGeoLocationProperty)
				), {}, {
					iconLayout: that.createIconLayout(),
					iconShape: {
						type: 'Rectangle',
						coordinates: [
							[0, -50],
							[50, 0]
						]
					},
					hintLayout: that.createHintLayout(),
					balloonContentLayout: that.createBalloonContentLayout(),
					hideIconOnBalloonOpen: false,
					openBalloonOnClick: false,
					balloonPanelMaxMapArea: 0
				});
			if (this._sSelectedProperty) {
				this._oPlacemark.events.add("click", function (oEvent) {
					if (that.getProperty(that._sSelectedProperty)) {
						that.setProperty(that._sSelectedProperty, false);
					} else {
						that.setProperty(that._sSelectedProperty, true);
					}
				});
			}
			this._oPlacemark.events.add("contextmenu", function (oEvent) {
				that._oPlacemark.balloon.open();
				/*if ($('#menu').css('display') === 'block') {
					$('#menu').remove();
				} else {
					that.createContextMenu(oEvent);
				}*/
			});
			return this._oPlacemark;
		},
		createIconLayout: function () {
			let sAdditionalCssClass = "";
			if (this._sSelectedProperty && this.getProperty(this._sSelectedProperty)) {
				sAdditionalCssClass += " map_placemark_container_selected";
			}
			if (!this._fnIsActive(this._oModelContext)) {
				sAdditionalCssClass += " map_placemark_container_inactive";
			}
			return ymaps.templateLayoutFactory.createClass(
				'<div class="map_placemark_container ' + sAdditionalCssClass + '">' +
				((this._aRightDetails.length !== 0) ?
					'<div class="map_placemark_icon"> <img src="' + this._sIcon + '" height="37px" weight="37px"> </div>' :
					'<div class="map_placemark_icon_no_right_details"> <img src="' + this._sIcon + '" height="25" weight="48px"> </div>'
				) +
				'<div class="map_placemark_bottom_content">' +
				((this._aBottomDetails) ? this.renderDetails(this._aBottomDetails) : "") +
				'</div>' +
				'<div class="map_placemark_right_content">' +
				((this._aRightDetails) ? this.renderDetailsWithDiv(this._aRightDetails) : "") +
				'</div>' +
				'<div class="map_placemark_center">' +
				((this._oCenterDetails) ? this._oCenterDetails.renderHtml() : "") +
				'</div>' +
				'<div class="map_placemark_top_left">' +
				((this._oTopLeftDetails) ? this._oTopLeftDetails.renderHtml() : "") +
				'</div>' +
				'<div class="map_placemark_bottom_right">' +
				((this._oBottomRightDetails) ? this._oBottomRightDetails.renderHtml() : "") +
				'</div>' +
				'<div class="map_placemark_top_right">' +
				((this._oTopRightDetails) ? this._oTopRightDetails.renderHtml() : "") +
				'</div>' +
				'</div>'
			);
		},
		renderDetails: function (aPlacemarkDetails) {
			return aPlacemarkDetails.reduce((sAccumulator, oPlacemarkDetail) => sAccumulator + oPlacemarkDetail.renderHtml(), "");
		},
		renderDetailsWithDiv: function (aPlacemarkDetails) {
			return aPlacemarkDetails.reduce((sAccumulator, oPlacemarkDetail) => sAccumulator + "<div>" + oPlacemarkDetail.renderHtml() +
				"</div>", "");
		},
		createHintLayout: function () {
			return ymaps.templateLayoutFactory.createClass(
				"<div class='my-hint'>" +
				this.renderDetailsWithDiv(this._aHintDetails) +
				"</div>", {
					getShape: function () {
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
		createContextMenu: function (oEvent) {
			let sMenuItemsHtml = this._aPlacemarkAction.reduce(
				(sAccumulator, oAction) => (oAction.isVisible()) ?
				sAccumulator + "<li>" + oAction.renderHtml() + "</li>" :
				sAccumulator,
				"");

			let sMenuContent =
				'<div id="menu">' +
				'<ul id="menu_list">' +
				sMenuItemsHtml +
				'</ul>' +
				'<div align="center"><input id = "MapPlacemarkCloseMenu" type="submit" value="Close" /></div>' +
				'</div>';

			$('body').append(sMenuContent);
			$('#menu').css({
				left: oEvent.get('pagePixels')[0],
				top: oEvent.get('pagePixels')[1]
			});

			this._aPlacemarkAction.forEach(
				(oAction) => $('#' + oAction.getDomId()).click(function () {
					oAction.fireOnPress();
					$('#menu').remove();
				})
			);
			$('#MapPlacemarkCloseMenu').click(function () {
				$('#menu').remove();
			});

			return sMenuContent;
		},
		getProperty: function (sPath) {
			return this._oModelContext.getProperty(sPath);
		},
		setProperty: function (sPath, oValue) {
			return this._oModelContext.getModel().setProperty(this._oModelContext.getPath() + "/" + sPath, oValue);
		},
		createBalloonContentLayout: function () {
			let sMenuItemsHtml = this._aPlacemarkAction.reduce(
				(sAccumulator, oAction) => (oAction.isVisible()) ?
				sAccumulator + oAction.renderHtml() :
				sAccumulator,
				"");

			let that = this;

			let oBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
				'<div class="map_placemark_baloon_content">' +
				this.renderDetailsWithDiv(this._aHintDetails) +
				'<br/>' +
				sMenuItemsHtml +
				'</div>', {
					build: function () {
						oBalloonContentLayout.superclass.build.call(this);
						/*$('#zBalloonContectSelectId').bind('click', this.onCounterClick);*/
						
						that._aPlacemarkAction.forEach(
							(oAction) => $('#' + oAction.getDomId()).bind('click', function () {
								oAction.fireOnPress();
								that._oPlacemark.balloon.close();
							})
						);
					},
					clear: function () {
						that._aPlacemarkAction.forEach(
							(oAction) => $('#' + oAction.getDomId()).unbind('click'));
						oBalloonContentLayout.superclass.clear.call(this);
					}
				});
			return oBalloonContentLayout;
		},

	});
});