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


    if(document && folder) {
      var dialog = new Window("dialog","Select the desired export sizes");
      var uiGroup = dialog.add("group");

      var androidCheckboxes = createSelectionPanel("Scale Factors", androidExportOptions, uiGroup);

      var PNG24Options = new ExportOptionsPNG24();

      //Creating the ExportOptions Panel
      var exportFormatPanel = uiGroup.add("panel", undefined, "PNG24 Options");
      exportFormatPanel.alignment = "top";
      exportFormatPanel.alignChildren = "left";
      var transparency_checkbox = exportFormatPanel.add("checkbox", undefined, "Include Transparency");
      var antiAliasing_checkbox = exportFormatPanel.add("checkbox", undefined, "Anti-Aliasing");

      //Defining the onClick methods of the PNG24Options checkboxes
      transparency_checkbox.onClick = function(){
        if(this.value){
          PNG24Options.transparency = true;
        }
        else{
          PNG24Options.transparency = false;
        }
      };

      antiAliasing_checkbox.onClick = function(){
        if(this.value){
          PNG24Options.antiAliasing = true;
        }
        else{
          PNG24Options.antiAliasing = false;
        }
      };

      //Creating the FolderType Panel

      var folderType = "drawable";

      var folderTypePanel = uiGroup.add("panel", undefined, "Folder type");
      folderTypePanel.alignment = "top";
      folderTypePanel.alignChildren = "left";
      var drawable_radiobutton = folderTypePanel.add ("radiobutton", undefined, "drawable");
      var mimap_radiobutton = folderTypePanel.add ("radiobutton", undefined, "mipmap");

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

  }

  else{
    throw new Error ("You have to open an existing document or create a new one!");
  }
}

catch(error){
  alert (error.message, "Script Error");
}

function exportToFile(scaleFactor, resIdentifier, os) {
  //TODO: Rewrite this function
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
  }
};
