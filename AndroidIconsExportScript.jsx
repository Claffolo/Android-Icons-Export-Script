// Copyright 2017 Claudio Passaro (https://github.com/Claffolo)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// This file was edited completely. The original file was obtained with a github repository fork.
// The original file was produced by austynmahoney and can be found here (https://github.com/austynmahoney/mobile-export-scripts-illustrator/)
//
// Author: Claudio Passaro (https://github.com/Claffolo)

try{

  //Check if there are open documents (if not throw an error and exit)
  if(app.documents.length > 0){

    //The user choose the export folder
    var folder = Folder.selectDialog("Choose your export folder");
    var document = app.activeDocument; //The current open and active document

    var selectedExportOptions = {}; //Array used to store all the elements of the checklist that the user selected

    //Array containing all the different scale factors defined in the Google Android Developers guidelines
    var androidExportOptions = [
      {
        name: "ldpi",
        scaleFactor: 75,
      },
      {
        name: "mdpi",
        scaleFactor: 100,
      },
      {
        name: "hdpi",
        scaleFactor: 150,
      },
      {
        name: "xhdpi",
        scaleFactor: 200,
      },
      {
        name: "xxhdpi",
        scaleFactor: 300,
      },
      {
        name: "xxxhdpi",
        scaleFactor: 400,
      }
    ];


    if(document && folder) {
      var dialog = new Window("dialog","Select the desired export sizes");
      var uiGroup = dialog.add("group");

      createSelectionPanel("Scale Factors", androidExportOptions, uiGroup);

      var PNG24Options = new ExportOptionsPNG24();
      PNG24Options.artBoardClipping = true;
      PNG24Options.transparency = false;
      PNG24Options.antiAliasing = true;

      //Creating the ExportOptions Panel
      var exportFormatPanel = uiGroup.add("panel", undefined, "PNG24 Options");
      exportFormatPanel.alignment = "top";
      exportFormatPanel.alignChildren = "left";
      var transparency_checkbox = exportFormatPanel.add("checkbox", undefined, "Include Transparency");

      //Defining the onClick methods of the PNG24Options checkbox
      transparency_checkbox.onClick = function(){
        if(this.value){
          PNG24Options.transparency = true;
        }
        else{
          PNG24Options.transparency = false;
        }
      };

      //Creating the FolderType Panel
      var folderType = "drawable";

      var folderTypePanel = uiGroup.add("panel", undefined, "Folder type");
      folderTypePanel.alignment = "top";
      folderTypePanel.alignChildren = "left";
      var drawable_radiobutton = folderTypePanel.add ("radiobutton", undefined, "drawable");
      var mipmap_radiobutton = folderTypePanel.add ("radiobutton", undefined, "mipmap");

      drawable_radiobutton.value = true;

      drawable_radiobutton.onClick = function(){
        if(this.value){
          folderType = "drawable";
        }
      };
      mipmap_radiobutton.onClick = function(){
        if(this.value){
          folderType = "mipmap";
        }
      };

      var buttonGroup = dialog.add("group");
      var okButton = buttonGroup.add("button", undefined, "Export");
      var cancelButton = buttonGroup.add("button", undefined, "Cancel");

      okButton.onClick = function() {
        for (var key in selectedExportOptions) {
          if (selectedExportOptions.hasOwnProperty(key)) {
            var item = selectedExportOptions[key];
            exportToFile(folderType, item.name, PNG24Options, item.scaleFactor);
          }
        }
        this.parent.parent.close();
      };

      cancelButton.onClick = function () {
        this.parent.parent.close();
      };

      dialog.show();
    }

  }

  else{
    throw new Error ("You have to open an existing document or create a new one!");
  }
}

catch(error){
  alert (error.message, "Script Error");
}

function exportToFile(exportType, resIdentifier, exportOptions, scaleFactor) {

  //Creating the correct folder for the current element following the structure ( [UserChoice]/[drawable-currentdpi or mipmap-currentdpi] )
  var exportFolder = new Folder(folder.fsName + "/" + exportType + "-" + resIdentifier);

  if (!exportFolder.exists) {
    exportFolder.create();
  }

  //We do the export for all the artboards in the document
  var i = 0;
  for (i=0; i < document.artboards.length; i++) {

    document.artboards.setActiveArtboardIndex(i);
    var currentArtBoard = document.artboards[i];

    //if an ArtBoard name starts with ! it will be ignored
    if(currentArtBoard.name.charAt(0)=='!')
    continue;

    //Creating the file naming it as the current ArtBoard
    var current_file = new File(exportFolder.fsName + "/" + currentArtBoard.name + ".png");

    //Setting the Scale Factor
    exportOptions.verticalScale = scaleFactor;
    exportOptions.horizontalScale = scaleFactor;

    //Exporting the file as a PNG24 with the prevously defined exportOptions
    document.exportFile(current_file, ExportType.PNG24, exportOptions);
  }
};

//Function that creates the android export sizes checkbox panel, based on the array defined at the beginning of the script
function createSelectionPanel(name, array, group) {

  var panel = group.add("panel", undefined, name);
  panel.alignment = "left";
  panel.alignChildren = "left";

  for(var i = 0; i < array.length;  i++) {

    var cb = panel.add("checkbox", undefined, "\u00A0" + array[i].name);
    cb.item = array[i];

    //The OnClick function of each checkbox adds (or removes) the selected element from the selected options array
    cb.onClick = function() {
      if(this.value) {
        selectedExportOptions[this.item.name] = this.item;
      } else {
        delete selectedExportOptions[this.item.name];
      }
    };
    if(cb.item.name != "ldpi"){
      cb.value = true;
      selectedExportOptions[cb.item.name] = cb.item;
    }
  }
};
