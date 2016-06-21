/** 
  * @desc template for Optimizely. Checks for dependencies, adds css for each variant (as opposed to Experiment CSS), supplies optional cookie options, and executes variation code only after the DOM is ready.
  * @author Robert Chan | June 2016
  * @required Optimizely
*/
(function(){
	'use strict';
	var experimentID  = ''; 
	if(document.URL.indexOf('optimizely_x') > -1){
				var oIdx  = document.URL.indexOf('optimizely_x'),
					idSt  = oIdx+12, 
					idEnd = oIdx+22, 
					idIdx = oIdx+23;
		if(experimentID === ''){
			for(var i=idSt; i<idEnd; i++){ experimentID += document.URL[i]; }
				experimentID = parseInt(experimentID);
				console.log('This is experiment ID ' + typeof experimentID + ' ' + experimentID + ' running on variant index number ' + document.URL[parseInt(idIdx)]);
		}
	} else { console.log('Experiment ID not found. Please manually input it into experimentID to enable the use of this Optimizely template.'); }
	if(experimentID>1 && experimentID !== null){
		var dataSrc = optimizely.data.experiments[experimentID],
			optTest = {
				cookieObject: {
								'DUMMYDATA1': 'DUMMYVALUE1',
								'DUMMYDATA2': 'DUMMYVALUE2'
							  },
				cookiesOn: false,
				cssOn: true,
				showCookiesOn: true,
				debug: true,
				jQueryOn: true,
				experimentTitle: dataSrc.name,
				init: function(){
					if(optTest.debug){
						console.log('Currently on Optimizely revision number ' + optimizely.revision);
						console.log('The experiment name is: ' + optTest.experimentTitle);
						optTest.variant();
					} else {
						console.log('Optimizely debugger is off. Set debug to true to turn debugger on.');
					}
				},
				cookies: function(fourthCall){
					optTest.jqAlive(function(){
						if ((navigator.cookieEnabled === true) && (optTest.cookiesOn === true)){
							if(document.referrer === ''){
								optTest.cookieBaker('CookieName', optTest.cookieObject, 30);
							} else if(document.referrer.indexOf('google')){
								optTest.cookieBaker('', '', 30);
							}
						} else {
							console.log('Cookies are disabled or cookies will not be set');
						}
						fourthCall();
					});
				},
				cookieBaker: function(name, value, exdays){
					var exdate=new Date();
	   					exdate.setDate(exdate.getDate() + exdays);
	   				var cookie = name + '=' + JSON.stringify(value) + (!exdays ? "" : "; expires="+exdate.toUTCString());
	  					document.cookie = cookie;
				},
				cookieChecker: function(name) {
				    var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
					result && (result = JSON.parse(result[1]));
					return result;
				},
				cookieKiller: function(name) {
				 	document.cookie = [name, '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.', window.location.host.toString()].join('');
				},
				doCss: function(secondCall){
					optTest.domLoaded(function(){
						console.log('DOM ready');
						if(optTest.cssOn){
							var css    = 'body{display:none}',
						        head   = document.head || document.getElementsByTagName('head')[0],
						        style  = document.createElement('style');
							    style.type = 'text/css';
							    if(style.stylesheet){
							    	style.styleSheet.cssText = css;
							    } else {
							    	style.appendChild(document.createTextNode(css));
							    }
							    head.appendChild(style);
							console.log('Custom variant-level CSS is on');
						} else {
							console.log('Custom variant-level CSS is off');
						}
					    secondCall();
					});
				},
				domLoaded: function(firstCall){
					if (document.readyState == "complete" || document.readyState == "loaded" || document.readyState == "interactive") {
				        firstCall();
				    } else {
				        document.addEventListener("DOMContentLoaded", callback);
				    }
				},
				jqAlive: function(thirdCall){
					optTest.doCss(function(){
						if(optTest.jQueryOn){
							if((window.$ && $.isReady) || (window.jQuery && jQuery.isReady)) {
								console.log('jQuery is present');
								thirdCall();
							} else {
								var js = document.createElement("script"),
							    	he = document.getElementsByTagName('head')[0];
								    js.type = "text/javascript";
								    js.src = "http://code.jquery.com/jquery-3.0.0.min.js";
								    he.appendChild(js);
								    js.addEventListener("load", function () {
								        console.log('jQuery is now a ' + typeof $);
								        thirdCall(); // Wait for jQuery to append before setting cookies
								    });
								console.log('jQuery was not present, but has now been added');
							}
						}
						/*thirdCall(); //Set cookies agnostic to whether jQuery has been appended*/
					});		
				},
				showCookies: function(fifthCall){
					optTest.cookies(function(){
						if(optTest.showCookiesOn){
							var ckStr = document.cookie, result = {};
								ckStr = ckStr.split(';');
							for (var i = 0; i < ckStr.length; i++) {
							    var cur = ckStr[i].split('=');
							    result[cur[0]] = cur[1];
							}
							console.log('This page contains the following cookies:');
							console.log(result);
						}
						fifthCall();
					});
				},
				variant: function(){
					optTest.showCookies(function(){
						var navList = document.getElementsByClassName('navUtility-list');
						for(var i=0; i<navList.length; i++){
						  navList[i].remove();
						}
					});
				}
			};
		optTest.init();
	}
})();