var port = chrome.extension.connect({
    name: "FaceCon Network"
});
//vars
var html_data,profile_data,tweets=0,following=0,followers=0,lists=0,moments=0,likes=0;
var data_collected=0;
function getData (url,port,callback) {
	 $.get(url,function (data) {
	 	html_data=data;
	 	profile_data=$(html_data).find('.ProfileNav-list');
	 	
	 	twitter_data_items_present=$(profile_data).find('.ProfileNav-label');
	 	twitter_data_items=[];
	 	$(twitter_data_items_present).each(function() {
	 		item_val=$(this).text().toLowerCase().trim();
	 		if(item_val!='')
	 		twitter_data_items.push(item_val);
	 	});
	 	
	 	console.log(twitter_data_items);
	 	
	 	//Twitter Data
	 	for(var i=0;i<twitter_data_items.length;i++){

	 		if(twitter_data_items[i]=="tweets")
	 			tweets=$(profile_data).find('span.ProfileNav-value').eq(i).attr("data-count");
	 		else if(twitter_data_items[i]=="following")
	 			following=$(profile_data).find('span.ProfileNav-value').eq(i).attr("data-count");
	 		else if(twitter_data_items[i]=="followers")
	 			followers=$(profile_data).find('span.ProfileNav-value').eq(i).attr("data-count");
	 		else if(twitter_data_items[i]=="lists")
	 			lists=$(profile_data).find('span.ProfileNav-value').eq(i).text().trim();
	 		else if(twitter_data_items[i]=="moments")
	 			moments=$(profile_data).find('span.ProfileNav-value').eq(i).attr("data-count");
	 		else if(twitter_data_items[i]=="likes")
	 			likes=$(profile_data).find('span.ProfileNav-value').eq(i).attr("data-count");
	 		else{
	 			continue;
	 		}
	 	}

	 	validate_data();

	 	//sidebar data
	 	profile_sidebar_data=$(html_data).find('.ProfileSidebar');
	 	
	 	name=$(profile_sidebar_data).find('.ProfileHeaderCard-nameLink').text().trim();
	 	user_name=$(profile_sidebar_data).find('.u-linkComplex-target').text().trim();

	 	profile_image_url=$(html_data).find('.ProfileAvatar-image')[0].src;
	 	
	 	verified_account_data=$(profile_sidebar_data).find('.ProfileHeaderCard-badges').text().trim();
	 	
	 	if(verified_account_data=='')
	 	verified_account_data='Not Verified account';	
	 	
	 	bio=$(profile_sidebar_data).find('.ProfileHeaderCard-bio').text().trim();
	 	location_data=$(profile_sidebar_data).find('.ProfileHeaderCard-locationText').text().trim();
	 	joinDate=$(profile_sidebar_data).find('.ProfileHeaderCard-joinDateText').text();
	 	birthDatetext=$(profile_sidebar_data).find('.ProfileHeaderCard-birthdateText').text().trim();
	 	
	 	//filtering text here
	 	join_date_items=joinDate.split(" ");
	 	joinDate= join_date_items[1]+" "+join_date_items[2];
	 	
	 	birth_day_items=birthDatetext.split(" ");
	 	if(birthDatetext!=null && birth_day_items[3]!=null)	
	 	{
	 		date=birth_day_items[3].toString();
	 		birth_day_items[3]=date.substr(0,date.length-1);
	 	}
	 	birthDatetext=birth_day_items.slice(2, birth_day_items.length).join(" ");
	 	
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
	 	if(likes===undefined)
	 		likes=0;
	 	if(moments===undefined)
	 		moments=0;
}

chrome.extension.onConnect.addListener(function(port) {
      port.onMessage.addListener(function(data) {
      				getData(data.url,port,function (port,data_received) {      					
      					var profile_data_pack=
      					'{"name":"'+name+
      					'","tweets":'+tweets+
      					',"following":'+following+
      					',"followers":'+followers+
      					',"lists":'+lists+
      					',"likes":'+likes+
      					',"moments":'+moments+
      					',"username":"'+user_name+
      					'","bio":"'+bio+
      					'","location":"'+location_data+
      					'","join_date":"'+joinDate+
      					'","verified_account":"'+verified_account_data+
      					'","birth_date":"'+birthDatetext+
      					'","profile_image_url":"'+profile_image_url+'"}';
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
