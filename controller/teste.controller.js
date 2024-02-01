sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/Filter',
    "sap/ui/model/FilterOperator",
    'sap/ui/model/odata/v2/ODataModel',
    'sap/ui/model/json/JSONModel',
    'sap/m/MessageToast',
    "../model/formatter",
    'sap/ui/core/Fragment',
    'sap/m/library'
], function(Controller, Filter, FilterOperator, ODataModel, JSONModel, MessageToast, formatter, Fragment, mLibrary) {
    "use strict";

    return Controller.extend("application.controller.teste", {
        formatter: formatter,

        onInit: function() {
            this.byId('myList').setBusy(true);
            const oData = new ODataModel("/northwind/northwind.svc/");
            oData.read('/Orders', {
                success: function(data) {
                    const jsonModel = new JSONModel(data.results);
                    this.getView().setModel(jsonModel, "items");
                    this.byId('myList').setBusy(false);
                }.bind(this),
                error: function(error) {
                    console.log('Não foi possível carregar os dados', error);
                    this.byId('myList').setBusy(false);
                }.bind(this)
            });
        },

        _getDialog: function() {
            var oView = this.getView();

            if (!this._pDialog) {
                this._pDialog = Fragment.load({
                    id: oView.getId(),
                    name: "application.view.fragments.Dialog",
                    controller: this
                }).then(function(oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }
            return this._pDialog;
        },

        handleOpenDialogSearchContains: function() {
            this._getDialog().then(function(oDialog) {
                oDialog
                    .setFilterSearchCallback(null)
                    .setFilterSearchOperator(mLibrary.StringFilterOperator.Contains)
                    .open();
            });
        },

        handleOpenDialogCustomSearch: function() {
            this._getDialog().then(function(oDialog) {
                oDialog
                    .setFilterSearchCallback(this.caseSensitiveStringContains)
                    .open();
            }.bind(this));
        },


        handleOpenDialogSearchWordsStartWith: function() {
            this._getDialog().then(function(oDialog) {
                oDialog
                    .setFilterSearchCallback(null)
                    .setFilterSearchOperator(mLibrary.StringFilterOperator.AnyWordStartsWith)
                    .open();
            });
        },

        caseSensitiveStringContains: function(sQuery, sItemText) {
            return sItemText.indexOf(sQuery) > -1;
        }
    });
});