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
    "sap/m/Text"

], function(Controller, JSONModel, ODataModel, MessageToast, Filter, FilterOperator, coreLibrary, Dialog, Button, mobileLibrary, Text) {
    "use strict";

    // shortcut for sap.m.ButtonType
    var ButtonType = mobileLibrary.ButtonType;

    // shortcut for sap.m.DialogType
    var DialogType = mobileLibrary.DialogType;

    // shortcut for sap.ui.core.ValueState
    var ValueState = coreLibrary.ValueState;

    return Controller.extend("application.controller.Detail", {
        onInit: function() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("detail").attachPatternMatched(this.onObjectMatched, this);
        },

        loadOrderDetails: function(OrderID) {
            this.byId('tableDataContract').setBusy(true)
            const oModel = new ODataModel("/northwind/northwind.svc/");
            const oView = this.getView();
            const filter = new Filter("OrderID", FilterOperator.EQ, OrderID);

            oModel.read("/Order_Details", {
                filters: [filter],

                success: function(oData) {
                    const oJSONModel = new JSONModel(oData.results);
                    oView.setModel(oJSONModel, "orderDetails");
                    this.byId('tableDataContract').setBusy(false);

                }.bind(this),
                error: function() {
                    MessageToast.show("Erro ao carregar os dados do serviço OData.");
                    this.byId('tableDataContract').setBusy(false);
                }.bind(this)
            })
        },

        onObjectMatched: function(oEvent) {
            // Lógica para lidar com a correspondência de padrões
            const oArgs = oEvent.getParameter("arguments");
            console.log("Data from HomePage: ", oArgs);

            // Chame a função para carregar os dados
            this.loadOrderDetails(oArgs.OrderID);
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
        onRegister: function() {
            const input1 = this.getView().getModel().getProperty("/bpSap");

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
        // Rota Provisória
        onPareceres: function() {
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("OpinionsRoute");
        }
    });
});