var port = chrome.extension.connect({
    name: "Sample Communication"
});
port.postMessage("Hi BackGround");
port.onMessage.addListener(function(msg) {
	var profile_data_pack=JSON.parse(msg);
	document.getElementById("Name_bk").innerHTML=profile_data_pack.Name;
	document.getElementById("Tweets_bk").innerHTML=profile_data_pack.tweets;
	document.getElementById("Following_bk").innerHTML=profile_data_pack.following;
	document.getElementById("Followers_bk").innerHTML=profile_data_pack.followers;
	document.getElementById("Likes_bk").innerHTML=profile_data_pack.lists;
	document.getElementById("profile_pic").src=profile_data_pack.profile_image_url;
	
});