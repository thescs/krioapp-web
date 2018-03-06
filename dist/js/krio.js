$(document).ready( function() {
	//$("#logo").click(showPage("login-box"));
	//$("#submit-signin-btn").click(showPage("default-container"));
	$(document).ajaxStart(function() { Pace.restart(); });
	if($.cookie("access_token") != null){
		hrntLoadAccountajax($.cookie("profile_id"));
	} else showPage("login-box");
});


function showPage(page){
	switch(page) {
		case "login-box": {
			$("#member-profile").css("display", "none");
			$("#login-box").css("display", "block");
			break;
		}
		
		case "member-profile": {
			$("#member-profile").css("display", "block");
			$("#login-box").css("display", "none");
			break;
		}
		default: break;
	}
}

function renderSelfProfile(data) {
	console.log(data);
	var i = 0;
	$("img#member-av").each(function(i,e){$(e).attr("src", data.member.photos[0].photo.thumbnail_url);});
	$("h3#display_name,p#display_name,span#display_name").each(function(i,e){$(e).text(data.member.display_name);});
	$("#headline").text(data.member.headline);
	
	showPage("member-profile");
}