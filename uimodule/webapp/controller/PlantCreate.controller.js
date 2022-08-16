/* eslint-disable max-lines */
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

  return BaseController.extend("nucleus.mainConfig.controller.PlantCreate", {
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
        case "in1":
          this.plantValueHelp();
          break;
        case "in4":
          this.titleValueHelp();
          break;
        case "in5":
          this.streetValueHelp();
          break;
        case "in9":
          this.countryValueHelp();
          break;
        case "in10":
          this.regionValueHelp();
          break;
        case "in12":
          this.languageValueHelp();
          break;
        case "in13":
          this.factoryValueHelp();
          break;
        case "in17":
          this.ownValueHelp();
          break;
        default:
          break;
      }
    },

    countryValueHelp: function () {
      var tableSelectId = this.byId('TableSelectId');
      var tableSelectTemplate = new sap.m.ColumnListItem({
        cells: [
          new sap.m.Text({
            text: "{Land1}"
          }),
          new sap.m.Text({
            text: "{Landx}"
          }),
          new sap.m.Text({
            text: "{Natio}"
          })
        ]
      });
      this.byId('valueHelpField1').setText('Country/Region');
      this.byId("col2").setVisible(true);
      this.byId('valueHelpField2').setText('Name');
      this.byId("col3").setVisible(true);
      this.byId('valueHelpField3').setText('Nationality');
      this.byId("col4").setVisible(false);
      this.byId("col5").setVisible(false);
      this.byId("col6").setVisible(false);
      this.byId("col7").setVisible(false);
      this.byId("col8").setVisible(false);
      this.byId("col9").setVisible(false);
      tableSelectId.bindAggregation("items", "/countrySet", tableSelectTemplate);
    },
    streetValueHelp: function () {
      var tableSelectId = this.byId('TableSelectId');
      var tableSelectTemplate = new sap.m.ColumnListItem({
        cells: [
          new sap.m.Text({
            text: "{CityName}"
          }),
          new sap.m.Text({
            text: "{McStreet}"
          }),
          new sap.m.Text({
            text: "{McCity}"
          }),
          new sap.m.Text({
            text: "{CityExt}"
          }),
          new sap.m.Text({
            text: "{Region}"
          }),
          new sap.m.Text({
            text: "{Country}"
          }),
          new sap.m.Text({
            text: "{Langu}"
          }),
          new sap.m.Text({
            text: "{StrtCode}"
          }),
          new sap.m.Text({
            text: "{CityCode}"
          })
        ]
      });
      this.byId('valueHelpField1').setText('City');
      this.byId("col2").setVisible(true);
      this.byId('valueHelpField2').setText('Street');
      this.byId("col3").setVisible(true);
      this.byId('valueHelpField3').setText('City 1');
      this.byId("col4").setVisible(true);
      this.byId('valueHelpField4').setText('City Extension');
      this.byId("col5").setVisible(true);
      this.byId('valueHelpField5').setText('Region');
      this.byId("col6").setVisible(true);
      this.byId('valueHelpField6').setText('Country/Region');
      this.byId("col7").setVisible(true);
      this.byId('valueHelpField7').setText('Language');
      this.byId("col8").setVisible(true);
      this.byId('valueHelpField8').setText('Street No');
      this.byId("col9").setVisible(true);
      this.byId('valueHelpField9').setText('City No');
      tableSelectId.bindAggregation("items", "/streetSet", tableSelectTemplate);
    },

    regionValueHelp: function () {
      var tableSelectId = this.byId('TableSelectId');
      var tableSelectTemplate = new sap.m.ColumnListItem({
        cells: [
          new sap.m.Text({
            text: "{Land1}"
          }),
          new sap.m.Text({
            text: "{Bland}"
          }),
          new sap.m.Text({
            text: "{Bezei}"
          })

        ]
      });
      this.byId('valueHelpField1').setText('C/R');
      this.byId("col2").setVisible(true);
      this.byId('valueHelpField2').setText('Rg');
      this.byId("col3").setVisible(true);
      this.byId('valueHelpField3').setText('Description');
      this.byId("col4").setVisible(false);
      this.byId("col5").setVisible(false);
      this.byId("col6").setVisible(false);
      this.byId("col7").setVisible(false);
      this.byId("col8").setVisible(false);
      this.byId("col9").setVisible(false);
      tableSelectId.bindAggregation("items", "/regionSet", tableSelectTemplate);
    },

    languageValueHelp: function () {
      var tableSelectId = this.byId('TableSelectId');
      var tableSelectTemplate = new sap.m.ColumnListItem({
        cells: [
          new sap.m.Text({
            text: "{Spras}"
          }),
          new sap.m.Text({
            text: "{Sptxt}"
          })

        ]
      });
      this.byId('valueHelpField1').setText('Language');
      this.byId("col2").setVisible(true);
      this.byId('valueHelpField2').setText('Name of Language');
      this.byId("col3").setVisible(false);
      this.byId("col4").setVisible(false);
      this.byId("col5").setVisible(false);
      this.byId("col6").setVisible(false);
      this.byId("col7").setVisible(false);
      this.byId("col8").setVisible(false);
      this.byId("col9").setVisible(false);
      tableSelectId.bindAggregation("items", "/languageSet", tableSelectTemplate);
    },

    factoryValueHelp: function () {
      var tableSelectId = this.byId('TableSelectId');
      var tableSelectTemplate = new sap.m.ColumnListItem({
        cells: [
          new sap.m.Text({
            text: "{Ident}"
          }),
          new sap.m.Text({
            text: "{Ltext}"
          })

        ]
      });
      this.byId('valueHelpField1').setText('Factory Cal. ID');
      this.byId("col2").setVisible(true);
      this.byId('valueHelpField2').setText('Text');
      this.byId("col3").setVisible(false);
      this.byId("col4").setVisible(false);
      this.byId("col5").setVisible(false);
      this.byId("col6").setVisible(false);
      this.byId("col7").setVisible(false);
      this.byId("col8").setVisible(false);
      this.byId("col9").setVisible(false);
      tableSelectId.bindAggregation("items", "/calendarSet", tableSelectTemplate);
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

    titleValueHelp: function () {
      var tableSelectId = this.byId('TableSelectId');
      var tableSelectTemplate = new sap.m.ColumnListItem({
        cells: [
          new sap.m.Text({
            text: "{TitleMedi}"
          })
        ]
      });
      this.byId('valueHelpField1').setText('Title');
      this.byId("col2").setVisible(false);
      this.byId("col3").setVisible(false);
      this.byId("col4").setVisible(false);
      this.byId("col5").setVisible(false);
      this.byId("col6").setVisible(false);
      this.byId("col7").setVisible(false);
      this.byId("col8").setVisible(false);
      this.byId("col9").setVisible(false);

      tableSelectId.bindAggregation("items", "/titleSet", tableSelectTemplate);
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
        "in4": "TitleMedi",
        "in5": "McStreet",
        "in9": "Land1",
        "in10": "Bland",
        "in12": "Spras",
        "in13": "Ident",
        "in17": "strkorr",
      };
      return fieldMap[param];
    },

    onPlantChange: function (oEvent) {
      var plant = oEvent.getSource().getValue();
      this.valPlant(plant);
    },
    valPlant: function (plant) {
      var url = "/plantValPlantSet('" + plant + "')";
      // var url = "/plantValPlantSet";
      var that = this;
      this.getModel().setUseBatch(false);
      return new Promise(function (resolve, reject) {
        that.getModel().read(url, {
          success: function (oData) {
            // oData.message = ""
            if (oData.message) {
              reject(MessageBox.error(oData.message));
            }
            resolve(true);
          },
          error: function (oError) {
            MessageBox.error(oError.message);
            reject(oError);
          }
        });
      });
    },
    valAllFields: function () {
      var datosGral = this.datosGral.getData();
      var valFields = ["in1", "in2", "in3", "in8", "in9", "in10", "in11", "in12", "in13"];
      valFields.forEach((field) => {
        if (!datosGral[field]) {
          this.byId(field).setValueState(sap.ui.core.ValueState.Error);
        } else {
          this.byId(field).setValueState(sap.ui.core.ValueState.None);
        }
      });
      var res = datosGral.in1 && datosGral.in4 && datosGral.in5 && datosGral.in10 && datosGral.in12 && datosGral.in13;
      if (!res) {
        MessageBox.error("Please fill all fields with valid inputs");
      }
      return res;
    },
    onCreate: function (oEvent) {
      if (!this.oGlobalBusyDialog) {
        this.oGlobalBusyDialog = new sap.m.BusyDialog();
      }
      this.oGlobalBusyDialog.open();
      setTimeout(() => {
        this.createPlant().finally(() => {
          this.oGlobalBusyDialog.close();
        });
      }, 1);
    },
    createPlant: function () {
      var datosGral = this.datosGral.getData();
      return new Promise(function (resolve, reject) {
        this.valPlant(datosGral.in1).then(function (result) {
            if (result && this.valAllFields()) {
              resolve(this.sendToBackForCreate());
            } else {
              reject(false);
            }
          }.bind(this))
          .catch(function (oError) {
            reject(oError);
          });
      }.bind(this));
    },
    sendToBackForCreate: function () {
      var datosGral = this.datosGral.getData();
      var url = "/plantActionSet";
      var that = this;
      var oPayload = {
        action: "CREATE",
        toMain: [{
          werks: datosGral.in1,
          name1: datosGral.in2,
          name2: datosGral.in3,
          title: datosGral.in4,
          street1: datosGral.in5,
          hno: datosGral.in6,
          street2: datosGral.in7,
          city: datosGral.in8,
          country: datosGral.in9,
          region: datosGral.in10,
          code: datosGral.in11,
          lang: datosGral.in12,
          fabkl: datosGral.in13,
          r1: datosGral.in14 ? "X" : "",
          des: datosGral.in14 ? (datosGral.in16 || "") : "",
          r2: datosGral.in15 ? "X" : "",
          own: datosGral.in15 ? (datosGral.in17 || "") : "",
        }],
        toReturn: []
      };
      this.getModel().setUseBatch(false);
      return new Promise(function (resolve, reject) {
        that.getModel().create(url, oPayload, {
          success: function (res) {
            if (res.toReturn.results) {
              resolve(that.displayResults(res.toReturn.results));
            }
            resolve(true);
          },
          error: function (err) {
            MessageBox.error(err.message);
            reject(err);
          }
        });
      });
    },
    displayResults: function (arrResults) {
      if (arrResults.length > 0) {
        var okFlow = arrResults[0].message.split("&&");
        if (okFlow.length > 1) {
          MessageBox.success(okFlow[1]);
          setTimeout(() => {
            this.closeView();
          }, 2000);
        } else {
          var oResults = arrResults.map((result) => {
            return result.message;
          }).join("\n");
          MessageBox.error(oResults);
        }
      }
    },
    closeView: function () {
      this.initView();
      this.oRouter.navTo("midOptionView");
    },
    handleSearch: function (evt) {
      var param = this._oDialog.param;
      var sValue = evt.getParameter("value");
      var oBinding = evt.getParameter("itemsBinding");
      var filterProperty1;
      switch (param) {
        case "in1":
          filterProperty1 = [new Filter("Werks", FilterOperator.Contains, sValue)];
          break;
        case "in4":
          filterProperty1 = new Filter({
            filters: [new Filter("TitleMedi", FilterOperator.Contains, sValue)],
            and: false
          });
          break;
        case "in5":
          filterProperty1 = [
            new Filter("Region", FilterOperator.Contains, sValue),
            new Filter("Country", FilterOperator.Contains, sValue),
            new Filter("McStreet", FilterOperator.Contains, sValue)
          ];
          break;
        case "in9":
          filterProperty1 = [new Filter("Land1", FilterOperator.Contains, sValue)];
          break;
        case "in10":
          filterProperty1 = [
            new Filter("Land1", FilterOperator.Contains, sValue),
            new Filter("Bland", FilterOperator.Contains, sValue)
          ];
          break;
        case "in12":
          filterProperty1 = [new Filter("Spras", FilterOperator.Contains, sValue)];
          break;
        case "in13":
          filterProperty1 = [new Filter("Ident", FilterOperator.Contains, sValue)];
          break;
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