(function() {
    // store a reference to the application object that will be created
    // later on so that we can use it if need be
    var app = {
        data: {}
    };

    var bootstrap = function() {
        $(function() {    
            
            localStorage.clear();
            
            var initialPage = 'components/authenticationView/view.html';
            if (!localStorage.getItem("user")){
                initialPage = 'components/authenticationView/view.html';
            } else {
                if (!localStorage.getItem("domainCode") && !localStorage.getItem("entityCode")){
                    initialPage = 'components/homeView/view.html';
                } else {
                    initialPage = 'components/dataListView/view.html';
                }                
            }
            
            app.mobileApp = new kendo.mobile.Application(document.body, {

                // you can change the default transition (slide, zoom or fade)
                transition: 'slide',
                // comment out the following line to get a UI which matches the look
                // and feel of the operating system
                skin: 'flat',
                // the application needs to know which view to load first
                initial: initialPage,
                statusBarStyle: 'black-translucent'
            });
        });
    };

    if (window.cordova) {
        // this function is called by Cordova when the application is loaded by the device
        document.addEventListener('deviceready', function() {
            // hide the splash screen as soon as the app is ready. otherwise
            // Cordova will wait 5 very long seconds to do it for you.
            if (navigator && navigator.splashscreen) {
                navigator.splashscreen.hide();
            }

            var element = document.getElementById('appDrawer');
            if (typeof(element) != 'undefined' && element != null) {
                if (window.navigator.msPointerEnabled) {
                    $("#navigation-container").on("MSPointerDown", "a", function(event) {
                        app.keepActiveState($(this));
                    });
                } else {
                    $("#navigation-container").on("touchstart", "a", function(event) {
                        app.keepActiveState($(this));
                    });
                }
            }

            bootstrap();
        }, false);
    } else {
        bootstrap();
    }

    app.keepActiveState = function _keepActiveState(item) {
        var currentItem = item;
        $("#navigation-container li a.active").removeClass("active");
        currentItem.addClass('active');
    };

    window.app = app;

    app.isOnline = function() {
        if (!navigator || !navigator.connection) {
            return true;
        } else {
            return navigator.connection.type !== 'none';
        }
    };
}());

// START_CUSTOM_CODE_kendoUiMobileApp

function logOut(){
    if (confirm('Are you sure you want to logout?')){
        localStorage.clear();
        app.mobileApp.navigate('components/authenticationView/view.html');
    }
}

var userid = localStorage.getItem("user");
// END_CUSTOM_CODE_kendoUiMobileApp