// Detail.controller.js
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/library",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/library",
    "sap/m/Text",
    "../model/formatter",

], function(Controller, JSONModel, ODataModel, MessageToast, Filter, FilterOperator, coreLibrary, Dialog, Button, mobileLibrary, Text, formatter) {
    "use strict";

    // shortcut for sap.m.ButtonType
    var ButtonType = mobileLibrary.ButtonType;

    // shortcut for sap.m.DialogType
    var DialogType = mobileLibrary.DialogType;

    // shortcut for sap.ui.core.ValueState
    var ValueState = coreLibrary.ValueState;

    return Controller.extend("application.controller.Detail", {
        formatter: formatter,
        onInit: function() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("detail").attachPatternMatched(this.onObjectMatched, this);
        },

        loadOrderDetails: function(OrderID) {
            this.byId('tableDataContract').setBusy(true);
            const oModel = new ODataModel("/northwind/northwind.svc/");
            const oView = this.getView();
            const filter = new Filter("OrderID", FilterOperator.EQ, OrderID);

            oModel.read("/Order_Details", {
                filters: [filter],
                success: function(oData) {
                    const mappedData = oData.results.map(function(item) {
                        return Object.assign({}, item, { 'editMode': false });
                    });
                    const oJSONModel = new JSONModel(mappedData);
                    oView.setModel(oJSONModel, "orderDetails");
                    this.byId('tableDataContract').setBusy(false);

                }.bind(this),
                error: function() {
                    MessageToast.show("Erro ao carregar os dados do serviço OData.");
                    this.byId('tableDataContract').setBusy(false);
                }.bind(this)
            });
        },

        onObjectMatched: function(oEvent) {
            // Lógica para lidar com a correspondência de padrões
            const oArgs = oEvent.getParameter("arguments");

            // Chame a função para carregar os dados
            this.loadOrderDetails(oArgs.OrderID);
        },

        calculateTotalPrice: function(unitPrice, quantity, discount) {
            var totalPrice = unitPrice * quantity * (1 - discount);

            return parseFloat(totalPrice).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        },

        onSearchDetail: function(oEvent) {
            const sQuery = oEvent.getParameter("query");

            const oTableItems = this.getView().byId("tableDataContract");
            const oBindingTable = oTableItems.getBinding("items");

            if (oBindingTable) {
                let aFilters = [];
                if (sQuery) {
                    const oFilters = new Filter("ProductID", FilterOperator.EQ, sQuery);
                    aFilters.push(oFilters);
                }
                oBindingTable.filter(aFilters);
            }
        },

        onEdit: function(oEvent) {
            const context = oEvent.getSource().getBindingContext("orderDetails");
            const oModel = context.getModel();

            const path = context.getPath();
            const contextObject = JSON.parse(JSON.stringify(context.getObject()));

            oModel.setProperty(`${path}/editMode`, true);
            oModel.setProperty(`${path}/temp`, contextObject);
            this.getView().setModel(oModel, "orderDetails");
        },

        onSave: function(oEvent) {
            const context = oEvent.getSource().getBindingContext("orderDetails");
            const oModel = context.getModel();

            const path = context.getPath();

            oModel.setProperty(`${path}/editMode`, false);

            const oTemp = oModel.getProperty(`${path}/temp`);

            oModel.setProperty(path, oTemp);

            this.getView().setModel(oModel, "orderDetails");
        },

        onCancel: function(oEvent) {
            const context = oEvent.getSource().getBindingContext("orderDetails");
            const oModel = context.getModel();

            const path = context.getPath();

            oModel.setProperty(`${path}/editMode`, false);


            const obj = oModel.getProperty(path);
            delete obj.temp;

            this.getView().setModel(oModel);
        },

        onRegister: function() {
            const input1 = this.getView().byId("bpSap").getValue();

            if (input1 === "") {
                this.messageError();
            } else {
                this.messageSuccess();
            }
        },

        messageSuccess: function() {
            this.oSuccessMessage = new Dialog({
                type: DialogType.Message,
                title: "Success",
                state: ValueState.Success,
                content: new Text({ text: "O parecer foi cadastrado e você será redirecionado\n\ à tela de histórico de pareceres." }),
                beginButton: new Button({
                    type: ButtonType.Emphasized,
                    text: "OK",
                    press: function() {
                        this.oSuccessMessage.close();
                        this.onPareceres();
                    }.bind(this)
                })
            });
            this.oSuccessMessage.open();
        },

        messageError: function() {
            this.oErrorMessage = new Dialog({
                type: DialogType.Message,
                title: "Error",
                state: ValueState.Error,
                content: new Text({ text: "Preencha todos os campos!" }),
                beginButton: new Button({
                    type: ButtonType.Emphasized,
                    text: "OK",
                    press: function() {
                        this.oErrorMessage.close();
                    }.bind(this)
                })
            });
            this.oErrorMessage.open();
        },

        onPareceres: function() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("OpinionsRoute");
        }
    });
});