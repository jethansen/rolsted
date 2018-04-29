// Document ready
$(document).ready(function(){

    // Enable transitions
    $("body").removeClass("preload");

    //  ----------------------------------------------------------------------
    //  =Disable Hover on Scroll
    //  http://www.thecssninja.com/javascript/pointer-events-60fps
    //  ----------------------------------------------------------------------
    if (!Modernizr.touchevents) {

        var body = document.body,
            timer;
        
        window.addEventListener('scroll', function() {
            clearTimeout(timer);
        
            if(!body.classList.contains('disable-hover')) {
                body.classList.add('disable-hover');
            }
        
            timer = setTimeout(function(){
                body.classList.remove('disable-hover');
            }, 300);
        }, false);
    
    }

    // Scroll to anchor
    $(document).on('click', '.js-scroll-to-anchor', function(e){

        e.preventDefault();

        var tg = $(this).attr('href');

        $('html, body').animate({
            scrollTop: $(tg).offset().top
        }, 1500, "easeInOutQuint");

    });


    function checkMarker() {
        
        var nav = $('.js-nav');
        var marker = $('.js-nav-marker');
        var inner = $(".js-nav-inner");
        var active_item = $(".js-nav-item.is-active");
        var offset = active_item.offset().left - inner.offset().left;
        var offset_css = 'translateX(' + offset + 'px)';
        
        marker.css({
            '-webkit-transform': offset_css,
            '-moz-transform': offset_css,
            '-ms-transform': offset_css,
            'transform': offset_css
        });

        if (active_item.length !== 0) {

            setTimeout(function(){
                nav.addClass('has-active');
            }, 750);
            
        } else {
            nav.removeClass('has-active');
        }

    }

    checkMarker();

    // STICKY ELEMENTS INIT
    var elements = document.querySelectorAll('.js-sticky');
    Stickyfill.add(elements);

    // SHARING
    $(document).on('click', '.js-share-facebook', function(e){
        e.preventDefault();
        window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(location.href), 'facebook-share-dialog', 'width=626,height=436'); 
        return false;
    });

    // BARBA

    // Back button
    $(document).on('click', ".js-back", function(){
        
        // Get previous url
        // console.log(Barba.HistoryManager.history;

    });

    var popping = false;

    window.addEventListener('popstate', function () {
      popping = true;
    });

    // Init barba
    Barba.Pjax.start();
    Barba.Prefetch.init();

    // Reset scroll variable
    var scrollToTop = false;

    // On link clicked
    Barba.Dispatcher.on('linkClicked', function() {
        scrollToTop = true;

            // Remove CTA nvbar
            $('html').addClass('cta-is-hidden');

    });


    Barba.Dispatcher.on('initStateChange', function() {
        popping = false;
    });
    

    // When new page is ready
    Barba.Dispatcher.on('newPageReady', function(currentStatus, oldStatus, container, rawHTML) {
    
        // COMMONS VARS
        var html_new = $(rawHTML);

        // UDATE THEME
        
        // Vars
        var header_class = 'js-header';
        var header_classlist = html_new.find('.' + header_class).attr('class');
        
        // Update theme
        $('.' + header_class).attr('class', header_classlist);

        // UPDATE NAVIGATION
    
        // Vars
        var nav_class = 'js-nav';
        var item_class = 'js-nav-item';
        var current_class = 'is-active';
        var animation_class = 'is-animating'
        var animation_reverse_class = 'is-animating-reverse'
                
        // Old navigation vars
        var nav_current = $('.' + nav_class);
        var active_current = nav_current.find('.' +current_class);
        var active_current_index = active_current.index();

        // New navigation vars
        var nav_new = html_new.find('.' + nav_class);
        var nav_new_classes = nav_new.attr('class');
        var active_new = nav_new.find('.' + current_class);
        var active_new_index = active_new.index();

        // Change theme

        if (active_new.length !== 0) {

            // Only animate if not already current item
            if (active_current_index !== active_new_index) {

            // Change active class
            active_current.removeClass(current_class);
            nav_current.find('.' + item_class).eq(active_new_index).addClass(current_class);

            // Compare indexes and set marker animation direction
            if (active_new_index < active_current_index) {
                nav_current.addClass(animation_reverse_class);
            }

            // Marker animation
            nav_current.addClass(animation_class);

            checkMarker();

            // Reset marker animation
            setTimeout(function(){
                nav_current.removeClass(animation_class).removeClass(animation_reverse_class);
            }, 750);

        }
            
        } else {

            // Remove active class
            active_current.removeClass(current_class);

        } 
        
        // INIT FILTER
        initFilter();

        // INIT INVIEW
        initInview();


    });

    var HideShowTransition = Barba.BaseTransition.extend({
        start: function() {
          this.newContainerLoading.then(this.finish.bind(this));
        },
      
        finish: function() {
          document.body.scrollTop = 0;
          this.done();
        }
      });

    var FadeTransition = Barba.BaseTransition.extend({
        
        start: function() {

            /**
             * This function is automatically called as soon the Transition starts
             * this.newContainerLoading is a Promise for the loading of the new container
             * (Barba.js also comes with an handy Promise polyfill!)
             */
        
            // As soon the loading is finished and the old page is faded out, let's fade the new page
            Promise
                .all([this.newContainerLoading, this.fadeOut()])
                .then(this.fadeIn.bind(this));
            },
        
            fadeOut: function() {
            /**
             * this.oldContainer is the HTMLElement of the old Container
             */
        
            return $('.js-overlay').fadeIn(150).promise();

        },
    
        fadeIn: function() {

            /**
             * this.newContainer is the HTMLElement of the new Container
             * At this stage newContainer is on the DOM (inside our #barba-container and with visibility: hidden)
             * Please note, newContainer is available just after newContainerLoading is resolved!
             */
        
            var _this = this;
            var $el = $(this.newContainer);

            if (scrollToTop === true) {
                window.scrollTo(0,0);
                scrollToTop = false;
            }
            
            // Hide the old container from the DOM
            $(this.oldContainer).hide();

            $('.js-overlay').fadeOut(700, function(){
                
            });

            _this.done();

        }
    });
    
    /**
     * Next step, you have to tell Barba to use the new Transition
     */
    
    Barba.Pjax.getTransition = function() {
        return popping ? HideShowTransition : FadeTransition;
    };

    // INVIEW STUFF

    function initInview() {
    
        // Get all inview elements
        var inviewDomElements = document.querySelectorAll('.js-inview');

        // Prepare array
        var inviewElementsArray = [];
        
        // Push DOM nodes to array
        for (var i = 0; i < inviewDomElements.length; i++) {
            inviewElementsArray.push(inviewDomElements[i]);
        }
        
        // Set oberver treshold
        var observerOptions = {
            threshold: [0, 0.25]
        };

        /// Initialize Observer object
        var observer = new IntersectionObserver(handleIntersection, observerOptions);
       
        // Loop through elements in array
        inviewElementsArray.forEach(function(element) {
            
            /// Start observing
            observer.observe(element);   
        
        });    


        // IntersectionObserver Handler
        function handleIntersection(entries, observerObj) {
        
            entries.forEach(function(entry, i) {
                
                // Set some jQuery references - might be better to do this in vanilla JS
                var elem = $(entry.target),
                    type = elem.data('inviewtype'),
                    once = elem.data('inviewonce')


                /* Video */
                if (type === 'video') {
                    
                    if (entry.intersectionRatio > 0) {
                        elem[0].play();
                    } else {
                        elem[0].pause();
                    }
                    
                }

                // Header element
                if (type === 'header') {
                    
                    if (entry.intersectionRatio > 0) {
                        $('html').addClass('cta-is-hidden');
                    } else {
                        $('html').removeClass('cta-is-hidden');
                    }
                    
                }

                // Carousel element
                if (type === 'carousel') {
                    
                    if (entry.intersectionRatio > 0) {
                        carouselPaused = false;
                    } else {
                        carouselPaused = true;
                    }
                    
                }

                // Default element
                if (type === 'default') {
                    
                    if (entry.intersectionRatio > 0) {
                        elem.addClass('is-inview');
                        
                        // If only one inview events is needed
                        if (once === true) {
                            observerObj.unobserve(entry.target); 
                        }
                        
                    } else {
                        elem.removeClass('is-inview');
                    }
                    
                }
            
            });
        
        };

    };

    initInview();

    // SET UP RESIZE EVENT LISTENER
    var timeout;
    
    // Window.resize event listener
    window.addEventListener('resize', function() {

    	// clear the timeout
        clearTimeout(timeout);

        // start timing for event "completion"
        timeout = setTimeout(function(){
            
            // Check priority nav
            checkMarker();
          
        }, 500);
      
    });

    // FILTER

    var activeFilter = "All";

    function initFilter() {

        // Vars
        var nav = $('.js-filter-nav');
        var navItems = nav.find('.js-filter-nav-item');
        var illustrationContainer = $('.js-filter-illustrations');
        var illustrationItems = $('.js-filter-illustration-item');
        
        // Bind click
        navItems.on('click', function(){

            // Vars
            var thisItem = $(this);
            var tag = thisItem.attr('data-target');
            var targetItems = illustrationItems.filter('[data-tags*=' + tag + ']');

            // If All
            if (tag === 'All') {
                targetItems = illustrationItems;
            }

            // Set active filter (for history)
            activeFilter = tag;

            // Toggle nav class
            navItems.removeClass('is-active');
            thisItem.addClass('is-active');

            // Animate illustrations out
            illustrationContainer.addClass('hide-illustrations').one(transitionEvent, function(){

                // Remove second and third class
                illustrationItems.removeClass('is-third is-second').addClass('is-hidden');

                // Show target illustrations
                targetItems.each(function (i) {

                    var t = $(this);
                    
                    // Add second class
                    if ((i + 1) % 2 == 0) {
                        t.addClass('is-second');
                    }

                    // Add third class
                    if ((i + 1) % 3 == 0) {
                        t.addClass('is-third');
                    }

                    t.removeClass('is-hidden');

                });

                // Animate illustrations in
                illustrationContainer.removeClass('hide-illustrations');

            });


        });

        // Check history for filter settings
        if (activeFilter !== 'All') {
            
            // Disable transitions
            illustrationItems.addClass('disable-transitions');

            // Activate filter
            navItems.filter('[data-target="' + activeFilter + '"]').trigger('click');

            // Enable transitions
            setTimeout(function(){
                illustrationItems.removeClass('disable-transitions');
            },30);


        }

    };

    initFilter();

    // CAROUSEL
    function initCarousel() {

        carouselPaused = false;
       
        setInterval(function(){
            
            if (carouselPaused !== true) {
                var q = function(sel) { return document.querySelector(sel); }   
                q(".js-carousel").appendChild(q(".js-carousel img:first-child"));
            };

        }, 3000)

    }

    initCarousel();

});