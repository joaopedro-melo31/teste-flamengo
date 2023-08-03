define([
    'jquery',
    'jquery/ui'
], function($) {
    "use strict";

    return function (widget) {
        $.widget('mage.menu', widget.menu, {
            _toggleMobileMode: function () {

                var subMenus;

                $(this.element).off('mouseenter mouseleave');
                this._on({

                    /**
                     * @param {jQuery.Event} event
                     */
                    'click .ui-menu-item:has(a)': function (event) {
                        var target;

                        event.preventDefault();
                        target = $(event.target).closest('.ui-menu-item');
                        //target.get(0).scrollIntoView();

                        if ((!target.hasClass('level-top') || !target.has('.ui-menu').length) && !target.hasClass('parent') ) {
                            window.location.href = target.find('> a').attr('href');
                        }
                    },

                    /**
                     * @param {jQuery.Event} event
                     */
                    'click .ui-menu-item:has(.ui-state-active)': function (event) {
                        this.collapseAll(event, true);
                    }
                });

                subMenus = this.element.find('.level-top');
                $.each(subMenus, $.proxy(function (index, item) {
                    var category = $(item).find('> a span').not('.ui-menu-icon').text(),
                        categoryUrl = $(item).find('> a').attr('href'),
                        menu = $(item).find('> .ui-menu');

                    this.categoryLink = $('<a>')
                        .attr('href', categoryUrl)
                        .text($.mage.__('All %1').replace('%1', category));

                    this.categoryParent = $('<li>')
                        .addClass('ui-menu-item all-category')
                        .html(this.categoryLink);

                    if (menu.find('.all-category').length === 0) {
                        menu.prepend(this.categoryParent);
                    }

                }, this));
            }
        });
    }
});