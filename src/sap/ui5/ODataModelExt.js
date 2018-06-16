sap.ui.define([
	"sap/ui/model/odata/v2/ODataModel",
	"my/sapui5_components_library/exception/MyException"
], function(ODataModel, MyException) {
	"use strict";
	return ODataModel.extend("my.sapui5_components_library.sap.ui5.ODataModelExt", {
		/*constructor: function() {
			ODataModel.call(this);
			
		},*/

		readExt: function(sPath, mUrlParameters) {
			var that = this;
			return new Promise(function(resolve, reject) {
				that.read(sPath, {
					urlParameters: mUrlParameters,
					success: function(oData) {
						resolve(oData);
					},
					error: function(oException) {
						reject(new MyException("MyODataModel", "Failed readExt", oException));
					}
				});
			});
		},

		createExt: function(sPath, oData) {
			var that = this;
			return new Promise(function(resolve, reject) {
				that.create(sPath, oData, {
					success: function(oDataResult) {
						resolve(oDataResult);
					},
					error: function(oException) {
						reject(new MyException("MyODataModel", "Failed createExt", oException));
					}
				});
			});
		},
		
		getRelatedPath: function(sFullPath) {
			return sFullPath.replace(this.sServiceUrl, "");
		},
		
		submitChangesExt: function(sFullPath) {
			var that = this;
			return new Promise(function(resolve, reject) {
				that.submitChanges({
					success: function(oData) {
						resolve(oData);
					},
					error: function(oException) {
						reject(new MyException("MyODataModel", "Failed submitChangesExt", oException));
					}
				});
			});
		},
		
		removeExt: function(sFullPath) {
			var that = this;
			return new Promise(function(resolve, reject) {
				that.remove(sFullPath, {
					success: function(oData) {
						resolve(oData);
					},
					error: function(oException) {
						reject(new MyException("MyODataModel", "Failed removeExt", oException));
					}
				});
			});
		}

	});
});