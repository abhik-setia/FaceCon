
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
	 	bio=$(profile_sidebar_data).find('.ProfileHeaderCard-bio').text();
	 	location_data=$(profile_sidebar_data).find('.ProfileHeaderCard-locationText').text();
	 	joinDate=$(profile_sidebar_data).find('.ProfileHeaderCard-joinDateText').text();
	 	birthDatetext=$(profile_sidebar_data).find('.ProfileHeaderCard-birthdateText').text();

	 	

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
