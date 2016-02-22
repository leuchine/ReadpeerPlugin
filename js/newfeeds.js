var obj2 = chrome.extension.getBackgroundPage().obj2;
var number_of_annotations = chrome.extension.getBackgroundPage().number_of_annotations;
if (obj2 == null) {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", "http://www.readpeer.com/api/annotations/popular",
			false);
	xmlhttp.send();
	obj2 = JSON.parse(xmlhttp.responseText);
	number_of_annotations = obj2.number_of_annotations;
	chrome.extension.getBackgroundPage().obj2 = obj2;
	chrome.extension.getBackgroundPage().number_of_annotations = number_of_annotations;
}

var access = chrome.extension.getBackgroundPage().access_token;
var uid = chrome.extension.getBackgroundPage().uid;

document.write(access);
document.write(uid);

for ( var i = 0; i < number_of_annotations; i++) {
	if (i == 0) {
		document
				.write("<p><a id='save' href=''>Save current page to Readpeer</a><input id='check' type='checkbox' name='transfer' value='no' />transfer </p>");
	}
	// window.alert(obj2.annotations[i].comment);
	var img = obj2.annotations[i].comment.img;
	if (img == "")
		img = "images/defaultAvatar.png";
	document
			.write("<div class='feeds'><a target='_blank' href='http://readpeer.com/book/"
					+ obj2.annotations[i].bid
					+ "?bookpage="
					+ obj2.annotations[i].pid
					+ "&annotation="
					+ obj2.annotations[i].aid
					+ "'><img style='float:right' width='60' height='65' src='"
					+ obj2.annotations[i].book_cover
					+ "'/></a><div class='inner'><a target='_blank' href='http://readpeer.com/user/"
					+ obj2.annotations[i].comment.uid
					+ "'>"
					+ "<img src='"
					+ img + "' height='25' width='25'/></a>");
	document
			.write("&nbsp;&nbsp;<a class='link' target='_blank' href='http://readpeer.com/user/"
					+ obj2.annotations[i].comment.uid
					+ "'>"
					+ obj2.annotations[i].comment.name
					+ "</a> share annotation in ");
	document
			.write("<a class='link' target='_blank' href='http://readpeer.com/book/"
					+ obj2.annotations[i].bid
					+ "'>"
					+ obj2.annotations[i].book_title + "</a>");
	document
			.write("<div class='content'><span class='yellow'><a class='link' target='_blank' href='http://readpeer.com/book/"
					+ obj2.annotations[i].bid
					+ "?bookpage="
					+ obj2.annotations[i].pid
					+ "&annotation="
					+ obj2.annotations[i].aid
					+ "'>hightlight: "
					+ obj2.annotations[i].highlight + "</a></span>");
	if (obj2.annotations[i].comment.body == undefined) {
		document
				.write("<div><a class='link' target='_blank' href='http://readpeer.com/user/"
						+ obj2.annotations[i].comment.uid
						+ "'>"
						+ obj2.annotations[i].comment.name + "</a>:</div>");
	} else {
		document
				.write("<div><a class='link' target='_blank' href='http://readpeer.com/user/"
						+ obj2.annotations[i].comment.uid
						+ "'>"
						+ obj2.annotations[i].comment.name
						+ "</a>: "
						+ obj2.annotations[i].comment.body[0] + "</div>");
	}

	if (obj2.annotations[i].type == 0)
		document.write("</div></div></div>");
	else if (obj2.annotations[i].type == 1) {
		document.write("<div><a target='_blank' href='"
				+ obj2.annotations[i].comment.link
				+ "'><img width='60' height='70' src='"
				+ obj2.annotations[i].comment.link
				+ "'/></a></div></div></div></div>");
	} else {
		if (obj2.annotations[i].comment.body[1] != undefined)
			document.write("<div><a target='_blank' href='"
					+ obj2.annotations[i].comment.link + "'>"
					+ obj2.annotations[i].comment.body[1]
					+ "</a></div></div></div></div>");
		else
			document.write("<div><a target='_blank' href='"
					+ obj2.annotations[i].comment.link
					+ "'>link</a></div></div></div></div>");
	}
}

document.getElementById('save').onclick = function() {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", "http://readpeer.com/api/books/html2book", false);
	var check = 1;
	if (document.getElementById('check').checked == true)
		check = 1;
	else
		check = 0;
	var access = chrome.extension.getBackgroundPage().access_token;
	var uid = chrome.extension.getBackgroundPage().uid;
	var title = chrome.extension.getBackgroundPage().title;
	var textstring = chrome.extension.getBackgroundPage().text;
	var url = chrome.extension.getBackgroundPage().url;
	xmlhttp.setRequestHeader("Content-Type",
			"application/x-www-form-urlencoded");
	xmlhttp.send("access_token=" + access + "&uid=" + uid + "&file_name="
			+ title + "&textstring=" + textstring
			+ "&set_private=1&transfer_annotations=" + check + "&source_url="
			+ url);
	// window.alert("access_token=" + access + "&uid=" + uid + "&file_name="
	// + title + "&textstring=" + textstring
	// + "&set_private=1&transfer_annotations=" + check + "&source_url="
	// + url);
	var obj = eval("(" + xmlhttp.responseText + ")");
	if (obj.message == "OK") {
		// + obj.media.bid
//		window.alert("success");
//		window.alert( obj.media.bid);
		window.open("http://readpeer.com/book/" + obj.media.bid, "_blank");
	}
};
