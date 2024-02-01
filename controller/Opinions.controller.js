sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    'sap/ui/export/Spreadsheet',
    'sap/ui/export/library',

], function(Controller, ODataModel, JSONModel, formatter, Spreadsheet, exportLibrary) {
    "use strict";

    const EdmType = exportLibrary.EdmType;

    return Controller.extend("application.controller.Opinions", {
        formatter: formatter,


        onInit: function() {
            this.byId('myTable').setBusy(true);

            const oData = new ODataModel("/northwind/northwind.svc/");

            oData.read('/Orders', {

                success: function(data) {
                    if (data && data.results) {
                        const jsonModel = new JSONModel(data.results);
                        this.getView().setModel(jsonModel, "items");
                    } else {
                        console.error('Dados de pedidos não foram carregados corretamente.');
                    };
                    this.byId('myTable').setBusy(false);
                }.bind(this),
                error: function(error) {
                    console.error('Não foi possível carregar os dados', error);
                    this.byId('myTable').setBusy(false);
                }.bind(this)
            });
        },

        openDocumentPDF: function() {
            var caminhoDocumentoPDF = "caminho/para/o/documento/document.pdf";

            window.open(caminhoDocumentoPDF, "_blank");
        },

        createColumnConfig: function() {
            return [{
                    property: 'OrderID',
                    type: EdmType.Number
                },
                {
                    property: 'CustomerID',
                    type: EdmType.String
                },
                {
                    property: 'EmployeeID',
                    type: EdmType.Number
                },
                {
                    property: 'OrderDate',
                    type: EdmType.Date
                },
                {
                    property: 'ShipName',
                    type: EdmType.String
                },
                {
                    property: 'ShipAddress',
                    type: EdmType.String
                },
                {
                    property: 'ShipCity',
                    type: EdmType.String
                },
                {
                    property: 'ShipPostalCode',
                    type: EdmType.Number
                },
                {
                    property: 'ShipCountry',
                    type: EdmType.String
                }
            ]

        },
        onExport: function() {
            if (!this._oTable) {
                this._oTable = this.byId('myTable');
            }

            const oTable = this._oTable;
            const oRowBinding = oTable.getBinding('items');
            const aCols = this.createColumnConfig();

            const oSettings = {
                workbook: {
                    columns: aCols,
                },
                dataSource: oRowBinding,
                fileName: 'hitorico.xlsx',
            };

            const oSheet = new Spreadsheet(oSettings);
            oSheet.build().finally(function() {
                oSheet.destroy();
            });
        },


    })
})