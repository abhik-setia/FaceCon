
//vars
var html_data,profile_data,tweets,following,followers,lists,moments;

$(function () {
	 $.get("https://twitter.com/abhik_setia",function (data) {
	 	html_data=data;
	 	profile_data=$(html_data).find('.ProfileNav-list');
	 	
	 	//Twitter Data
	 	tweets=$(profile_data).find('span.ProfileNav-value').eq(0).text();
	 	following=$(profile_data).find('span.ProfileNav-value').eq(1).text();
	 	followers=$(profile_data).find('span.ProfileNav-value').eq(2).text();
	 	lists=$(profile_data).find('span.ProfileNav-value').eq(3).text();
	 	moments=$(profile_data).find('span.ProfileNav-value').eq(4).text();

	 	//sidebar data
	 	profile_sidebar_data=$(html_data).find('.ProfileSidebar');
	 	
	 	name=$(profile_sidebar_data).find('.ProfileHeaderCard-nameLink').text();
	 	user_name=$(profile_sidebar_data).find('.u-linkComplex-target').text();

	 	profile_image_url=$(html_data).find('.ProfileAvatar-image')[0].src;
	 	
	 	bio=$(profile_sidebar_data).find('.ProfileHeaderCard-bio').text();
	 	location_data=$(profile_sidebar_data).find('.ProfileHeaderCard-locationText').text();
	 	joinDate=$(profile_sidebar_data).find('.ProfileHeaderCard-joinDateText').text();
	 	birthDatetext=$(profile_sidebar_data).find('.ProfileHeaderCard-birthdateText').text();
	 	console.log('Data Collected');
	 }); 
});

chrome.extension.onConnect.addListener(function(port) {
      port.onMessage.addListener(function(msg) {
      		var profile_data_pack='{"Name":"'+name+'","tweets":'+tweets+',"following":'+following+',"followers":'+followers+',"lists":'+lists+',"profile_image_url":"'+profile_image_url+'"}';
           port.postMessage(profile_data_pack);
      });
 });

function getTweets () {
	return tweets;
}
function getFollowing () {
	return following;
}
function getFollowers () {
	return followers;
}
function getLists () {
	return lists;
}
function getMoments () {
	return moments;
}
