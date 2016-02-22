if (chrome.extension.getBackgroundPage().profile == null) {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", "http://www.readpeer.com/api/users/"
			+ chrome.extension.getBackgroundPage().uid
			+ "/profile?access_token="
			+ chrome.extension.getBackgroundPage().access_token, false);
	xmlhttp.send();
	chrome.extension.getBackgroundPage().profile = JSON
			.parse(xmlhttp.responseText);
}
var profile = chrome.extension.getBackgroundPage().profile;
document.getElementById("1").href = "http://readpeer.com/user/"
		+ chrome.extension.getBackgroundPage().uid + "/content";
document.getElementById("1").innerHTML = profile.num_of_books + " books "
		+ profile.num_of_annotations + " annotations";
document.getElementById("2").href = "http://readpeer.com/user/"
		+ chrome.extension.getBackgroundPage().uid + "/following";
document.getElementById("2").innerHTML = "Following "
		+ profile.num_of_following;
document.getElementById("3").href = "http://readpeer.com/user/"
	+ chrome.extension.getBackgroundPage().uid + "/follower";
document.getElementById("3").innerHTML = "Follower "
	+ profile.num_of_follower;