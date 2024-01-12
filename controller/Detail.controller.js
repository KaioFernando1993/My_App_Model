// Detail.controller.js
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function(Controller, JSONModel, ODataModel, MessageToast, Filter, FilterOperator) {
    "use strict";

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
        }
    });
});