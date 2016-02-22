document.getElementById("logout").onclick = function() {
	chrome.runtime.sendMessage(
				{
  					type: "logoutSuccess",
  				}, 
				function(response) {
  					console.log(response);
	});
	var d           = new Date();
	var expires     = "expires=" + d.toGMTString();
	document.cookie = "uid=" + obj.uid + "; " + expires;
	document.cookie = "access_token=" + obj.access_token + "; " + expires;
};

var xmlhttp = new XMLHttpRequest();
var obj;

//Use a callback to handle server response.
xmlhttp.onreadystatechange = function(){
	if (xmlhttp.readyState == 4 && xmlhttp.status == 200 ){
		obj = eval("(" + xmlhttp.responseText + ")");
		document.getElementById("name").innerHTML = "&nbsp;" + obj.name;
		if (obj.picture != "") {
			document.getElementById("avatar").src = obj.picture;
		}
	}
};

xmlhttp.open("GET", "http://readpeer.com/api/users/"
		+ chrome.extension.getBackgroundPage().uid + "/profile?access_token="
		+ chrome.extension.getBackgroundPage().access_token, false);
xmlhttp.send();


document.getElementById("1").onclick = tab1;
document.getElementById("3").onclick = tab3;

element = document.getElementById("1");
