/*
*   Author: Claffolo
*   TODO: Add Licensing
*
*/

var selectedExportOptions = {};

var androidExportOptions = [
     {
        name: "ldpi (0.75x)",
        scaleFactor: 75,
    },
    {
        name: "mdpi (1.0x)",
        scaleFactor: 100,
    },
    {
        name: "hdpi (1.5x)",
        scaleFactor: 150,
    },
    {
        name: "xhdpi (2.0x)",
        scaleFactor: 200,
    },
    {
        name: "xxhdpi (3.0x)",
        scaleFactor: 300,
    },
    {
        name: "xxxhdpi (4.0x)",
        scaleFactor: 400,
    }
];

var folder = Folder.selectDialog("Choose your export folder");
var document = app.activeDocument;

if(document && folder) {
    var dialog = new Window("dialog","Select the desired export sizes");
    var osGroup = dialog.add("group");

    var androidCheckboxes = createSelectionPanel("Scale Factors", androidExportOptions, osGroup);

    var exportFormatPanel = osGroup.add("panel", undefined, "Export Format");
    exportFormatPanel.alignment = "top";
    var formatDropDown = exportFormatPanel.add("dropdownlist");
    formatDropDown.add ("item", "PNG24");
    formatDropDown.add ("item", "PNG8");



    var buttonGroup = dialog.add("group");
    var okButton = buttonGroup.add("button", undefined, "Export");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");

    okButton.onClick = function() {
        for (var key in selectedExportOptions) {
            if (selectedExportOptions.hasOwnProperty(key)) {
                var item = selectedExportOptions[key];
                exportToFile(item.scaleFactor, item.name, item.type);
            }
        }
        this.parent.parent.close();
    };

    cancelButton.onClick = function () {
        this.parent.parent.close();
    };

    dialog.show();
}

function exportToFile(scaleFactor, resIdentifier, os) {
    var i, ab, file, options, expFolder;
    if(os === "android")
        expFolder = new Folder(folder.fsName + "/drawable-" + resIdentifier);

	if (!expFolder.exists) {
		expFolder.create();
	}

	for (i = document.artboards.length - 1; i >= 0; i--) {
		document.artboards.setActiveArtboardIndex(i);
		ab = document.artboards[i];

	if(ab.name.charAt(0)=="!")
            continue;

        if(os === "android")
            file = new File(expFolder.fsName + "/" + ab.name + ".png");
        else if(os === "ios")
            file = new File(expFolder.fsName + "/" + ab.name + resIdentifier + ".png");

            options = new ExportOptionsPNG24();
            options.transparency = true;
            options.artBoardClipping = true;
            options.antiAliasing = true;
            options.verticalScale = scaleFactor;
            options.horizontalScale = scaleFactor;

            document.exportFile(file, ExportType.PNG24, options);
	}
};

function createSelectionPanel(name, array, parent) {
    var panel = parent.add("panel", undefined, name);
    panel.alignChildren = "left";
    for(var i = 0; i < array.length;  i++) {
        var cb = panel.add("checkbox", undefined, "\u00A0" + array[i].name);
        cb.item = array[i];
        cb.onClick = function() {
            if(this.value) {
                selectedExportOptions[this.item.name] = this.item;
                //alert("added " + this.item.name);
            } else {
                delete selectedExportOptions[this.item.name];
                //alert("deleted " + this.item.name);
            }
        };
    }
};
