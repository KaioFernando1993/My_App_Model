sap.ui.define([
        "sap/ui/core/UIComponent",
        "application/model/models"
    ],
    function(UIComponent, models) {
        "use strict";

        return UIComponent.extend("application.Component", {
            metadata: {
                manifest: "json"
            },

            init: function() {
                // Modelo "items"
                const oItemsModel = models.createItemsModel();
                this.setModel(oItemsModel, "items");


                // Chamar a função init do componente pai
                UIComponent.prototype.init.apply(this, arguments);

                // Habilitar o roteamento
                this.getRouter().initialize();

                // Configurar o modelo do dispositivo
                this.setModel(models.createDeviceModel(), "device");

            }
        });
    }
);