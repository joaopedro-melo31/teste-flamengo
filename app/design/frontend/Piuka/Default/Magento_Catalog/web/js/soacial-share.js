require([
    'jquery'
], function($) {
    'use strict';

    /**
     * Variables
     */
    const fbBtn = $(".facebook");
    const twBtn = $(".twitter");

    /**
     * Actions
     */

    $(fbBtn).click(() => {
        window.open($(fbBtn).attr("href"),"","width=640,height=480,left=0,top=0,location=no,status=yes,scrollbars=yes,resizable=yes");
        return false;
    });

    $(twBtn).click(() => {
        window.open($(twBtn).attr("href"),"","width=640,height=480,left=0,top=0,location=no,status=yes,scrollbars=yes,resizable=yes");
        return false;
    });
});
