/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

define([
    'jquery',
    'Magento_Customer/js/model/authentication-popup',
    'Magento_Customer/js/customer-data',
    'Magento_Ui/js/modal/alert',
    'Magento_Ui/js/modal/confirm',
    'underscore',
    'mage/url',
    'jquery-ui-modules/widget',
    'mage/decorate',
    'mage/collapsible',
    'mage/cookies',
    'jquery-ui-modules/effect-fade',
    'domReady!'
], function ($, authenticationPopup, customerData, alert, confirm, _, urlBuilder) {
    'use strict';

    $.widget('mage.sidebar', {
        options: {
            isRecursive: true,
            minicart: {
                maxItemsVisible: 3
            }
        },
        scrollHeight: 0,
        shoppingCartUrl: window.checkout.shoppingCartUrl,

        /**
         * Create sidebar.
         * @private
         */
        _create: function () {
            this._initContent();
        },

        /**
         * Update sidebar block.
         */
        update: function () {
            $(this.options.targetElement).trigger('contentUpdated');
            this._calcHeight();
        },

        /**
         * @private
         */
        _initContent: function () {
            var self = this,
                events = {};

            this.element.decorate('list', this.options.isRecursive);

            /**
             * @param {jQuery.Event} event
             */
            events['click ' + this.options.button.close] = function (event) {
                event.stopPropagation();
                $(self.options.targetElement).dropdownDialog('close');
            };
            events['click ' + this.options.button.checkout] = $.proxy(function () {
                var cart = customerData.get('cart'),
                    customer = customerData.get('customer'),
                    element = $(this.options.button.checkout);

                let urlCart = urlBuilder.build("checkout/cart");

                $.cookie('login_redirect', urlCart);
                location.href = urlCart;
            }, this);

            /**
             * @param {jQuery.Event} event
             */
            events['click ' + this.options.button.remove] =  function (event) {
                event.stopPropagation();
                confirm({
                    content: self.options.confirmMessage,
                    actions: {
                        /** @inheritdoc */
                        confirm: function () {
                            self._removeItem($(event.currentTarget));
                        },

                        /** @inheritdoc */
                        always: function (e) {
                            e.stopImmediatePropagation();
                        }
                    }
                });
            };

            /**
             * @param {jQuery.Event} event
             */
            events['change ' + this.options.item.qty] = function (event) {
                //self._showItemButton($(event.target));

                self._updateItemQty($(event.target));

                let cartItem = $(event.target).data("cart-item");
                let inputQtyCartSelector = "#cart-" + cartItem + "-qty";
                let inputCartQty = $(inputQtyCartSelector);

                $(inputCartQty).val($(event.target).val());
                $(inputCartQty).data("item-qty", $(event.target).val());
            };

            /**
             * @param {jQuery.Event} event
             */
            events['focusout ' + this.options.item.qty] = function (event) {
                self._validateQty($(event.currentTarget));
                self._updateItemQty($(event.target));

                let cartItem = $(event.target).data("cart-item");
                let inputQtyCartSelector = "#cart-" + cartItem + "-qty";
                let inputCartQty = $(inputQtyCartSelector);

                $(inputCartQty).val($(event.target).val());
                $(inputCartQty).data("item-qty", $(event.target).val());

            };

            events["click .button-minicart-qty-minus"] = function (event) {
                let buttonMinus = $(event.target)[0];

                let cartItem = $(buttonMinus).data("item-id");

                let inputMiniCartQtyCartSelector = "#cart-item-" + cartItem + "-qty";
                let inputMiniCartCartQty = $(inputMiniCartQtyCartSelector);

                let inputCartQtyCartSelector = "#cart-" + cartItem + "-qty";
                let inputCartQty = $(inputCartQtyCartSelector);

                let newValue = parseInt($(inputMiniCartQtyCartSelector).val()) - 1;

                if (newValue < 1) {
                    $(inputMiniCartCartQty).val("1");
                    $(inputMiniCartCartQty).data("item-qty", "1");

                    $(inputCartQty).val("1");
                    $(inputCartQty).data("item-qty", "1");
                } else {
                    $(inputMiniCartCartQty).val(newValue);
                    $(inputMiniCartCartQty).data("item-qty", newValue);

                    $(inputCartQty).val(newValue);
                    $(inputCartQty).data("item-qty", newValue);

                    self._validateQty($(inputMiniCartCartQty));
                    self._updateItemQty($(inputMiniCartCartQty));
                }
            };

            events["click .button-minicart-qty-plus"] = function (event) {
                let buttonPlus = $(event.target)[0];

                let cartItem = $(buttonPlus).data("item-id");

                let inputMiniCartQtyCartSelector = "#cart-item-" + cartItem + "-qty";
                let inputMiniCartCartQty = $(inputMiniCartQtyCartSelector);

                let inputCartQtyCartSelector = "#cart-" + cartItem + "-qty";
                let inputCartQty = $(inputCartQtyCartSelector);

                let newValue = parseInt($(inputMiniCartQtyCartSelector).val()) + 1;

                $(inputMiniCartCartQty).val(newValue);

                $(inputCartQty).val(newValue);
                $(inputCartQty).data("item-qty", newValue);


                self._validateQty($(inputMiniCartCartQty));
                self._updateItemQty($(inputMiniCartCartQty));


            };


            this._on(this.element, events);
            this._calcHeight();
        },

        /**
         * @param {*} origin - origin qty. 'data-item-qty' attribute.
         * @param {*} changed - new qty.
         * @returns {Boolean}
         * @private
         */
        _isValidQty: function (origin, changed) {
            return origin != changed && //eslint-disable-line eqeqeq
                changed.length > 0 &&
                changed - 0 == changed && //eslint-disable-line eqeqeq
                changed - 0 > 0;
        },

        /**
         * @param {Object} elem
         * @private
         */
        _validateQty: function (elem) {
            var itemQty = elem.data('item-qty');

            if (!this._isValidQty(itemQty, elem.val())) {
                elem.val(itemQty);
            }
        },

        /**
         * @param {HTMLElement} elem
         * @private
         */
        _hideItemButton: function (elem) {
            var itemId = elem.data('cart-item');

            $('#update-cart-item-' + itemId).hide('fade', 300);
        },

        /**
         * @param {HTMLElement} elem
         * @private
         */
        _updateItemQty: function (elem) {
            var itemId = elem.data('cart-item');

            this._ajax(this.options.url.update, {
                'item_id': itemId,
                'item_qty': $('#cart-item-' + itemId + '-qty').val()
            }, elem, this._updateItemQtyAfter);
        },

        /**
         * Update content after update qty
         *
         * @param {HTMLElement} elem
         */
        _updateItemQtyAfter: function (elem) {
            var productData = this._getProductById(Number(elem.data('cart-item')));

            if (!_.isUndefined(productData)) {
                $(document).trigger('ajax:updateCartItemQty');

                /** modificado
                 if (window.location.href === this.shoppingCartUrl) {
                    window.location.reload(false);
                } */
            }
            this._hideItemButton(elem);
        },

        /**
         * @param {HTMLElement} elem
         * @private
         */
        _removeItem: function (elem) {
            var itemId = elem.data('cart-item');

            this._ajax(this.options.url.remove, {
                'item_id': itemId
            }, elem, this._removeItemAfter);
        },

        /**
         * Update content after item remove
         *
         * @param {Object} elem
         * @private
         */
        _removeItemAfter: function (elem) {
            var productData = this._getProductById(Number(elem.data('cart-item')));

            if (!_.isUndefined(productData)) {
                $(document).trigger('ajax:removeFromCart', {
                    productIds: [productData['product_id']],
                    productInfo: [
                        {
                            'id': productData['product_id']
                        }
                    ]
                });

                if (window.location.href.indexOf(this.shoppingCartUrl) === 0) {
                    window.location.reload();
                }
            }
        },

        /**
         * Retrieves product data by Id.
         *
         * @param {Number} productId - product Id
         * @returns {Object|undefined}
         * @private
         */
        _getProductById: function (productId) {
            return _.find(customerData.get('cart')().items, function (item) {
                return productId === Number(item['item_id']);
            });
        },

        /**
         * @param {String} url - ajax url
         * @param {Object} data - post data for ajax call
         * @param {Object} elem - element that initiated the event
         * @param {Function} callback - callback method to execute after AJAX success
         */
        _ajax: function (url, data, elem, callback) {
            $.extend(data, {
                'form_key': $.mage.cookies.get('form_key')
            });

            $.ajax({
                url: url,
                data: data,
                type: 'post',
                dataType: 'json',
                context: this,

                /** @inheritdoc */
                beforeSend: function () {
                    elem.attr('disabled', 'disabled');
                },

                /** @inheritdoc */
                complete: function () {
                    elem.attr('disabled', null);
                }
            })
                .done(function (response) {
                    var msg;

                    if (response.success) {
                        callback.call(this, elem, response);
                    } else {
                        //MODIFIED if item is out of stock return last qty in cart input also.
                        let itemId = $(elem).data("cart-item");
                        let qty = parseInt($(elem).data("item-qty"));
                        let cartQtySelector = "#cart-" + itemId + "-qty";
                        let qtyCartInput = $(cartQtySelector);

                        if (qty >=1) {
                            $(qtyCartInput).val(qty);
                            $(qtyCartInput).data("item-qty", qty);
                        } else {
                            $(qtyCartInput).val("1");
                            $(qtyCartInput).data("item-qty", "1");
                        }

                        msg = response['error_message'];
                        if (msg) {
                            alert({
                                content: msg
                            });
                        }
                    }
                })
                .fail(function (error) {
                    console.log(JSON.stringify(error));
                });
        },

        /**
         * Calculate height of minicart list
         *
         * @private
         */
        _calcHeight: function () {
            var self = this,
                height = 0,
                counter = this.options.minicart.maxItemsVisible,
                target = $(this.options.minicart.list),
                outerHeight;

            self.scrollHeight = 0;
            target.children().each(function () {

                if ($(this).find('.options').length > 0) {
                    $(this).collapsible();
                }
                outerHeight = $(this).outerHeight(true);

                if (counter-- > 0) {
                    height += outerHeight;
                }
                self.scrollHeight += outerHeight;
            });

            target.parent().height(height);
        }
    });

    return $.mage.sidebar;
});
