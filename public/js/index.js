document.contentLoading = true;
if( document.location.toString().indexOf('www.civocracy.org') >= 0 ){
	function trace(){}
}else{
	let elem = document.createElement('script');
	elem.setAttribute('type','text/javascript')
       elem.setAttribute('src', '/js/JKW/tracekit.js')
	document.getElementsByTagName("head")[0].appendChild(elem);
}

// 	<!-- Piwik -->
var _paq = _paq || [];
if(document.cookie.includes("cookieConsentStatistics=true") && document.location.toString().indexOf('civocracy.org') > 0 && ( document.location.toString().indexOf('www.civocracy.org') >= 0 || document.location.toString().indexOf('new.civocracy.org') >= 0 ) ){
	// _paq.push(['trackPageView']);
	_paq.push(['enableLinkTracking']);
	setTimeout(function() {
		var u="//analytics.civocracy.org/";
		_paq.push(['setTrackerUrl', u+'piwik.php']);
		_paq.push(['setSiteId', 1]);
		var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
		g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
	}, 600);
}
// <!-- End Piwik Code -->
// 	<!-- Piwik test on new hoster -->
if(document.cookie.includes("cookieConsentStatistics=true") && document.location.toString().indexOf('civocracy.org') > 0 && ( document.location.toString().indexOf('pr1.civocracy.org') >= 0 /*temporary to test Matomo*/ ||
document.location.toString().indexOf('www.civocracy.org') >= 0 ||
document.location.toString().indexOf('new.civocracy.org') >= 0 ) ){
	// _paq.push(['trackPageView']);
var _paq = window._paq = window._paq || [];
/* tracker methods like "setCustomDimension" should be called before "trackPageView" */
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
(function() {
	var u="//matomo.civocracy.org/";
	_paq.push(['setTrackerUrl', u+'matomo.php']);
	_paq.push(['setSiteId', '1']);
	var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
	g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
})();
}
// 	<!-- End Piwik test on new hoster -->
