var port = chrome.extension.connect({
    name: "FaceCon Network"
});

chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    var curr_tab=tabs[0].url;
    var urlPattern=new RegExp("https://twitter.com/*");
    if(curr_tab.match(urlPattern)){
	    port.postMessage({ url:curr_tab,msg:'collect_data'});

	    port.onMessage.addListener(function(data) {
	    	profile_data_pack=JSON.parse(data);
			document.getElementById("Name_bk").innerHTML=profile_data_pack.Name;
			document.getElementById("Tweets_bk").innerHTML=profile_data_pack.tweets;
			document.getElementById("Following_bk").innerHTML=profile_data_pack.following;
			document.getElementById("Followers_bk").innerHTML=profile_data_pack.followers;
			document.getElementById("Likes_bk").innerHTML=profile_data_pack.lists;
			document.getElementById("profile_pic").src=profile_data_pack.profile_image_url;
		});
    }else{
    	document.body.innerHTML="<h5 style='padding: 5%;color: cornflowerblue;'>Only For Twitter Folks<h5>";
    }
});