sap.ui.define([
	"sap/ui/base/Object"
], function(Object) {
	"use strict";
	return Object.extend("my.sapui5_components_library.sap.ui5.GeoLocation", {
		/*constructor: function() {
			Object.call(this);
		},*/
		getCurrentLocation: function() {
			return "51.656901, 37.036503";
		}
	});
});