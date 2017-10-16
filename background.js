var port = chrome.extension.connect({
    name: "FaceCon Network"
});
//vars
var html_data,profile_data,tweets,following,followers,lists,moments;
var data_collected=0;
function getData (url,port,callback) {
	 $.get(url,function (data) {
	 	html_data=data;
	 	profile_data=$(html_data).find('.ProfileNav-list');
	 	
	 	//Twitter Data
	 	tweets=$(profile_data).find('span.ProfileNav-value').eq(0).attr("data-count");
	 	following=$(profile_data).find('span.ProfileNav-value').eq(1).attr("data-count");
	 	followers=$(profile_data).find('span.ProfileNav-value').eq(2).attr("data-count");
	 	lists=$(profile_data).find('span.ProfileNav-value').eq(3).attr("data-count");
	 	moments=$(profile_data).find('span.ProfileNav-value').eq(4).attr("data-count");

	 	validate_data();

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
       	data_collected=1;
       	callback(port,data_collected);
	 });  
}

function validate_data(){
	//validation
	 	if(lists===undefined)
	 		lists=0;
	 	if(tweets===undefined)
	 		tweets=0;
	 	if(following===undefined)
	 		following=0;
	 	if(followers===undefined)
	 		followers=0;
	 	if(moments===undefined)
	 		moments=0;
}

chrome.extension.onConnect.addListener(function(port) {
      port.onMessage.addListener(function(data) {
      				getData(data.url,port,function (port,data_received) {      					
      					var profile_data_pack='{"Name":"'+name+'","tweets":'+tweets+',"following":'+following+',"followers":'+followers+',"lists":'+lists+',"profile_image_url":"'+profile_image_url+'"}';
        				console.log(profile_data_pack);
        				port.postMessage(profile_data_pack);		
      				});  					
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
