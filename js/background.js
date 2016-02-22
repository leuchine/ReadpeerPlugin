var isLogin = false;
var uid = null;
var access_token = null;
var selection = null;
var selection2 = null;
var obj = null;
var obj2 = null;
var before = "";
var contentJSPort = null;
var text = null;
var title = null;
var url = null;
// Check Cookie if user is loggedin;
var checkLogIn = function() {

	if (document.cookie != "") {
		var isUidExists = false;
		var isTokenExists = false;
		isLogin = false;
		var ca = document.cookie.split(';');
		for ( var i = 0; i < ca.length; i++) {
			var c = ca[i].trim();
			if (c.indexOf("uid") == 0) {
				uid = c.substring("uid".length + 1, c.length);
				isUidExists = true;
			} else if (c.indexOf("access_token") == 0) {
				access_token = c.substring("access_token".length + 1, c.length);
				isTokenExists = true;
			}
			// TODO need to send token to server to verify login status.
			var isTokenValid = false;
			var xmlhttp = new XMLHttpRequest();

			if (isUidExists == true && isTokenExists == true) {
				xmlhttp.onreadystatechange = function() {
					if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
						var result = eval("(" + xmlhttp.responseText + ")");
						console.log(result);
						if (result.code == 200) {
							isLogin = true;
							return;
						}
					}
				};

				var params = "access_token=" + access_token;
				console.log("http://readpeer.com/api/users/" + uid
						+ "/check_auth?" + params);
				xmlhttp.open("GET", "http://readpeer.com/api/users/" + uid
						+ "/check_auth?" + params, false);
				// xmlhttp.setRequestHeader("Content-type",
				// "application/x-www-form-urlencoded");
				xmlhttp.send(null);
			}

		}
	}
};

var broadcast = function(msg) {
	for ( var p in ports) {
		ports[p].postMessage(msg);
	}
};

// Handle one time message.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(sender.tab ? "from a content script:" + sender.tab.url
			: "from the extension");
	switch (request.type) {
	case "loginSuccess":
		isLogin = true;
		uid = request.uid;
		access_token = request.access_token;
		contentJSPort.postMessage({
			type : "onLoginSuccess"
		});
		sendResponse({
			response : "done"
		});
		break;

	case "logoutSuccess":
		isLogin = false;
		uid = null;
		access_token = null;
		contentJSPort.postMessage({
			type : "onLogoutSuccess"
		});
		sendResponse({
			response : "done"
		});
		break;
	case "checkLoginStatus":
		checkLogIn();
		sendResponse({
			response: isLogin
		});
		break;
	default:
		sendResponse({
			response : "unknown"
		});
		break;
	}
});

chrome.runtime.onConnect
		.addListener(function(port) {
			contentJSPort = port;
			port.onMessage
					.addListener(function(msg) {
						console.log(msg);
						switch (msg.type) {
						case "search":
							var queryText = msg.queryText;
							var searchType = msg.queryType;
							var xmlhttp = new XMLHttpRequest();

							xmlhttp.onreadystatechange = function() {
								if (xmlhttp.readyState == 4
										&& xmlhttp.status == 200) {
									obj = eval("(" + xmlhttp.responseText + ")");
									port.postMessage({
										type : "onSearchResult",
										searchType : searchType,
										object : obj
									});
								}
							};
							var params = null;
							if (searchType == "selectionSearch") {
								params = "access_token=" + access_token
										+ "&keywords=" + queryText
										+ "&source_url=" + url
										+ "&search_type=keyword";
							} else if (searchType == "wholeSearch") {
								text = queryText;
								params = "access_token="
										+ access_token
										+ "&search_type=document&source_url="
										+ url
										+ "&keywords=Introduction  Singapore is one of Asia's gourmet capitals and although it is home to many of the continent's fanciest restaurants, it also boasts thousands of cheap food joints, where you can indulge on a variety of local delicacies for a fraction of what it costs to dine in a restaurant… Many of those cheap and fabulous eateries can be found in the city's numerous hawker centres. Hawker Centres, for those of you who still don't know, are one of the best things Singapore has to offer to its visitors, and visiting the city-state without eating at one of them is as unthinkable as visiting Paris without dining in a 'Bistro', or visiting Istanbul without having a Döner Kebab in a small bazaar stall..... These 'institutions' started to spring up almost fifty years ago, when spanking clean Singapore decided to move its food hawkers from the streets and regulate them a bit…   ";

							} else {
								window.alert("wrong search type");
								params = "access_token=" + access_token
										+ "&keywords=" + queryText
										+ "&search_type=keyword";
							}
							xmlhttp.open("POST",
									"http://readpeer.com/api/annotations/search?access_token="
											+ access_token, false);
							xmlhttp.setRequestHeader("Content-type",
									"application/x-www-form-urlencoded");

							xmlhttp.send(params);
							break;

						case "checkLoginStatus":
							checkLogIn();
							port.postMessage({
								type : "onCheckLoginStatus",
								status : isLogin
							});
							break;

						case "onLoginSuccess":
							isLogin = true;
							uid = msg.uid;
							access_token = msg.access_token;
							broadcast({
								type : "onCheckLoginStatus",
								status : isLogin
							});
							break;
						case "title":
							title = msg.queryText;
							break;
						case "url":
							url = msg.queryText;
							break;
						default:
							break;
						}
					});
		});
