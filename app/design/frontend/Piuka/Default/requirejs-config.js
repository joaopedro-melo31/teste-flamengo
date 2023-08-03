require(['jquery'], function(jQuery) {
    jQuery.migrateMute = true;
});
var config = {
    config: {
        mixins: {
            'mage/menu' : {
                'js/menu-mixin': true
            }
        }
    },
     map: {
        '*': {
            'social-share': 'Magento_Catalog/js/social-share'
        }
    },
    paths: {
        'formStorage': 'js/form-storage'
    }
}
