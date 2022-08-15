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

  return BaseController.extend("nucleus.mainConfig.controller.PlantDownload", {
    onInit: function () {
      this.initView();
      this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      this.oRouter.getRoute("plantCreateView").attachPatternMatched(this.onPageLoaded, this);
    },
    initView: function () {
      this.setModel(new JSONModel({
        in14: true,
        in15: false,
      }), "datosGral");
      this.datosGral = this.getModel("datosGral");
    },
    onPageLoaded: function (oEvent) {},
    onValueHelp: function (oEvent, param) {
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
        case "in1":
        case "in2":
          this.plantValueHelp();
          break;
        default:
          break;
      }
    },
    plantValueHelp: function () {
      var tableSelectId = this.byId('TableSelectId');
      var tableSelectTemplate = new sap.m.ColumnListItem({
        cells: [
          new sap.m.Text({
            text: "{Werks}"
          }),
          new sap.m.Text({
            text: "{Name1}"
          }),
          new sap.m.Text({
            text: "{Sort2}"
          }),
          new sap.m.Text({
            text: "{Sort1}"
          }),
          new sap.m.Text({
            text: "{PostCode1}"
          }),
          new sap.m.Text({
            text: "{City1}"
          }),
          new sap.m.Text({
            text: "{Name2}"
          }),
          new sap.m.Text({
            text: "{Nation}"
          })

        ]
      });
      this.byId('valueHelpField1').setText('Plant');
      this.byId("col2").setVisible(true);
      this.byId('valueHelpField2').setText('Name');
      this.byId("col3").setVisible(true);
      this.byId('valueHelpField3').setText('Search Term 2');
      this.byId("col4").setVisible(true);
      this.byId('valueHelpField4').setText('Search Term 1');
      this.byId("col5").setVisible(true);
      this.byId('valueHelpField5').setText('Postal Code');
      this.byId("col6").setVisible(true);
      this.byId('valueHelpField6').setText('City');
      this.byId("col7").setVisible(true);
      this.byId('valueHelpField7').setText('Name 2');
      this.byId("col8").setVisible(true);
      this.byId('valueHelpField8').setText('Version');
      this.byId("col9").setVisible(false);
      tableSelectId.bindAggregation("items", "/plantSet", tableSelectTemplate);
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
        "in1": "Werks",
        "in2": "Werks"
      };
      return fieldMap[param];
    },
    sendToBackForCreate: function () {
      var datosGral = this.datosGral.getData();
      var url = "/plantActionSet";
      var that = this;
      datosGral.in1 = datosGral.in1 ? datosGral.in1 : "";
      datosGral.in2 = datosGral.in2 ? datosGral.in2 : "";
      //sort array of strings
      var range = [datosGral.in1, datosGral.in2].sort();
      if (range[0] === "") {
        range.shift();
      }
      var oPayload = {
        action: "DOWNLOAD",
        toRange: [{
          Sign: "I",
          Option: range[1] ? "BT" : "EQ",
          Low: range[0],
          High: range[1] ? range[1] : ""
        }],
        toXLSX: [],
        toReturn: []
      };
      this.getModel().setUseBatch(false);
      return new Promise(function (resolve, reject) {
        that.getModel().create(url, oPayload, {
          success: function (res) {
            if (res.toReturn.results && res.toReturn.results.length > 0) {
              reject(that.displayResults(res.toReturn.results));
            }
            if (res.toXLSX.results && res.toXLSX.results.length > 0) {
              resolve(res.toXLSX.results);
            }
          },
          Error: function (err) {
            reject(err);
          }
        });
      });
    },
    displayResults: function (arrResults) {
      if (arrResults.length > 0) {
        var oResults = arrResults.map((result) => {
          return result.message;
        }).join("\n");
        MessageBox.error(oResults);
      }
    },
    closeView: function () {
      this.initView();
      this.oRouter.navTo("midOptionView");
    },

    onDownload: function (oEvent) {
      this.sendToBackForCreate()
        .then(function (arrResults) {
          arrResults = arrResults.map((line) => {
            for (var key in line) {
              if (key.includes("_metadata")) {
                delete line[key];
              }
            }
            return line;
          });
          this.getOwnerComponent().oXlsxUtils.onDownloadAsExcel(arrResults);
        }.bind(this))
        .then(function () {
          // this.closeView();
        }.bind(this))
        .catch(function (err) {
          if (err) {
            MessageBox.error(err);
          }
          console.log('%c error downloading', 'font-weight: bold; background-color: lightblue;font-size: large;')
        }.bind(this));
    },
    handleSearch: function (evt) {
      var param = this._oDialog.param;
      var sValue = evt.getParameter("value");
      var oBinding = evt.getParameter("itemsBinding");
      var filterProperty1;
      switch (param) {
        case "in1":
        case "in2":
          filterProperty1 = [new Filter("Werks", FilterOperator.Contains, sValue)];
          break;
        default:
          break;
      }
      oBinding.filter(filterProperty1);
    }
  });
});