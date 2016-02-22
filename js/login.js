document.getElementById("signin").onclick = function() {
	document.getElementById("error").innerHTML = "loading";
	username = document.getElementById("username").value;
	password = document.getElementById("password").value;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp
			.open(
					"PUT",
					"http://readpeer.com/api/users?readpeer_api_key=462294414349540&readpeer_api_secret=637704063335ed9448e2297936cb58ca&name="
							+ username + "&password=" + password, false);
	xmlhttp.send();
	var obj = eval("(" + xmlhttp.responseText + ")");
	if (obj.code != "200") {
		document.getElementById("error").innerHTML = obj.message;
	}
	if (obj.code == "200") {
		chrome.runtime.sendMessage({
			type : "loginSuccess",
			uid : obj.uid,
			access_token : obj.access_token
		}, function(response) {
			console.log(response);
		});
		var d = new Date();
		d.setTime(d.getTime() + (14 * 24 * 60 * 60 * 1000));
		var expires = "expires=" + d.toGMTString();
		document.cookie = "uid=" + obj.uid + "; " + expires + "; path='/'";
		document.cookie = "access_token=" + obj.access_token + "; " + expires
				+ "; path='/'";
		location.href = "profile.html";
	}
};
chrome.runtime.sendMessage({
	type : "checkLoginStatus",
}, function(response) {
//	window.alert("come here");
	if (response == true) {
		location.href = "profile.html";
	}
});
document.getElementById("signup").onclick = function() {
	location.href = "signup.html";
};