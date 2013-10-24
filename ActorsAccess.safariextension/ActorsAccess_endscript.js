/* https://gist.github.com/mattucf/1078497 */
$.fn.notifyFirstEntry = function(){
    return this.each(function(i, el){
        var input = el;
        var poll_first_entry = function(){
            if ($(input).val().length){
                $(input).trigger('first_entry');
                 clearInterval($(input).data('first_entry_timer'));
                $(input).removeData('first_entry_timer');
            }
        };
        $(input).data('first_entry_timer', setInterval(poll_first_entry, 50));
    });
};

var bUsernameHasBeenAutoFilled = false;
var bPasswordHasBeenAutoFilled = false;
$('#username').bind('first_entry', function(){
    bUsernameHasBeenAutoFilled = true;
    console.log('bUsernameHasBeenAutoFilled');
}).notifyFirstEntry();
$('#password').bind('first_entry', function(){
    bPasswordHasBeenAutoFilled = true;
    console.log('bPasswordHasBeenAutoFilled');
}).notifyFirstEntry();



function loginIfUsernamePassword() {
  // don't login if there's an error message
  if ($("#error").length > 0) {
    return; // do nothing
  }
  // do login in form fields have been autofilled
  else if (bUsernameHasBeenAutoFilled && bPasswordHasBeenAutoFilled) {
    $("form[name$='in']")[0].submit();
  }
}

function doLogin() {
  setInterval(loginIfUsernamePassword, 200);
}

function hideMessage() {
  $("#message").css("display","none");
}

/* http://stackoverflow.com/questions/2196641/how-do-i-make-jquery-contains-case-insensitive-including-jquery-1-8 */
$.expr[":"].containsi = $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
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

function bAddProLink(LAorNY) {
  var region = "1";
  var text = "LA PRO";
  if (LAorNY == "bAddNyProLink") {
    region = "2";
    text = "NY PRO";
  }
  $("#breadcrumb").closest("div").width(800);
  $("table.bd_list").width(800);
  $("ul.sf-menu").children(":first").before(
    $("<li>").append(
      $("<a>").attr("href", "/projects/?view=breakdowns&region=" + region + "&filter=union%20breakdowns&paying_role=1&exclude_realitytv=1").attr('accesskey', 'h').append(text)
  ));
}

$(document).ready( function() {
  var settings, init = function() {
  	if (settings.bPrevNext) {
  	  prevNext();
  	}
  	
  	if (settings.bHideMessages) {
  	  hideMessage();
  	}
  	
    if (settings.bLoginAutomatically && ($("form[name$='in']").length > 0) ) {
      doLogin();
    }
    
    if ((settings.bAddProLink != "bAddNoneProLink") && ($("ul.sf-menu > li").length == 6)) {
      bAddProLink(settings.bAddProLink);
    }
  };

  // listen for an incoming setSettings message
  safari.self.addEventListener("message", function(e) {
    if(e.name === "setSettings") {
//      console.log(e.message);
      settings = e.message;
      init();
    }
  }, false );

  // ask global.html for settings
  safari.self.tab.dispatchMessage("getSettings");
}() )
