var QueryString = function() {
		// This function is anonymous, is executed immediately and 
		// the return value is assigned to QueryString!
		var query_string = {};
		var query = window.location.search.substring(1);
		var vars = query.split("&");
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");
			// If first entry with this name
			if (typeof query_string[pair[0]] === "undefined") {
				query_string[pair[0]] = pair[1];
				// If second entry with this name
			} else if (typeof query_string[pair[0]] === "string") {
				var arr = [query_string[pair[0]], pair[1]];
				query_string[pair[0]] = arr;
				// If third or later entry with this name
			} else {
				query_string[pair[0]].push(pair[1]);
			}
		}
		return query_string;
	}();

function userFormatResult(user) {
	var markup = "<table class='user-result'><tr>";
	if (user.thumbnail !== undefined && user.thumbnail != null) {
		markup += "<td class='user-image'><img class='user-thumbnail' src='" + user.thumbnail + "'/></td>";
	}
	markup += "<td class='user-info'>";
	if (user.components.full_name !== undefined) {
		markup += "<div class='user-name'>" + user.components.full_name.val + "</div>";
	}
	if (user.components.username !== undefined) {
		markup += "<div class='user-username'><i class='fa fa-user'></i> " + user.components.username.val + "</div>";
	}
	if (user.components.github !== undefined) {
		markup += "<div class='user-github'><i class='fa fa-github'></i> " + user.components.github.val + "</div>";
	}
	if (user.components.twitter !== undefined) {
		markup += "<div class='user-github'><i class='fa fa-twitter'></i> " + user.components.twitter.val + "</div>";
	}
	if (user.components.websites !== undefined) {
		markup += "<div class='user-websites'>";
		for (var i = 0; i < user.components.websites.length; i++) {
			markup += "<div class='user-website'><i class='fa fa-globe'></i> " + user.components.websites[i].val + "</div>";
		}
		markup += "</div>";
	}
	markup += "</td></tr></table>";
	return markup;
}

function userFormatSelection(user) {
	return user.components.username;
}
$(document).ready(function() {
	if (QueryString.do == "confirm") {
		var betaEmail = QueryString.email;
		var betaSecret = QueryString.secret;
		var request = $.ajax({
			url: "http://api.keybaseapp.com/v1.0/beta/confirm",
			type: "POST",
			data: {
				email: betaEmail,
				secret: betaSecret
			}
		});
		request.done(function(msg) {
			if (msg.response.success === true) {
				alert("Confirmed! We will let you know when more spost are available in the beta program.");
				return false;
			} else {
				alert(msg.response.error.message);
			}
		});
		request.fail(function(jqXHR, textStatus) {
			alert("Request failed: " + textStatus);
		});
	}
	//======== FLIEXSLIDER PLUGIN =============//
	$ ('.flexslider').flexslider({
		animation: "fade",
		start: function(slider) {
			$('body').removeClass('loading');
		}
	});
	//======== TWITTERFEED PLUGIN =============//
	$('#tweets').tweetable({
		username: 'KeybaseApp',
		time: true,
		rotate: true,
		speed: 6000,
		limit: 5,
		replies: false,
		position: 'append',
		failed: "Sorry, twitter is currently unavailable for this user.",
		html5: true,
		onComplete: function($ul) {
			$('time').timeago();
		}
	});
	//======== LOGIN/SIGNUP FORMS =============//
	$('#signup').on("click", function() {
		var userUsername = document.getElementById("signup-username").value;
		var userEmail = document.getElementById("signup-email").value;
		var request = $.ajax({
			url: "http://api.keybaseapp.com/v1.0/beta/request",
			type: "POST",
			data: {
				username: userUsername,
				email: userEmail
			}
		});
		request.done(function(msg) {
			if (msg.response.success === true) {
				alert("Invitation request recieved! We sent you an email to confirm.");
				return false;
			} else {
				alert(msg.response.error.message);
			}
		});
		request.fail(function(jqXHR, textStatus) {
			alert("Request failed: " + textStatus);
		});
	});
	$('#login').on("click", function() {
		var userUsername = document.getElementById("login-username").value;
		var request = $.ajax({
			url: "http://api.keybaseapp.com/v1.0/session/request",
			type: "POST",
			data: {
				username: userUsername
			}
		});
		request.done(function(msg) {
			if (msg.response.success === true) {
				$('#confirm-payload').val('{"sid":"' + msg.response.data + '"}');
				$('#closelogin').trigger('click');
				setTimeout(function() {
					$('#openlogin').trigger('click');
				}, 1000);
				return false;
			} else {
				alert(msg.response.error.message);
			}
		});
		request.fail(function(jqXHR, textStatus) {
			alert("Request failed: " + textStatus);
		});
	});
	$('#login-confirm').keypress(function(e) {
        if(e.which == 13) {
         	$('#login-confirm').trigger('click');
        }
    });
	$('#login-confirm').on("click", function() {
		var signedPayload = encodeURIComponent($('#verify-signed').val());
		alert(signedPayload);
		var request = $.ajax({
			url: "http://api.keybaseapp.com/v1.0/session/create",
			type: "POST",
			data: {
				signed: signedPayload
			}
		});
		request.done(function(msg) {
			if (msg.response.success === true) {
				window.location.assign("chats.html");
				return false;
			} else {
				alert(msg.response.error.message);
			}
		});
		request.fail(function(jqXHR, textStatus) {
			alert("Request failed: " + textStatus);
		});
	});
	$('#logout').on("click", function() {
		var request = $.ajax({
			url: "http://api.keybaseapp.com/v1.0/session/destroy",
			type: "GET"
		});
		request.done(function(msg) {
			if (msg.response.success === true) {
				window.location.assign("index.html");
				return false;
			} else {
				alert(msg.response.error.message);
			}
		});
		request.fail(function(jqXHR, textStatus) {
			alert("Request failed: " + textStatus);
		});
	});
	$("#search-conversations").select2({
		placeholder: "Create New Conversation",
		minimumInputLength: 1,
		id: function(user) {
			return user.components.username.val;
		},
		ajax: {
			url: "https://keybase.io/_/api/1.0/user/autocomplete.json",
			quietMillis: 100,
			data: function(term) { // page is the one-based page number tracked by Select2
				return {
					q: term
				};
			},
			results: function(data) {
				// notice we return the value of more so Select2 knows if more results can be loaded
				return {
					results: data.completions
				};
			}
		},
		formatResult: userFormatResult,
		formatSelection: userFormatSelection,
		dropdownCssClass: "bigdrop",
		// apply css that makes the dropdown taller
		escapeMarkup: function(m) {
			return m;
		} // we do not want to escape markup since we are displaying html in results
	});
});