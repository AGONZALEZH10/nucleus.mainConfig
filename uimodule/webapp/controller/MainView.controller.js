/* eslint-disable no-var */
sap.ui.define(
  ["./BaseController",
    "sap/ui/model/json/JSONModel"
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("nucleus.mainConfig.controller.MainView", {
      onInit: function () {
        this.initButts();
      },
      initButts: function () {
        var mainButt = {
          l1: true,
          l2: false,
          l3: false
        };
        this.setModel(new JSONModel(mainButt), "mainButt");
        this.buttModel = this.getModel("mainButt");
      },
      onPressMainButton: function (oEvent, param1, param2) {
        switch (param1) {
          case "l1":
            this.onActionPressL1(param2);
            break;
          case "l2":
            this.onActionPressL2(param2);
            break;
          case "l3":
            this.onActionPressL3(param2);
          default:
            break;
        }
      },
      onActionPressL1: function (param2) {
        if (param2 === "o1") {
          this.lastMenu = "home";
          var butData = this.buttModel.getData();
          butData.l1 = false;
          butData.l2 = true;
          butData.l3 = false;
          this.buttModel.setData(butData);
        }
      },
      onActionPressL2: function (param2) {
        if (param2 === "o1") {
          this.lastMenu = "l1";
          var butData = this.buttModel.getData();
          butData.l1 = false;
          butData.l2 = false;
          butData.l3 = true;
          this.buttModel.setData(butData);
        }
      },
      onActionPressL3: function (param2) {
        switch (param2) {
          case "o1":
            this.lastMenu = "l2";
            this.getRouter().navTo("midOptionView");
            break;
          default:
            break;
        }
      },
      onPressBack: function () {
        switch (this.lastMenu) {
          case "home":
            this.initButts();
            break;
          case "l1":
            this.onActionPressL1("o1");
            break;
          case "l2":
            this.onActionPressL2("o1");
            break;
          default:
            break;
        }
      },
      onPressHome: function () {
        this.lastMenu = "home";
        this.initButts();
      }
    });
  });