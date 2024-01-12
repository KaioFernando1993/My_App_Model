sap.ui.define([
        "sap/ui/model/json/JSONModel",
        "sap/ui/Device"
    ],

    function(JSONModel, Device) {
        "use strict";

        return {
            createItemsModel: function() {
                // Lógica para criar e retornar o modelo "items"
                const oModel = new JSONModel();
                // Configurar o modelo conforme necessário
                return oModel;
            },
            createDeviceModel: function() {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            }
        };
    });