sap.ui.define([
	"sap/ui/base/Object"
], function(Object) {
	"use strict";
	/*eslint-env es6*/
	/*global ymaps*/

	return Object.extend("my.sapui5_components_library.yandex.maps.TruckPlacemark", {
		constructor: function(oMapControl, oContext) {
			this._oParent = oMapControl;
			this._oModelContext = oContext;
		},
		createPlacemark: function() {
			let that = this;
			this._oPlacemark = new ymaps.Placemark(
				that._oParent.convertGeoLocation(
					that.getProperty("TruckDetails/GeoLocation")
				), {
					hintContent: 'Собственный значок метки',
					balloonContent: 'Это красивая метка',
					iconContent: '11 min',
					address: "Москва, ул. Зоологическая, 13, стр. 2",
					object: "Центр современного искусства",
					name: 'Считаем'
				}, {
					iconLayout: that.createIconLayout(),
					iconShape: {
						type: 'Rectangle',
						coordinates: [
							[0, 0],
							[50, 50]
						]
					},
					hintLayout: that.createHintLayout(),
					//balloonContentLayout: that.createTruckAssignmentballoonContentLayout(sTransporationAssignmentPath),
					hideIconOnBalloonOpen: false,
					balloonPanelMaxMapArea: 0
				});
			this._oPlacemark.events.add("click", function(oEvent) {
				if (that.getProperty("Selected")) {
					that.setProperty("Selected", false);
				} else {
					that.setProperty("Selected", true);
				}
			});
			this._oPlacemark.events.add("contextmenu", function(oEvent) {
				if ($('#menu').css('display') === 'block') {
					$('#menu').remove();
				} else {
					that.createContextMenu(oEvent);
				}
			});
			return this._oPlacemark;
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
			if (this.getProperty("Selected")) {
				sAdditionalCssClass = "truck_placemark_container_selected";
			}
			return ymaps.templateLayoutFactory.createClass(
				'<div class="truck_placemark_container ' + sAdditionalCssClass +
				'">\
						<div class="truck_placemark_top"> <img src="images/truck_257_136.png" height="24px", weight="48px"> </div>\
						<div class="truck_placemark_bottom">\
							<img src="images/message_sent.png" weight="12" height="6">\
							$[properties.iconContent]\
						</div>\
						<div class="truck_placemark_index"> ' +
				this.getProperty("AssignmentIndex") +
				'</div>\
					</div>'
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
		},
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