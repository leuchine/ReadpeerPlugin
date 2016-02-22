var obj2=null;
if (chrome.extension.getBackgroundPage().flag == 1) {
	obj2 = chrome.extension.getBackgroundPage().obj;
}else{
	obj2 = chrome.extension.getBackgroundPage().obj2;
}

var number_of_annotations = chrome.extension.getBackgroundPage().number_of_annotations;

for ( var i = 0; i < number_of_annotations; i++) {
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
	document
			.write("<div><a class='link' target='_blank' href='http://readpeer.com/user/"
					+ obj2.annotations[i].comment.uid
					+ "'>"
					+ obj2.annotations[i].comment.name
					+ "</a>: "
					+ obj2.annotations[i].comment.body[0] + "</div>");

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
