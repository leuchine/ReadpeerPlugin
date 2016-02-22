document.getElementById("signin").onclick = function() {
	location.href = "popup.html";
};

document.getElementById("signup").onclick = function() {
	username = document.getElementById("username").value;
	password = document.getElementById("password").value;
	email = document.getElementById("email").value;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", "http://readpeer.com/api/users", false);
	xmlhttp.setRequestHeader("Content-Type",
			"application/x-www-form-urlencoded");
	xmlhttp
			.send("readpeer_api_key=462294414349540&readpeer_api_secret=637704063335ed9448e2297936cb58ca&name="
					+ username + "&password=" + password + "&email=" + email);
	var obj = eval("(" + xmlhttp.responseText + ")");
	if (obj.code != "200") {
		document.getElementById("error").innerHTML = obj.message;
	}
	if (obj.code == "200") {
		chrome.extension.getBackgroundPage().isLogin = true;
		chrome.extension.getBackgroundPage().uid = obj.uid;
		chrome.extension.getBackgroundPage().access_token = obj.access_token;
		location.href = "profile.html";
	}
};
