sap.ui.define([
    "sap/ui/core/format/DateFormat"
], function(DateFormat) {
    "use strict";

    return {
        // formatar Data
        formatDate: function(sDate) {
            if (sDate) {
                const oDate = new Date(sDate);
                const day = oDate.getDate();
                const month = oDate.getMonth() + 1;
                const year = oDate.getFullYear();

                const formattedDay = day < 10 ? "0" + day : day;
                const formattedMonth = month < 10 ? "0" + month : month

                return formattedDay + "/" + formattedMonth + "/" + year;
            }
            return "";

        },
        formatCurrency: function(value) {
            return parseFloat(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }

    }

})