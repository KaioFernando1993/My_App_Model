sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "../model/formatter",
    "sap/ui/model/resource/ResourceModel"

], function(Controller, ODataModel, JSONModel, Filter, FilterOperator, formatter, ResourceModel) {
    "use strict";

    return Controller.extend("application.controller.HomePage", {
        formatter: formatter,
        onInit: function() {
            this.byId('myList').setBusy(true)
            const oData = new ODataModel("/northwind/northwind.svc/");
            // console.log(oData);

            oData.read('/Orders', {
                success: function(data) {
                    const jsonModel = new JSONModel(data.results);
                    this.getView().setModel(jsonModel, "items");
                    // console.log(data)
                    this.byId('myList').setBusy(false);
                }.bind(this),
                error: function(error) {
                    console.log('Não foi possível carregar os dados', error);
                    this.byId('myList').setBusy(false)
                }.bind(this)
            });
            // set i18n model on view
            const i18nModel = new ResourceModel({
                bundleName: "application.i18n.i18n"
            });
            this.getView().setModel(i18nModel, "i18n");
        },
        onListItemPress: function(oEvent) {
            const oItem = oEvent.getSource().getBindingContext("items");

            if (oItem) {
                const sOrderID = oItem.getProperty("OrderID");
                console.log(sOrderID);
                if (sOrderID) {
                    const oRouter = this.getOwnerComponent().getRouter();
                    oRouter.navTo("detail", {
                        OrderID: encodeURIComponent(sOrderID)
                    });
                } else {
                    console.error("OrderID is undefined or empty.");
                }
            } else {
                console.error("Invoice context is undefined.");
            }
        },
        onFilterPress: function() {
            const oView = this.getView();
            const oList = oView.byId("myList");
            const oBinding = oList.getBinding("items");

            const aFilterConfigs = [
                { field: "OrderID", controlId: "onSearchOrderId", operator: FilterOperator.EQ, type: "number" },
                { field: "CustomerID", controlId: "onSearchCodeBp", operator: FilterOperator.Contains, type: "string" },
                { field: "RequiredDate", controlId: "requiredDateSearch", operator: FilterOperator.EQ, type: "number" },
                { field: "ShippedDate", controlId: "shippedDateSearch", operator: FilterOperator.EQ, type: "number" },
                { field: "ShipName", controlId: "shipNameSearch", operator: FilterOperator.EQ, type: "number" },
                { field: "ShipAddress", controlId: "shipAddressSearch", operator: FilterOperator.Contains, type: "string" },
                { field: "ShipCity", controlId: "shipCitySearch", operator: FilterOperator.Contains, type: "string" },
                { field: "ShipPostalCode", controlId: "shipPostalCodeSearch", operator: FilterOperator.EQ, type: "number" },
                { field: "ShipCountry", controlId: "shipCountrySearch", operator: FilterOperator.Contains, type: "string" }
                // Adicione mais campos conforme necessário
            ];

            const aFilters = aFilterConfigs.reduce((aAccumulatedFilters, oFilterConfig) => {
                const sValue = oView.byId(oFilterConfig.controlId).getValue();
                if (sValue) {
                    const oFilter = new Filter(oFilterConfig.field, oFilterConfig.operator, oFilterConfig.type === "number" ? parseInt(sValue) : sValue);
                    aAccumulatedFilters.push(oFilter);
                }
                return aAccumulatedFilters;
            }, []);

            oBinding.filter(aFilters, false);

            if (oBinding.getLength() === 0) {
                sap.m.MessageToast.show("Nenhum resultado encontrado.");
                oBinding.filter([]);
            }
        },



    });
});