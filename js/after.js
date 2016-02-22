"use strict";

var DEFAULT_PROFILE_PICTURE = "http://readpeer.com/sites/all/themes/readpeer/images/avatar.png";
var range = null;
var port = chrome.runtime.connect({
	name : "after"
});
var left = null;
var topp = null;
var searchResultObject = null;
var searchResultObjectWhole = null;

var isUserLoggedIn = false;

var isSearchResultReady = false;
var isWaitingResult = false;

// Initiate searchResultDiv:
var sidebarDiv = document.createElement("div");
var resultDiv = document.createElement("div");
var resizeButtonDiv = document.createElement("div");
sidebarDiv.id = "sidebarDiv";
resultDiv.id = "resultDiv";
resizeButtonDiv.id = "resizeButtonDiv";
resizeButtonDiv.innerHTML = "<button id = 'minButton' class = 'windowButton'>-</button><button id = 'maxButton' class = 'windowButton'>+</button>";
sidebarDiv.appendChild(resizeButtonDiv);
sidebarDiv.appendChild(resultDiv);
document.body.appendChild(sidebarDiv);

document.getElementById("minButton").onclick = function() {
	sidebarDiv.style.height = "25px";
	document.body.style.width = window.innerWidth + 'px';
};

document.getElementById("maxButton").onclick = function() {
	sidebarDiv.style.height = window.innerHeight - 50 + "px";
	document.body.style.width = window.innerWidth - 320 + 'px';
};

// function checkIsSearchResultReady(){
// // console.log("isSearchResultReady:
// "+isSearchResultReady+"\tisWaitingResult: "+isWaitingResult);
// return (isSearchResultReady === true);
// }

// Initiate message handler
port.onMessage.addListener(function(msg) {
	console.log(msg);
	switch (msg.type) {
	case "onSearchResult":
		// console.log("isSearchResultReady:
		// "+isSearchResultReady+"\tisWaitingResult: "+isWaitingResult);
		var searchType = msg.searchType;
		searchResultObject = msg.object;
		if (msg.object.code == 200) {
			if (searchType == "selectionSearch") {
				console.log(searchResultObject);
				isSearchResultReady = true;
				// console.log("isSearchResultReady:
				// "+isSearchResultReady+"\tisWaitingResult: "+isWaitingResult);
				if (isWaitingResult) {
					displaySearchResults();
				}
			} else if (searchType == "wholeSearch") {
				searchResultObjectWhole = msg.object;
			}
		} else {
			alert("Please re login to ReadPeer!");
		}

		break;

	case "onCheckLoginStatus":
		isUserLoggedIn = msg.status;
		break;

	case "onLoginSuccess":
		isUserLoggedIn = true;
		// console.log("Loggedin");
		break;

	case "onLogoutSuccess":
		isUserLoggedIn = false;
		// console.log("Loggedout");
		break;
//	case "openPage":
//		window.alert("work fun");
//		window.open(msg.message,"_blank");
//		break;
	default:
	}
});

port.postMessage({
	type : "checkLoginStatus"
});

// Mouse eventListener for text selection.
// FIXME mouseup event conflict with onclick!!!
window.document.body
		.addEventListener(
				"mouseup",
				function(e) {
					// var sel = rangy.getSelection();
					// var
					// selection=highlighter.deserialize('type:textContent|'+this.start+'$'+this.end+'$highlighter$body');
					// highlighter.highlightSelection("italicYellowBg",selection);
					// window.alert(sel.getRangeAt(0).toString());
					// window.alert(highlighter.serialize());

					document.getElementById('search1').style.display = "none";
					left = e.clientX;
					topp = e.clientY;
					if (e.altKey) {
						// if (true) {
						if (!isUserLoggedIn) {
							alert("Seems you have been away for a long time! Welcome back and please Login to ReadPeer first!");
							return;
						}
						// console.log(window.rangy.getSelection().getRangeAt(0).toString());
						var selectionObject = window.rangy.getSelection();
						var selectedText = selectionObject.getRangeAt(0)
								.toString();
						var italicYellowBgApplier = rangy
								.createCssClassApplier("italicYellowBg", {
									tagNames : [ "span", "a", "b" ]
								});
						if (selectedText != "") {
							displaySearchButtons();

							var highlightedElements = document
									.getElementsByClassName("italicYellowBg");
							var length = highlightedElements.length;
							for ( var i = 0; i < length; i++) {
								highlightedElements[0].className = highlightedElements[0].className
										.replace(/\bitalicYellowBg\b/g, "");
							}

							italicYellowBgApplier.toggleSelection();

							// Remove selections once the selection is
							// highlighted.
							selectionObject.removeAllRanges();
							// range =
							// window.rangy.getSelection().getRangeAt(0);
							port.postMessage({
								type : "search",
								queryText : selectedText,
								queryType : "selectionSearch"
							});

							isWaitingResult = false;
							isSearchResultReady = false;

						}
					}
				});

// document.onmousemove = function(ev) {
// left = ev.clientX;
// topp = ev.clientY;
// };

var array = [];
array.push(document.body);
var s = '';
while (array.length != 0) {
	var element = array.pop();
	if (element.nodeType == 3) {
		s = s + element.nodeValue;
	} else {
		if (element.nodeType == 1
				&& (element.nodeName == 'SCRIPT' || element.nodeName == 'STYLE')) {

		} else {
			// console.log(element.nodeName);
			var num = element.childNodes.length - 1;
			for (; num >= 0; num--) {
				array.push(element.childNodes[num]);
			}
		}
	}
}

// port.postMessage({
// selection2 : s
// });

var para = document.createElement("div");
para.id = "search1";
var a1 = document.createElement("a");
var i1 = document.createElement("img");
i1.src = "http://readpeer.com/sites/all/themes/readpeer/images/search.jpg";
i1.width = "23";
i1.height = "23";
i1.title = "Search the selection";

var a2 = document.createElement("a");
var i2 = document.createElement("img");
i2.src = "http://readpeer.com/sites/all/themes/readpeer/images/search.jpg";
i2.width = "23";
i2.height = "23";
i2.title = "Search the whole text";

a1.appendChild(i1);
a2.appendChild(i2);

// var a2 = document.createElement("a");
// var i2 = document.createElement("img");
// i2.src =
// "http://readpeer.com/sites/default/files/users/10/images/search2.png";
// i2.width = "23";
// i2.height = "23";
// i2.title = "Search the whole page";
// a2.appendChild(i2);

var span = document.createElement("span");
span.innerHTML = " ";
para.appendChild(a1);
para.appendChild(span);
para.appendChild(a2);

var indicator = document.createElement("img");
indicator.src = "http://readpeer.com/sites/all/themes/readpeer/images/indicator.gif";
indicator.width = "40";
indicator.height = "40";
indicator.id = "indicator";

document.body.appendChild(para);
document.body.appendChild(indicator);

function showIndicator() {
	document.getElementById('search1').style.display = "none";
	document.getElementById('indicator').style.display = "block";
	document.getElementById('indicator').style.left = left + "px";
	document.getElementById('indicator').style.top = topp + "px";
}

function cancleIndicator() {
	document.getElementById('indicator').style.display = "none";
}

function displaySearchButtons() {
	document.getElementById('search1').style.display = "block";
	document.getElementById('search1').style.left = left + "px";
	document.getElementById('search1').style.top = topp + "px";
}

a1.onclick = function() {
	// console.log("isSearchResultReady:
	// "+isSearchResultReady+"\tisWaitingResult: "+isWaitingResult);
	showIndicator();
	if (isSearchResultReady) {
		displaySearchResults();
	} else {
		isWaitingResult = true;
	}

	// cancleIndicator();
};

a2.onclick = function() {

	showIndicator();

	displaySearchResultsWhole();

};

var displaySearchResults = function() {
	resultDiv.innerHTML = "";

	var number_of_annotations = searchResultObject.number_of_annotations;
	var obj2 = searchResultObject;
	for ( var i = 0; i < number_of_annotations; i++) {
		var img = obj2.annotations[i].comment.img;
		var profilePicture = obj2.annotations[i].comment.picture;
		if (img == "")
			img = "images/defaultAvatar.png";
		if (profilePicture == "")
			profilePicture = DEFAULT_PROFILE_PICTURE;
		var annotationDiv = document.createElement("div");
		var innerHTML = "";
		innerHTML += "<div class='feeds'><a target='_blank' href='http://readpeer.com/book/"
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
				+ profilePicture + "' height='25' width='25'/></a>";

		innerHTML += "&nbsp;&nbsp;<a class='link' target='_blank' href='http://readpeer.com/user/"
				+ obj2.annotations[i].comment.uid
				+ "'>"
				+ obj2.annotations[i].comment.name
				+ "</a> shared annotation in ";

		innerHTML += "<a class='link' target='_blank' href='http://readpeer.com/book/"
				+ obj2.annotations[i].bid
				+ "'>"
				+ obj2.annotations[i].book_title + "</a>";
		innerHTML += "<div class='annotationContent'><p>Hightlight: <br><span class='yellow'><a class='link' target='_blank' href='http://readpeer.com/book/"
				+ obj2.annotations[i].bid
				+ "?bookpage="
				+ obj2.annotations[i].pid
				+ "&annotation="
				+ obj2.annotations[i].aid
				+ "'>"
				+ obj2.annotations[i].highlight + "</a></span></p>";

		if (obj2.annotations[i].comment.body == undefined) {
			innerHTML += "<div><a class='link' target='_blank' href='http://readpeer.com/user/"
					+ obj2.annotations[i].comment.uid
					+ "'>"
					+ obj2.annotations[i].comment.name + "</a>:</div>";
		} else {
			innerHTML += "<div><a class='link' target='_blank' href='http://readpeer.com/user/"
					+ obj2.annotations[i].comment.uid
					+ "'>"
					+ obj2.annotations[i].comment.name
					+ "</a>: "
					+ obj2.annotations[i].comment.body[0] + "</div>";
		}

		// innerHTML += "<div><a class='link' target='_blank'
		// href='http://readpeer.com/user/"
		// + obj2.annotations[i].comment.uid
		// + "'>"
		// + obj2.annotations[i].comment.name
		// + "</a>: "
		// + obj2.annotations[i].comment.body[0] + "</div>";
		if (obj2.annotations[i].type == 0)
			// document.write("</div></div></div>");
			innerHTML += "</div></div></div>";
		else if (obj2.annotations[i].type == 1) {
			innerHTML += "<div><a target='_blank' href='"
					+ obj2.annotations[i].comment.img
					+ "'><img width='60' height='70' src='"
					+ obj2.annotations[i].comment.img
					+ "'/></a></div></div></div></div>";
		} else {
			if (obj2.annotations[i].comment.body[1] != undefined)
				innerHTML += "<div><a target='_blank' href='"
						+ obj2.annotations[i].comment.link + "'>"
						+ obj2.annotations[i].comment.body[1]
						+ "</a></div></div></div></div>";

			else
				innerHTML += "<div><a target='_blank' href='"
						+ obj2.annotations[i].comment.link
						+ "'>link</a></div></div></div></div>";
		}

		annotationDiv.innerHTML = innerHTML;
		console.log(obj2);
		// annotationDiv.start =
		// obj2.annotations[i].highlight_mappingInfo.start;
		// annotationDiv.end = obj2.annotations[i].highlight_mappingInfo.end;
		resultDiv.appendChild(annotationDiv);
		// annotationDiv.onmouseenter = function() {
		// window.alert(this.start);
		// };
	}
	// document.body.style.WebkitTransition = "500ms";
	// document.body.style.MozTransition = "500ms";
	// document.body.style.transition = "500ms";

	var bodyWidth = window.innerWidth - 320;
	var sidebarHeight = window.innerHeight - 50;
	document.body.style.width = bodyWidth + 'px';
	sidebarDiv.style.width = "310px";
	sidebarDiv.style.height = sidebarHeight + 'px';

	cancleIndicator();
	// document.body.onclick = function(){
	// resultDiv.style.width = 0;
	// document.body.style.width = window.innerWidth;
	// }
	// resultDiv.style.display = "block";
	// $.pageslide({direction:'left', href:'#sidebarDiv'});
};

var displaySearchResultsWhole = function() {
	resultDiv.innerHTML = "";

	var number_of_annotations = searchResultObjectWhole.number_of_annotations;
	var obj2 = searchResultObjectWhole;
	for ( var i = 0; i < number_of_annotations; i++) {
		var img = obj2.annotations[i].comment.img;
		var profilePicture = obj2.annotations[i].comment.picture;
		if (img == "")
			img = "images/defaultAvatar.png";
		if (profilePicture == "")
			profilePicture = DEFAULT_PROFILE_PICTURE;
		var annotationDiv = document.createElement("div");
		var innerHTML = "";
		innerHTML += "<div class='feeds'><a target='_blank' href='http://readpeer.com/book/"
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
				+ profilePicture + "' height='25' width='25'/></a>";

		innerHTML += "&nbsp;&nbsp;<a class='link' target='_blank' href='http://readpeer.com/user/"
				+ obj2.annotations[i].comment.uid
				+ "'>"
				+ obj2.annotations[i].comment.name
				+ "</a> shared annotation in ";

		innerHTML += "<a class='link' target='_blank' href='http://readpeer.com/book/"
				+ obj2.annotations[i].bid
				+ "'>"
				+ obj2.annotations[i].book_title + "</a>";
		innerHTML += "<div class='annotationContent'><p>Hightlight: <br><span class='yellow'><a class='link' target='_blank' href='http://readpeer.com/book/"
				+ obj2.annotations[i].bid
				+ "?bookpage="
				+ obj2.annotations[i].pid
				+ "&annotation="
				+ obj2.annotations[i].aid
				+ "'>"
				+ obj2.annotations[i].highlight + "</a></span></p>";
		if (obj2.annotations[i].comment.body == undefined) {
			innerHTML += "<div><a class='link' target='_blank' href='http://readpeer.com/user/"
					+ obj2.annotations[i].comment.uid
					+ "'>"
					+ obj2.annotations[i].comment.name + "</a>:</div>";
		} else {
			innerHTML += "<div><a class='link' target='_blank' href='http://readpeer.com/user/"
					+ obj2.annotations[i].comment.uid
					+ "'>"
					+ obj2.annotations[i].comment.name
					+ "</a>: "
					+ obj2.annotations[i].comment.body[0] + "</div>";
		}
		if (obj2.annotations[i].type == 0)
			// document.write("</div></div></div>");
			innerHTML += "</div></div></div>";
		else if (obj2.annotations[i].type == 1) {
			innerHTML += "<div><a target='_blank' href='"
					+ obj2.annotations[i].comment.img
					+ "'><img width='60' height='70' src='"
					+ obj2.annotations[i].comment.img
					+ "'/></a></div></div></div></div>";
		} else {
			if (obj2.annotations[i].comment.body[1] != undefined)
				innerHTML += "<div><a target='_blank' href='"
						+ obj2.annotations[i].comment.link + "'>"
						+ obj2.annotations[i].comment.body[1]
						+ "</a></div></div></div></div>";

			else
				innerHTML += "<div><a target='_blank' href='"
						+ obj2.annotations[i].comment.link
						+ "'>link</a></div></div></div></div>";
		}

		annotationDiv.innerHTML = innerHTML;
		console.log(obj2);
		try {
			annotationDiv.start = obj2.annotations[i].highlight_mappingInfo.start;
			annotationDiv.end = obj2.annotations[i].highlight_mappingInfo.end;
		} catch (err) {

		}
		resultDiv.appendChild(annotationDiv);
		annotationDiv.onmouseenter = function() {
			// try {
			var selectionRanges = [];
			selectionRanges.push({
				"characterRange" : {
					"start" : this.start,
					"end" : this.end
				}
			});

			var sel = rangy.getSelection();
			sel.restoreCharacterRanges(document, selectionRanges);
			// window.alert(sel.getRangeAt(0).startOffset);
			// sel.getRangeAt(0).setStartBefore(document.body);

			// var sel = highlighter.deserialize('type:TextRange|' + this.start
			// + '$' + this.end + '$1$italicYellowBg$reader$');
			// window.alert(highlighter.serialize(sel));

			// var italicYellowBgApplier = rangy.createCssClassApplier(
			// "italicYellowBg", {
			// tagNames : [ "span", "a", "b" ]
			// });

			var highlightedElements = document
					.getElementsByClassName("italicYellowBg");
			var length = highlightedElements.length;
			for ( var i = 0; i < length; i++) {
				highlightedElements[0].className = highlightedElements[0].className
						.replace(/\bitalicYellowBg\b/g, "");
			}
			highlighter.highlightSelection("italicYellowBg", sel);
			// italicYellowBgApplier.toggleSelection();
			// } catch (err) {
			//
			// }
		};
	}
	// document.body.style.WebkitTransition = "500ms";
	// document.body.style.MozTransition = "500ms";
	// document.body.style.transition = "500ms";

	var bodyWidth = window.innerWidth - 320;
	var sidebarHeight = window.innerHeight - 50;
	document.body.style.width = bodyWidth + 'px';
	sidebarDiv.style.width = "310px";
	sidebarDiv.style.height = sidebarHeight + 'px';

	cancleIndicator();
	// document.body.onclick = function(){
	// resultDiv.style.width = 0;
	// document.body.style.width = window.innerWidth;
	// }
	// resultDiv.style.display = "block";
	// $.pageslide({direction:'left', href:'#sidebarDiv'});
};
port.postMessage({
	type : "title",
	queryText : document.title,

});

port.postMessage({
	type : "url",
	queryText : document.URL,

});

port.postMessage({
	type : "search",
	queryText : document.body.innerHTML,
	queryType : "wholeSearch"
});

