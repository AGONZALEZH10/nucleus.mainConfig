// @ts-nocheck
/* eslint-disable no-console */
/* eslint-disable no-var */
sap.ui.define([
  "./BaseController",
  "sap/ui/model/json/JSONModel",
  "sap/ui/core/Fragment",
  "sap/m/MessageBox",
  "sap/ui/model/Filter",
  "sap/ui/model/FilterOperator"
], function (
  BaseController,
  JSONModel,
  Fragment,
  MessageBox,
  Filter,
  FilterOperator
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
    onPageLoaded: function (oEvent) {},
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
      if (this.toMain && this.toMain.length > 0) {
        this.oGlobalBusyDialog.open();
        this.sendToBackForCreate(this.toMain)
          .then(function (result) {
            // setTimeout(() => {
            //   this.closeView();
            // }, 2000);
          })
          .finally(function () {
            this.oGlobalBusyDialog.close();
          }.bind(this));
      }
    },
    sendToBackForCreate: function (arrToMain) {
      var datosGral = this.datosGral.getData();
      var url = "/plantActionSet";
      var that = this;
      var oPayload = {
        action: "UPLOAD",
        toMain: arrToMain.map((item) => {
          item.r1 = datosGral.in14 ? "X" : "";
          item.des = (datosGral.in14 ? (datosGral.in16 || "") : "").substring(0, 30);
          item.r2 = datosGral.in15 ? "X" : "";
          item.own = datosGral.in15 ? (datosGral.in17 || "") : "";
          return item;
        }),
        toReturn: [],
        toOutput: [],
        toError: [],
      };
      return new Promise(function (resolve, reject) {
        that.getModel().create(url, oPayload, {
          success: function (res) {
            if (res.toReturn.results && res.toReturn.results.length > 0) {
              resolve(that.displayResults(res.toReturn.results, ['message']));
            }
            if (res.toError.results && res.toError.results.length > 0) {
              resolve(that.displayResults(res.toError.results, ['Msg']));
            }
            if (res.toOutput.results && res.toOutput.results.length > 0) {
              resolve(that.displayResults(res.toOutput.results, ['Plant', 'Msg']));
            }
          }
        });
      });
    },
    displayResults: function (arrResults, arrProperty) {
      if (arrResults.length > 0) {
        var oResults = arrResults.map((result) => {
          //join value of array into string
          var value = arrProperty.map((property) => {
            return result[property];
          }).join(" ");
          var okFlow = value.split("&&");
          if (okFlow.length > 1) {
            return {
              C1: okFlow[0] + " " + okFlow[1],
              state: "Success"
            };
          }
          return {
            C1: value,
            state: "Error"
          };
        })
        this.getOwnerComponent().oFlowFrag.open(oResults, "Plant Creation Results", this.getView());

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
      this.getTemplateHeaders().then((oHeaders) => {
          this.oHeaders = oHeaders;
        })
        .then(() => {
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
        })
        .catch(() => {
          MessageBox.error("No Headers Found");
        });
    },
    mapToBackend: function (jsonObj) {
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
          fabkl: row[this.oHeaders[12]] || ""
        });
      });
      return toMain;
    },
    handleSearch: function (evt) {
      var param = this._oDialog.param;
      var sValue = evt.getParameter("value");
      var oBinding = evt.getParameter("itemsBinding");
      var filterProperty1;
      switch (param) {
        case "in17":
          filterProperty1 = [new Filter("strkorr", FilterOperator.Contains, sValue)];
          break;
        default:
          break;
      }
      oBinding.filter(filterProperty1);
    }
  });
});