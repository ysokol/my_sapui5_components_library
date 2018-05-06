sap.ui.define([
	"sap/ui/core/Core",
	"sap/ui/core/library"
],function(Core, Library) {
	"use strict";

	sap.ui.getCore().initLibrary({
		name : "my.sapui5_components_library",
		noLibraryCSS: true,
		dependencies : [
			"sap.ui.core"
		],
		types: [],
		interfaces: [],
		controls: [],
		elements: [
			"my.sapui5_components_library.exception.MyException",
			"my.sapui5_components_library.utils.ResourceLoader",
			"my.sapui5_components_library.microsoft.MicrosoftGraphApi"
		],
		version: "0.1.0"
	});

	return my.sapui5_components_library;

}, /* bExport= */ false);