// @ts-nocheck
/* eslint-disable no-console */
/* eslint-disable no-var */
sap.ui.define([
  "./BaseController",
  "sap/ui/model/json/JSONModel",
  "sap/ui/core/Fragment",
  "sap/m/MessageBox"
], function (
  BaseController,
  JSONModel,
  Fragment,
  MessageBox
) {
  "use strict";

  return BaseController.extend("nucleus.mainConfig.controller.PlantMass", {
    onInit: function () {
      this.initView();
      this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      this.oRouter.getRoute("plantMassView").attachPatternMatched(this.onPageLoaded, this);
    },
    initView: function () {
      this.setModel(new JSONModel({
        in14: true,
        in15: false,
      }), "datosGral");
      this.datosGral = this.getModel("datosGral");
    },
    onPageLoaded: function (oEvent) {
      this.getTemplateHeaders().then((oHeaders) => {
        this.oHeaders = oHeaders;
      });
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
              var oHeaders = [];
              for (const key in res.toXLSX.results[0]) {
                if (key !== "__metadata") {
                  oHeaders.push(res.toXLSX.results[0][key]);
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
    },
    onValueHelp: function (oEvent, param) {
      //   var valueHelpId = evt.getParameter('id');
      //   var tableSelectId;
      //   var tableSelectTemplate;
      //   this.valueHelpId = valueHelpId;
      var oView = this.getView();
      if (!this._oDialog) {
        Fragment.load({
          id: oView.getId(),
          name: "nucleus.mainConfig.view.fragments.ValueHelpDialog",
          controller: this,
        }).then(
          function (oDialog) {
            // connect dialog to the root view of this component (models, lifecycle)
            oView.addDependent(oDialog);
            //   oView.byId("motiveDialog").setTitle("Item No: " + title);
            console.log("Frag Motivo Loaded");
            this.loadFragSpecific(param);
            this._oDialog = oDialog;
            this._oDialog.param = param;
            oDialog.open();
          }.bind(this)
        );
      } else {
        this.loadFragSpecific(param);
        this._oDialog.open();
        this._oDialog.param = param;
      }
    },
    loadFragSpecific: function (param) {

      switch (param) {
        case "in17":
          this.ownValueHelp();
          break;
        default:
          break;
      }
    },
    ownValueHelp: function () {
      var tableSelectId = this.byId('TableSelectId');
      var tableSelectTemplate = new sap.m.ColumnListItem({
        cells: [
          new sap.m.Text({
            text: "{strkorr}"
          })
        ]
      });
      this.byId('valueHelpField1').setText('Parent Request');
      this.byId("col2").setVisible(false);
      this.byId("col3").setVisible(false);
      this.byId("col4").setVisible(false);
      this.byId("col5").setVisible(false);
      this.byId("col6").setVisible(false);
      this.byId("col7").setVisible(false);
      this.byId("col8").setVisible(false);
      this.byId("col9").setVisible(false);
      tableSelectId.bindAggregation("items", "/plantOwnSet", tableSelectTemplate);
    },
    handleValueItemPress: function (oEvent) {
      var param = this._oDialog.param;
      var aContexts = oEvent.getParameter("selectedContexts");
      var selectedItem = aContexts[0].getModel().getProperty(aContexts[0].getPath());
      var datosGral = this.datosGral.getData();
      if (aContexts && aContexts.length) {
        var field = this.getValueHelpToField(param);
        datosGral[param] = selectedItem[field];
      }
      this.datosGral.setData(datosGral);
      oEvent.getSource().getBinding("items").filter([]);
    },
    getValueHelpToField: function (param) {
      var fieldMap = {
        "in17": "strkorr",
      };
      return fieldMap[param];
    },
    onUpload: function (oEvent) {
      var datosGral = this.datosGral.getData();
      if (!this.oGlobalBusyDialog) {
        this.oGlobalBusyDialog = new sap.m.BusyDialog();
      }
      this.oGlobalBusyDialog.open();
      if (this.toMain.length > 0) {
        this.sendToBackForCreate(this.toMain)
          .then(function (result) {
            setTimeout(() => {
              this.closeView();
            }, 2000);
          })
          .finally(function () {
            this.oGlobalBusyDialog.close();
          }.bind(this));
      }
    },
    sendToBackForCreate: function (arrToMain) {
      var url = "/plantActionSet";
      var that = this;
      var oPayload = {
        action: "CREATE",
        toMain: arrToMain,
        toReturn: [],
        toOutput: [],
        toError: [],
      };
      return new Promise(function (resolve, reject) {
        that.getModel().create(url, oPayload, {
          success: function (res) {
            if (res.toReturn.results) {
              reject(that.displayResults(res.toReturn.results, undefined));
            }
            if (res.toError.results) {
              reject(that.displayResults(res.toReturn.results, undefined));
            }
            if (res.toOutput.results) {
              resolve(that.displayResults(res.toReturn.results, true));
            }
          }
        });
      });
    },
    displayResults: function (arrResults, okMessage) {
      if (arrResults.length > 0) {
        var oResults = arrResults.map((result) => {
          return result.message;
        }).join("\n");
        if (okMessage) {
          MessageBox.success(oResults);
        } else {
          MessageBox.error(oResults);
        }
      }
    },
    closeView: function () {
      this.initView();
      this.toMain = {};
      this.oRouter.navTo("midOptionView");
    },
    /* ===========================================================
     Managed Upload
    ============================================================= */
    onHandleUploadStart: function (oEvent) {
      this.datosGral.setProperty("/atta", true);
      this.templateFile = oEvent.getParameter("files")[0];
    },
    onHandleUploadComplete: function (oEvent) {
      this.getOwnerComponent().oXlsxUtils.readTemplate(this.templateFile, true)
        .then(
          (jsonObj) => {
            // this.setTempVals(jsonObj);
            this.toMain = this.mapToBackend(jsonObj);
            console.log('%c', 'font-weight: bold; background-color: lightblue;font-size: large;')
          })
        .catch((error) => {
          MessageBox.error(error.responseText || error.message);
        })
        .finally(() => {
          this.datosGral.setProperty("/atta", false);
        });
    },
    mapToBackend: function (jsonObj) {
      var datosGral = this.datosGral.getData();
      var toMain = [];
      jsonObj.forEach((row) => {
        toMain.push({
          werks: row[this.oHeaders[0]] || "",
          name1: row[this.oHeaders[1]] || "",
          name2: row[this.oHeaders[2]] || "",
          title: row[this.oHeaders[3]] || "",
          street1: row[this.oHeaders[4]] || "",
          hno: row[this.oHeaders[5]] || "",
          street2: row[this.oHeaders[6]] || "",
          city: (row[this.oHeaders[7]] || "").substring(0, 40),
          region: row[this.oHeaders[8]] || "",
          code: row[this.oHeaders[9]] || "",
          country: row[this.oHeaders[10]] || "",
          lang: row[this.oHeaders[11]] || "",
          fabkl: row[this.oHeaders[12]] || "",
          r1: datosGral.in14 ? "X" : "",
          des: (datosGral.in14 ? (datosGral.in16 || "") : "").substring(0, 30),
          r2: datosGral.in15 ? "X" : "",
          own: datosGral.in15 ? (datosGral.in17 || "") : "",
        });
      });
      return toMain;
    }
  });
});