var name,tweets,following,followers,lists,likes,moments,user_name,bio,location_data,joinDate,verified_account_data,birthDatetext,profile_image_url;

function Check_user_twitter_data () {
	chrome.storage.sync.get("profile_data_pack", function(items) {

	    if (!chrome.runtime.error) {
	    	if(items.profile_data_pack!=null)
	      	{
				console.log('User Data Found');
				document.getElementById("analyse_btn").style.display="block";
	      	}else {
	      		document.getElementById("step_1").innerHTML="Step-1 : Save Your profile for detecting Identity Clone attack";
	      		document.getElementById("step_1").style.padding = '2%';
	      		document.getElementById("step_1").style.fontWeight = 900;
	      		document.getElementById("update_btn").style.display="block";
	      		console.log('User Data not Found');
	      	}
	    }else{
	      console.log("Chrome Runtime Error");	
	    }
	  });
}

document.getElementById("update_btn").addEventListener("click",function(){
	
	  chrome.storage.sync.set({"profile_data_pack":JSON.stringify(profile_data_pack)}, function() {
	    if (chrome.runtime.error) {
	      console.log("Runtime error.");
	    }else{
	    	console.log('Saved Data');
	    	document.getElementById("step_1").style.display = 'none';
	    	document.getElementById("update_btn").style.display="none";
	    	document.getElementById("analyse_btn").style.display="block";	
	    }
	  });
});

var port = chrome.extension.connect({
    name: "FaceCon Network"
});
	    
chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    var curr_tab=tabs[0].url;
    var urlPattern=new RegExp("https://twitter.com/*");
    if(curr_tab.match(urlPattern)){
    	document.getElementById("form_section").style.display="none";
    	port.postMessage({ url:curr_tab,msg:'collect_data'});
	    port.onMessage.addListener(function(data) {
	    	document.getElementById("before_txt").style.display="none";
	        document.getElementById("form_section").style.display="block";	
	    	profile_data_pack=JSON.parse(data);
			document.getElementById("Name_bk").innerHTML=profile_data_pack.name;
			document.getElementById("Tweets_bk").innerHTML=profile_data_pack.tweets;
			document.getElementById("Following_bk").innerHTML=profile_data_pack.following;
			document.getElementById("Followers_bk").innerHTML=profile_data_pack.followers;
			document.getElementById("Likes_bk").innerHTML=profile_data_pack.likes;
			document.getElementById("Moments_bk").innerHTML=profile_data_pack.moments;
			document.getElementById("Lists_bk").innerHTML=profile_data_pack.lists;
			document.getElementById("profile_pic").src=profile_data_pack.profile_image_url;
			
			Check_user_twitter_data();

		});
    }else{
    	document.body.innerHTML="<h5 style='padding: 5%;color: cornflowerblue;'>Only For Twitter Folks<h5>";
    }
});