sap.ui.define([
	"sap/ui/core/Core",
	"sap/ui/core/library"
],function(Core, Library) {
	"use strict";

	sap.ui.getCore().initLibrary({
		name : "my_sapui5_components_library",
		noLibraryCSS: true,
		dependencies : [
			"sap.ui.core"
		],
		types: [],
		interfaces: [],
		controls: [],
		elements: [
			"my_sapui5_components_library.MyException"
		],
		version: "0.1.0"
	});

	return my_sapui5_components_library;

}, /* bExport= */ false);