(function() {
    // store a reference to the application object that will be created
    // later on so that we can use it if need be
    var app = {
        data: {}
    };

    var bootstrap = function() {
        $(function() {    
             
            var initialPage = 'components/authenticationView/view.html';
            if (!localStorage.getItem("user")){
                initialPage = 'components/authenticationView/view.html';
            } else {
                if (!localStorage.getItem("domainCode") && !localStorage0.getItem("entityCode")){
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
        
    var el = new Everlive('Y2IpSQ0peSCVtcpA');
	
    var registered = false;
    
    app.data.el = el;
    app.data.registered = registered;

}());

// START_CUSTOM_CODE_kendoUiMobileApp

function logOut(){
    if (confirm('Are you sure you want to logout?')){
        localStorage.clear();
        app.mobileApp.navigate('components/authenticationView/view.html');
    }
}

var userid = localStorage.getItem("user");

function backPage(){
    var currentView = localStorage.getItem("currentView");
    if (currentView == 'dataListMain'){
        app.mobileApp.navigate('components/homeView/view.html');
    } else if (currentView == 'dataListDetail'){
        app.mobileApp.navigate('components/dataListView/view.html');
    } else {
        app.mobileApp.navigate('components/authenticationView/view.html');
    }
    //app.mobileApp.navigate(localStorage.getItem("currentView"));
}


function registerForPush() {
	var pushSettings = {
        iOS: {
            badge: true,
            sound: true,
            alert: true,
            clearBadge: true
        },
        android: {                
            senderID: '149206055848'
        },
        wp8: {
            channelName: 'EverlivePushChannel'
        },
        notificationCallbackIOS: function(e) {
            // logic for handling push in iOS
        },
        notificationCallbackAndroid: function(e) {
            // logic for handling push in Android
            
            navigator.notification.alert(e.message,
									 function() { },
									 'QAD Connect', 
									 'Done'
            );  
            
        },
        notificationCallbackWP8: function(e) {
            // logic for handling push in Windows Phone. Not available in NativeScript.
        },
        customParameters: {
            userAccount : localStorage.getItem("user")
        }
    };    
    
    app.data.el.push.register(pushSettings).then(
        function(e) {
            app.data.registered = true;
        },
        function(e) {
            app.data.registered = false;
        }
    );	    
}


function getRegistration() {     
    app.data.el.push.getRegistration(
        function () {
            app.data.registered = true;
        }, 
        function() {
            app.data.registered = false;
        });
}

// END_CUSTOM_CODE_kendoUiMobileApp
