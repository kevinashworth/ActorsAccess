function loginIfUsernamePassword() {
  if (($('#username').val().length > 0) && ($('#password').val().length > 0)) {
  	$('input[value="go"]').click();
  }
}

function doLogin() {
  setInterval(loginIfUsernamePassword, 200);
}

function hideMessage() {
  $("#message").css("display","none");
}

/* http://bugs.jquery.com/ticket/278 */
$.extend($.expr[':'], {
  'containsi': function(elem, i, match, array)
  {
    return (elem.textContent || elem.innerText || '').toLowerCase()
    .indexOf((match[3] || "").toLowerCase()) >= 0;
  }
});

function prevNext() {
  $("a:containsi('Previous')").each(function() {
    $(this).attr('accesskey', 'p');
    return false;
  });
  $("a:containsi('Next')").each(function() {
    $(this).attr('accesskey', 'n');
    return false;
  });
}

$(document).ready( function() {
  var settings, init = function() {
    var h = document.location.href;
    var p = document.location.pathname;
  	var l1 = h.indexOf("https://secure.actorsaccess.com/projects/?login");
  	var l2 = h.indexOf("loginSecure");
  	var l3 = h.indexOf("loggedout"); // don't immediately log back in
  	var l4 = p.length; // logged in from home page gives just "/"
  	
  	if (settings.bPrevNext) {
  	  prevNext();
  	}
  	
  	if (settings.bHideMessages) {
  	  hideMessage();
  	}

    if (settings.bLoginAutomatically && (l3 < 1)) {
      if ((l1 == 0) || (l2 > 1) || (l4 == 1)) {
        doLogin();
      }
    }
  };

  // listen for an incoming setSettings message
  safari.self.addEventListener("message", function(e) {
    if(e.name === "setSettings") {
      settings = e.message;
      init();
    }
  }, false );

  // ask global.html for settings
  safari.self.tab.dispatchMessage("getSettings");
}() )
