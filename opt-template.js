/** 
  * @desc template for Optimizely. Checks for dependencies, adds css for each variant (as opposed to Experiment CSS), supplies optional cookie options, and executes variation code only after the DOM is ready.
  * @author Robert Chan | June 2016
  * @required Optimizely
*/

(function(){
	'use strict';
	var dataSrc = optimizely.data.experiments[5105270262],
		optTest = {
			cookieObject: {
							'DUMMYDATA1': 'DUMMYVALUE1',
							'DUMMYDATA2': 'DUMMYVALUE2'
						  },
			cookiesOn: false,
			cssOn: true,
			showCookiesOn: true,
			debug: true,
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
				optTest.doCss(function(){
					if ((navigator.cookieEnabled === true) && (optTest.cookiesOn === true)){
						if(document.referrer === ''){
							optTest.cookieBaker('IsobarCookie', optTest.cookieObject, 30);
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
			doCss: function(thirdCall){
				optTest.jqAlive(function(){
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
						console.log('CSS on');
					}
				    thirdCall();
				});
			},
			domLoaded: function(firstCall){
				if (document.readyState == "complete" || document.readyState == "loaded" || document.readyState == "interactive") {
			        firstCall();
			    } else {
			        document.addEventListener("DOMContentLoaded", callback);
			    }
			},
			jqAlive: function(secondCall){
				optTest.domLoaded(function(){
					console.log('DOM ready');
					if((window.$ && $.isReady) || (window.jQuery && jQuery.isReady)) {
						console.log('jQuery is present');
					} else {
						console.log('jQuery is not present');
					}
					secondCall();
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
					setTimeout(function(){
						console.log('|||||| R U N || C O D E || H E R E ||||||');
					}, 5000);
				});
			}
		};
	optTest.init();
})();