require(['jquery', 'jquery/ui', 'slick'], function($) {
    $(document).ready(function() {
        $(".slider-categories ul").slick({
            dots: true,
            infinite: true,
            slidesToShow: 7,
            slidesToScroll: 1,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        dots: false
                    }
                }
            ]
        });
        $(".row-mix-produtos .widget-product-grid").slick({
            dots: false,
            infinite: true,
            slidesToShow: 2,
            slidesToScroll: 1,
            mobileFirst: true,
            autoplay: true,
            autoplaySpeed: 4000,
            responsive: [
                {
                    breakpoint: 769,
                    settings: 'unslick'
                }
            ]
        });
        $(".row-products-with-images .widget-product-grid").slick({
            dots: false,
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 4000,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        dots: false
                    }
                }
            ]
        });
        $(".slider-influencers ul").slick({
            dots: false,
            infinite: true,
            slidesToShow: 4,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 4000,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        dots: false
                    }
                }
            ]
        });
        $(".related .products-related .product-items").slick({
            dots: false,
            infinite: true,
            slidesToShow: 4,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 4000,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        dots: false
                    }
                }
            ]
        });

        $(".slider").not('.slick-initialized').slick();

        $(window).on('resize', function() {
            $('.widget-product-grid').slick('resize');
        });
    });
    $('.footer-links-menu strong').on('click', function(){
        $(this).parent('.footer-links-menu').hasClass("active") ?
        $(this).parent('.footer-links-menu').removeClass("active") :
        $(this).parent('.footer-links-menu').addClass("active");
        $(this).parent('.footer-links-menu').find('ul').slideToggle();
    });

       // resize the slide-read-more Div
   var box = $("#product-details-bottom");
   var minimumHeight = 200; // max height in pixels
   var initialHeight = box.innerHeight();
   // reduce the text if it's longer than 200px
   if (initialHeight > minimumHeight) {
      box.css('height', minimumHeight);
      $(".read-more-button").show();
   }
  
   SliderReadMore();

   function SliderReadMore() {
      $(".slide-read-more-button").on('click', function () {
         // get current height
         var currentHeight = box.innerHeight();

         // get height with auto applied
         var autoHeight = box.css('height', 'auto').innerHeight();

         // reset height and revert to original if current and auto are equal
         var newHeight = (currentHeight | 0) === (autoHeight | 0) ? minimumHeight : autoHeight;

         box.css('height', currentHeight).animate({
            height: (newHeight)
         })
         $('html, body').animate({
            scrollTop: box.offset().top
         });
        $(".slide-read-more-button").toggle();
      });
   }

          // resize the slide-read-more Div
   var boxSeo = $(".text-more");
   var minimumHeightSeo = 293; // max height in pixels
   var initialHeightSeo = boxSeo.innerHeight();
   // reduce the text if it's longer than 200pxs
   if (initialHeightSeo > minimumHeightSeo) {
      boxSeo.css('height', minimumHeightSeo);
      $(".slide-read-more-seo-button").hide();
      $(".slide-read-more-seo-button.read-more-button").show();
   }

   SliderReadMoreSeo();

   function SliderReadMoreSeo() {
      $(".slide-read-more-seo-button").on('click', function () {
        $(".text-more").toggleClass('active');
        $(".column-text-seo").toggleClass('active');
         // get current height
         var currentHeightSeo = boxSeo.innerHeight();

         // get height with auto applied
         var autoHeightSeo = boxSeo.css('height', 'auto').innerHeight();

         // reset height and revert to original if current and auto are equal
         var newHeightSeo = (currentHeightSeo | 0) === (autoHeightSeo | 0) ? minimumHeightSeo : autoHeightSeo;
         
         boxSeo.css('height', currentHeightSeo).animate({
            height: (newHeightSeo)
         })
         $('html, body').animate({
            scrollTop: boxSeo.offset().top
         });
        $(".slide-read-more-seo-button").toggle();
      });
   }
});
