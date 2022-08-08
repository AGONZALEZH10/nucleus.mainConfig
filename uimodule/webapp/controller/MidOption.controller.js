/* eslint-disable no-var */
sap.ui.define([
  "./BaseController",
	"sap/m/MessageBox"
], function (
  BaseController,
	MessageBox
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
      this.getTemplateHeaders().then((oHeaders) => {
        this.getOwnerComponent().oXlsxUtils.getTemplate(undefined, oHeaders);
      })
      .catch(() => {
        MessageBox.error("No Template found");
      });
    },
    onPressDownloadPlant: function (oEvent) {
      this.oRouter.navTo("plantCreateView");
    },
    getTemplateHeaders: function () {
      var url = "/plantActionSet";
      var that = this;
      var oPayload = {
        action: "TEMPLATE",
        toXLSX: []
      };
      return new Promise(function (resolve, reject) {
        that.getModel().create(url, oPayload, {
          success: function (res) {
            if (res.toXLSX.results && res.toXLSX.results.length > 0) {
              var oHeaders = {};
              for (const key in res.toXLSX.results[0]) {
                if (key !== "__metadata") {
                  oHeaders[res.toXLSX.results[0][key]] = "";
                }
              }
              resolve(oHeaders);
            }
            reject();
          },
          error: function (err) {
            reject(err);
          }
        });
      });
    }
  });
});