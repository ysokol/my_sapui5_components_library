sap.ui.define([
	"sap/ui/base/Object",
	"my/sapui5_components_library/exception/MyException"
], function(Object, MyException) {
	"use strict";
	return Object.extend("my.sapui5_components_library.utils.ResourceLoader", {

		constructor: function() {
			
		},

		getScript: function(sUrl) {
			return new Promise(function(resolve, reject) {
				$.getScript(sUrl, function(sScript, sTextStatus, oJqXhr) {
					resolve(sScript, sTextStatus, oJqXhr);
				});	
			});
		}

	});
});