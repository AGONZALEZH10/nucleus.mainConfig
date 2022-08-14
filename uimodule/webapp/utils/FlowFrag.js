/* eslint-disable no-var */
sap.ui.define(
  ["sap/ui/base/ManagedObject", "sap/m/MessageBox", "sap/ui/core/Fragment", "sap/ui/model/json/JSONModel"],
  function (ManagedObject, MessageBox, Fragment, JSONModel) {
    "use strict";

    return ManagedObject.extend("nucleus.mainConfig.utils.FlowFrag", {
      constructor: function () {
      },
      exit: function () {
        delete this._oView;
      },
      open: function (data, title, oView) {
        this._oView = oView;
        // oView.setModel(new JSONModel(config), "fragRes");
        oView.setModel(new JSONModel(data), "fragResData");
        console.log("Frag Loading...");
        if (!oView.byId("resDialog")) {
          var oFragmentController = {
            onCloseDialog: function () {
              oView.byId("resDialog").close();
            },
            afterOpen: function () {
              oView.byId("resDialog").setState("Information");
            }
          };

          Fragment.load({
            id: oView.getId(),
            name: "nucleus.mainConfig.view.fragments.flowCreation",
            controller: oFragmentController,
          }).then(
            function (oDialog) {
              // connect dialog to the root view of this component (models, lifecycle)
              oView.addDependent(oDialog);
              oView.byId("resDialog").setTitle(title);
              console.log("Frag Loaded");
              oDialog.open();
            }.bind(this)
          );
        } else {
          oView.byId("resDialog").setTitle(title);
          oView.byId("resDialog").open();
        }
      }
    });
  }
);