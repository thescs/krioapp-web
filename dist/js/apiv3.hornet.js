/*
 * Loading separate chat
 */
function loadConversation(id) {
	if(id == null) {console.log("loadConversation: ID is NULL"); return false;}
	$.ajax({
		url:"https://gethornet.com/api/v3/messages/"+id+"/conversation.json?per_page=500&profile_id="+id,
        type:"GET",
        dataType:"json",
        beforeSend: function(xhr) {
             xhr.setRequestHeader("Authorization", "Hornet "+getCookie("access_token"));
             xhr.setRequestHeader("Content-type", "application/json");
        },
		success:function (js) {
			var line = "";
			$.each(js.messages, function(key, item){
				/*
				 * Detecting who's sender
				 */
				if(item.message.sender == getCookie("profile_id")){
					var cls = "replies";
					var av = getCookie("proofile_thumb");
				} else if (item.message.sender == js.member.id) {
					var cls = "sent";
					var av = js.member.thumbnail_url;
				}
				/*
				 * Detecting if message accepted or viewed
				 */
				 switch (item.message.state){
					 case 'accepted': var msg_state = '<i class="fa fa-eye-slash fa-fw" style="color: lightblue;"></i>'; break;
					 case 'read': var msg_state = ''; break;
					 default: break;
				 }
				/*
				 * Detecting type of message
				 */
				switch (item.message.type){
					case 'chat': 				var data = item.message.data; break;
					case 'permission_response': var data = '* Private photo access '+item.message.data.permission.state+' *'; break;
					case 'permission_request': 	var data = '* Private photo access request *'; break;
					case 'share_photo': 		var data = '<a target="_blank" href="'+item.message.data.photo_url+'"><img src="'+item.message.data.thumb_retina_url+'"></img></a>'; break;
					default: break;
				}
				/*
				 * Compiling client-side code
				 */
				line = line + '<li class="'+cls+'"><img class="av" src="'+av+'"/><p>'+data+'<br /><i>'+item.message.created_at+msg_state+'</i></p></li>';
			});
			/*
			 * Rendering formatted code
			 */
			var headline = '<div class="contact-profile" member-id="'+id+'"><img src="'+js.member.thumbnail_url+'"/><p>'+js.member.display_name+'</p><div class="social-media"><i class="fa fa-facebook" aria-hidden="true"></i><i class="fa fa-twitter" aria-hidden="true"></i><i class="fa fa-instagram" aria-hidden="true"></i></div></div><div class="messages"><ul>';
			var foot = '</ul></div>';
			$("#convList").html(headline+line+foot);
			/*
			 * Scrolling chat window to bottom
			 */
			var div = $('.messages');
			div.scrollTop(div.prop('scrollHeight'));
		}
	});
}
/*
 * Loading chat list
 */
function loadConversations() {
	var per_page = 15;
	var page = 1;
	
	$.ajax({
		url:"https://gethornet.com/api/v3/messages/conversations.json?page="+page+"&per_page="+per_page,
        type:"GET",
        dataType:"json",
        beforeSend: function(xhr) {
             xhr.setRequestHeader("Authorization", "Hornet "+getCookie("access_token"));
             xhr.setRequestHeader("Content-type", "application/json");
        },
		success:function (js) {
			var members = "";
			var current_chat_id = $(".contact-profile").attr("member-id");
			$.each(js.conversations, function(key, item){
				/*
				 * Making formatted out
				 */
				 if(item.conversation.profile.online){var online="online";}else{var online=""}
				 if(item.conversation.profile.display_name==null){var display_name="(no name)";}else{var display_name=item.conversation.profile.display_name;}
				 if(item.conversation.profile.photo==null){var av="/templates/bootstrap/data/av_miss.png";}else{var av=item.conversation.profile.photo.thumbnail_url;}
				 if(item.conversation.unread_count>0){
					 if(item.conversation.profile.id == current_chat_id) loadConversation(item.conversation.profile.id); else
					 var unread_tag='<div class="unread-flag">'+item.conversation.unread_count+'</div>';
					}
					 else
					{
						 var unread_tag = "";
					}
				 members = members + '<li class="contact" member-id="'+item.conversation.profile.id+'" onclick="loadConversation('+item.conversation.profile.id+')"><div class="wrap"><span class="contact-status '+online+'"></span><img src="'+av+'" alt="" /><div class="meta"><p class="name">'+display_name+unread_tag+'</p><p class="preview">'+item.conversation.last_message.data+'</p></div></div></li>';
			});
			$("#conversationsList").html(members);
			var div = $('.messages');
			div.scrollTop(div.prop('scrollHeight'));
			
			/*if( unreaded != js.unread_count) {
				$('#chatAudio')[0].play();
				var unreaded = js.unread_count;
			}*/
		}
});
}
/*
 * Getting summary info, if exists some unread messages
 */
function getTotals(raw = false){
        $.ajax({
            url:"https://gethornet.com/api/v3/session/totals",
            type:"GET",
            dataType:"json",
            beforeSend: function(xhr) {
                 xhr.setRequestHeader("Authorization", "Hornet "+getCookie("access_token"));
            },
            success:function(js) {
				if(raw) $('#count-unread-messages').text(js.unread_messages);
               // $('.load').text(js.unread_messages);
                    if(js.unread_messages > 0) {
                        loadConversations();
                        //loadConversation(current_id);
                    }
                }
            });
    }
/*
 * Sending new message or some data
 */
function sendMessage(id){
	message = $(".message-input input").val();
    if($.trim(message) == '') {
        return false;
    }
    $('<li class="replies" style="opacity: 0.6"><img class="av" src="'+getCookie("proofile_thumb")+'" alt="" /><p>' + message + '</p></li>').appendTo($('.messages ul'));
    $('.message-input input').val(null);
    $('.contact.active .preview').html('<span>You: </span>' + message);
    var div = $('.messages');
	div.scrollTop(div.prop('scrollHeight'));
                /*if (objDiv.length > 0){
                    objDiv[0].scrollTop = objDiv[0].scrollHeight;
                }*/
	$.ajax({
            url:"https://gethornet.com/api/v3/messages.json",
            type:"POST",
            dataType:"json",
			/*data: { message: {
				recipient: current_id,
				type: "chat",
				data: message
			}},*/
			data: '{"message":{"recipient":"'+id+'","type":"chat","data":"'+message+'"}}',
            beforeSend: function(xhr) {
                 xhr.setRequestHeader("Authorization", "Hornet "+getCookie("access_token"));
				 xhr.setRequestHeader("Content-type", "application/json");
            },
            success:function(js) {
				if(js) $(".messages ul .replies").css("opacity", 1);
			}
	});
}
/*
 * Profile loader
 */
function hrntMemberInfo_ajax(id){
	var result;
	$.ajax({
            url:"https://gethornet.com/api/v3/members/"+id+".json",
            type:"GET",
            dataType:"json",
            beforeSend: function(xhr) {
                 xhr.setRequestHeader("Authorization", "Hornet "+getCookie("access_token"));
            },
            success:function(js) {
				result = js;
				console.log(js);
                }
            });
	return(result);
}

function hrntAuthentificateajax(){
	var email = $("#email").val();
	var secret = $("#secret").val();
	$("#submit-signin-btn").toggle("disabled");
	if(email == null || secret == null) return false;
	$.ajax({
		url:"https://gethornet.com/api/v3/session.json",
		type:"POST",
		data:"session%5Bid%5D="+email+"&session%5Bprovider%5D=Hornet&session%5Bsecret%5D="+secret,
		dataType:"JSON",
		success: function(xhr){
			if(xhr){
				$.cookie("access_token", xhr.session.access_token);
				$.cookie("profile_id", xhr.session.profile.id);
				hrntLoadAccountajax(xhr.session.profile.id);
			}
		}
	});
}

function hrntLoadAccountajax(id){
	$.ajax({
		url:"https://gethornet.com/api/v3/members/"+id+".json",
		type:"GET",
		dataType:"json",
		beforeSend: function(xhr) {
                 xhr.setRequestHeader("Authorization", "Hornet "+$.cookie("access_token"));
            },
		success: function(xhr){
			if(xhr) renderSelfProfile(xhr);
		}
	});
}
		