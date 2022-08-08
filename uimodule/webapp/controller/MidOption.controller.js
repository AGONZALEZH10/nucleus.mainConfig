sap.ui.define([
  "./BaseController"
], function (
  BaseController
) {
  "use strict";

  return BaseController.extend("nucleus.mainConfig.controller.MidOption", {
    onInit: function () {
      this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);

    },
    onPressSingle: function (oEvent) {
      this.oRouter.navTo("plantCreateView");
    },
    onPressMass: function (oEvent) {
      this.oRouter.navTo("plantCreateView");
    },
    onPressDownloadTemplate: function (oEvent) {
      //directly download the template file
    },
    onPressDownloadPlant: function (oEvent) {
      this.oRouter.navTo("plantCreateView");
    }
  });
});