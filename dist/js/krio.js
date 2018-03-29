'use strict';
$(document).ready( function() {
	$(document).ajaxStart(function() { Pace.restart(); });
	//showPage("splash");
	if($.cookie("access_token") != null){
		hrntSessionajax();
	} else showPage("login-box");
	//$("body").css("display", "none");
	//showPage("splash");
	$("#load").css("display", "none");
	var page = 1;
	$(".modal-lg").css("wigth","75%");
	localStorage.pbox = $("#profile-box").html();
	var membergrid = new Array(
		'<div class="grid-member"><div  data-toggle="modal" data-target=".member-profile-modal" class="grid-member__wrapper ember-view" onclick="hrntLoadMemberProfileajax(', //0, member ID
		',renderMemberProfileCallback)"><img src="', //1, member thumbnail
		'"></div></div>' //2, closing tags
		);
	var newguysCallback = function(xhr){
		$.each(xhr.members, function(i,e){
			$(
				membergrid[0] +
				e.member.id +
				membergrid[1] +
				e.member.thumbnail_large_url +
				membergrid[2]
			).appendTo(".members-grid");
		});
	}
	var nearguysCallback = function(xhr){
		$.each(xhr.members, function(i,e){
			$(
				membergrid[0] +
				e.member.id +
				membergrid[1] +
				e.member.thumbnail_large_url +
				membergrid[2]
			).appendTo(".members-grid-near");
		});
	}
		$(window).scroll(function() {
			var top = $(document).scrollTop();
			if (top > $(window).height()) $('.floating').addClass('fixed'); //200 - это значение высоты прокрутки страницы для добавления класс
			else $('.floating').removeClass('fixed');
			if($('[class="active"] #profile-activity').attr("data-l10n-id") == "profile-activity")
			{
				if ($(window).scrollTop() == $(document).height() - $(window).height()) {
				hrntLoadNewGuysajax(++page, 50, newguysCallback);
				console.log("Triggered new guys");
				}
			}
			if($('[class="active"] #nearby-tab').attr("data-l10n-id") == "profile-nearby")
			{
				if ($(window).scrollTop() == $(document).height() - $(window).height()) {
				hrntLoadNearGuysajax(++page, 50, nearguysCallback);
				console.log("Triggered near guys");
				}
			}
		});
	$('#navtabs a').click(function(e) {
	e.preventDefault();
	$(this).tab('show');
	});
	
	// store the currently selected tab in the hash value
	$("ul.nav-tabs > li > a").on("shown.bs.tab", function(e) {
	var id = $(e.target).attr("href").substr(1);
	localStorage.activeTab = id;
	});
	
	// on load of the page: switch to the currently selected tab
	var hash = localStorage.activeTab;
	$('#navtabs a[href="#' + hash + '"]').tab('show');
	
	$(".osm").on("shown.bs.modal", function(e){
		GetMap();
	});
	
	$("#osmmap").on("click",function(e){
		$(".osm").modal("show");
	});
	$("#grid_increase").on("click",function(e){
		$.each($(".grid-member__wrapper img"),function(i,e){
			$(e).css("width", "auto");
			localStorage.gridsize = "big";
		});
	});
	$("#grid_decrease").on("click",function(e){
		$.each($(".grid-member__wrapper img"),function(i,e){
			$(e).css("width", "100%");
			localStorage.gridsize = "small";
		});
	});
	
	switch(localStorage.gridsize){
		case "small": $.each($(".grid-member__wrapper img"),function(i,e){
					$(e).css("width", "100%");
				}); break;
		case "big": $.each($(".grid-member__wrapper img"),function(i,e){
					$(e).css("width", "auto");
				}); break;
		default: break;
	}
				
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
		
		case "splash": {
			if($("#load").css("display")=="none"){
				$("#load").css("display", "block");
			} else
				$("#load").css("display", "none");
			break;
		}
		default: break;
	}
}

var renderMemberProfileCallback = function(xhr){
	$("#profile-box").html(localStorage.pbox.replace("$display_name",xhr.member.display_name).replace("$headline",xhr.member.headline).replace("$main_photo",xhr.member.photos[0].photo.thumbnail_url));
	var i = 0;
	var imgitem = '<div class="item"><img src="$img"></div>';
	var imgindicator = '<li data-target="#gallery" data-slide-to="$slideno" class="$active"></li>';
	//console.log(xhr.member.gallery.previews);
	$.each(xhr.member.gallery.previews,function(i,e){
		if(e.photo.is_primary == true) var active = "active"; else var active = "";
		$(imgitem.replace("$img",e.photo.url)).appendTo(".carousel-inner");
		$(imgindicator.replace("$slideno",++i).replace("$active",active)).appendTo(".carousel-indicators");
	});
	var tmp = $('.gallery').html();
	$('.gallery').remove();
	$("#gal-container").html(tmp);
}

function renderSelfProfile(data, hrnt_session) {
	console.log("Begin rendering profile");
	var short_chat = new Array(
		'<li><a href="#"><div class="pull-left"><img src="', //0
		'" class="img-circle"></div><h4>', //1
		'<small><i class="fa fa-clock-o"></i> ', //2
		'</small></h4><p>', //3
		'</p></a></li>' //4
		);
	var latest_chat = '<li><img src="thumbnail_url"><a class="users-list-name" href="#">display_name</a><span class="users-list-date">created_at</span></li>';
	var shortchatCallback = function(xhr) { 
		var i = 1;
		$.each(xhr.conversations, function(item,elem){
			if(elem.conversation.profile.photo==null) var photo="https://hornet.com/assets/images/missing_orange-8d70f1cba18f8aea702bcd0df24ae51c.png";
				else var photo = elem.conversation.profile.photo.thumbnail_url;
			if(elem.conversation.unread_count != 0){
				var data;
				switch(elem.conversation.last_message.type){
					case "chat": data = elem.conversation.last_message.data; break;
					case "sticker": data = '<img src="'+elem.conversation.last_message.data.sticker.media_router+'"></img>'; break;
					default: data = elem.conversation.last_message.data; break;
				}
				$(
				short_chat[0] + 
				photo + 
				short_chat[1] +
				elem.conversation.profile.display_name +
				short_chat[2] +
				timeago().format(elem.conversation.last_message.created_at) +
				short_chat[3] +
				data +
				short_chat[4]
				).appendTo("#short-chat");
			}
			if(i <= 8){
				$(latest_chat.replace("thumbnail_url",photo).replace("display_name",elem.conversation.profile.display_name).replace("created_at",timeago().format(elem.conversation.last_message.created_at))).appendTo(".users-list");
				i++;
			}
		});
	};
	hrntLoadConversationsajax(10, shortchatCallback);
	
	var activity = new Array(
		'<li><i class="', //0, icon URL
		'"></i><div class="timeline-item"><span class="time"<i class="fa fa-clock-o"></i> ', //1, time
		'</span><h3 class="timeline-header"><a href="#">', //2, Member display_name
		'</a> ', //3, l20n translated action
		'</h3><div class="timeline-body">', //4, timeline body
		'</div><div class="timeline-footer"></div></div></li>' //5. closing activity
	);
	
	var activitiesCallback = function(xhr){
		var faicon;
		var type;
		var body = "";
		$.each(xhr.activities, function(i,e){
			switch(e.activity.activity_type){
				case "notifications/like": faicon = "fa fa-camera bg-purple"; break;
				case "notifications/hashtag": faicon = "fa fa-tag bg-blue"; break;
				case "notifications/favourited": faicon = "fa fa-heart bg-purple"; break;
				default: faicon = "fa fa-question bg-blue"; break;
			}
			switch(e.activity.title.split(" ").splice(-1)[0]){
				case "photo": type = '<type data-l10n-id="activity-like-photo"></i>'; break;
				case "hashtag": type = '<type data-l10n-id="activity-like-hashtag"></i>'; break;
				case "profile": type = '<type data-l10n-id="activity-like-profile"></i>'; break;
				default: type = '<type data-l10n-id="activity-like"></i>'; break;
			}
			if(e.activity.activity_type == "notifications/favourited") body = '<data data-l10n-id="activity-following"></data>';
			$(
			activity[0] +
			faicon +
			activity[1] +
			e.activity.created_at +
			activity[2] +
			e.activity.profile.display_name +
			activity[3] +
			'<type data-l10n-id="activity-like"></type> ' + type +
			activity[4] +
			body +
			activity[5]
			).appendTo(".timeline");
		});
	}
	hrntLoadActivitiesajax(activitiesCallback);
	
	var membergrid = new Array(
		'<div class="grid-member"><div  data-toggle="modal" data-target=".member-profile-modal" class="grid-member__wrapper ember-view" onclick="hrntLoadMemberProfileajax(', //0, member ID
		',renderMemberProfileCallback)"><img src="', //1, member thumbnail
		'"></div></div>' //2, closing tags
		);
	var newguysCallback = function(xhr){
		$.each(xhr.members, function(i,e){
			$(
				membergrid[0] +
				e.member.id +
				membergrid[1] +
				e.member.thumbnail_large_url +
				membergrid[2]
			).appendTo(".members-grid");
		});
	}
	var nearguysCallback = function(xhr){
		console.log("asdasdas");
		$.each(xhr.members, function(i,e){
			$(
				membergrid[0] +
				e.member.id +
				membergrid[1] +
				e.member.thumbnail_large_url +
				membergrid[2]
			).appendTo(".members-grid-near");
		});
	}
	hrntLoadNewGuysajax(1,50,newguysCallback);
	hrntLoadNearGuysajax(1, 50, nearguysCallback);
	
	var i = 0;
	$("img#member-av").each(function(i,e){$(e).attr("src", data.member.photos[0].photo.thumbnail_url);});
	$("h3#display_name,p#display_name,span#display_name").each(function(i,e){$(e).text(data.member.display_name);});
	$("#headline").text(data.member.headline);
	$("a#followers-count").text(JSON.parse(localStorage.session).totals.fans);
	$("a#following-count").text(JSON.parse(localStorage.session).totals.favourites);
	$("#unreaded-messages").text(JSON.parse(localStorage.session).totals.unread_messages);
	$("[data-l10n-id=recent-chats-new-messages]").prepend(JSON.parse(localStorage.session).totals.unread_messages+" ");
	var aboutblock = $("#aboutblock").html();
	$("#aboutblock").html(aboutblock.replace("$about_you",JSON.parse(localStorage.profile).about_you).replace("$height",JSON.parse(localStorage.profile).height).replace("$weight",JSON.parse(localStorage.profile).weight));
	showPage("member-profile");
}

function hrntThrowError(stage){
	if(stage == null){
		$("#alertmodal").text("Empty parameter 'stage' sended. Function hrntThrowError.");
		$("#drawalert").trigger("click");
		return false;
	}
	switch(stage) {
		case "authentification":{
			$("#Login_infobox error").html("<ec data-l10n-id=\"error-wrong-emailpass\"></ec>");
			$("#Login_infobox").css("display", "block");
		}
		/*case "eachtag":{
			$("#Login_infobox error").html("<ec data-l10n-id=\"error-wrong-emailpass\"></ec>");
			$("#Login_infobox").css("display", "block");
			}*/
		default: break;
	}
}