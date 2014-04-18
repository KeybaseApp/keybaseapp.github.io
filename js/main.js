var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    	// If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
    	// If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]], pair[1] ];
      query_string[pair[0]] = arr;
    	// If third or later entry with this name
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  } 
    return query_string;
} ();

    function userFormatResult(user) {
        var markup = "<table class='user-result'><tr>";
        if (user.posters !== undefined && user.posters.thumbnail !== undefined) {
            markup += "<td class='movie-image'><img src='" + user.posters.thumbnail + "'/></td>";
        }
        markup += "<td class='movie-info'><div class='movie-title'>" + user.title + "</div>";
        if (user.critics_consensus !== undefined) {
            markup += "<div class='movie-synopsis'>" + user.critics_consensus + "</div>";
        }
        else if (user.synopsis !== undefined) {
            markup += "<div class='movie-synopsis'>" + user.synopsis + "</div>";
        }
        markup += "</td></tr></table>";
        return markup;
    }

    function movieFormatSelection(movie) {
        return movie.title;
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
			if (msg.response.success == true) {
				alert("Invitation request recieved! We sent you an email to confirm.");
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
	$('.flexslider').flexslider({
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
			if (msg.response.success == true) {
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
	
	$("#search-conversations").select2({
    placeholder:"Create New Conversation",
    minimumInputLength: 1,
    ajax: {
        url: "https://keybase.io/_/api/1.0/user/autocomplete.json",
        quietMillis: 100,
        data: function (term) { // page is the one-based page number tracked by Select2
            return {
                q: term
            };
        },
        results: function (data) {
            var more = (page * 10) < data.total; // whether or not there are more results available
 
            // notice we return the value of more so Select2 knows if more results can be loaded
            return {results: data.movies, more: more};
        }
    },
    formatResult: userFormatResult, // omitted for brevity, see the source of this page
    formatSelection: movieFormatSelection, // omitted for brevity, see the source of this page
    dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
    escapeMarkup: function (m) { return m; } // we do not want to escape markup since we are displaying html in results
});
});
