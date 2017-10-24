var name,tweets,following,followers,lists,likes,moments,user_name,bio,location_data,joinDate,verified_account_data,birthDatetext,profile_image_url;

function Check_user_twitter_data (current_profile_data) {
	chrome.storage.sync.get("profile_data_pack", function(items) {

	    if (!chrome.runtime.error) {
	    	if(items.profile_data_pack!=null)
	      	{
				console.log('User Data Found');
				//check for current user details and perform identity clone attack here
				accuracy=Is_identity_clone_attack(current_profile_data,JSON.parse(items.profile_data_pack));
				if(accuracy==-1)
				{
					//This is real profile
					document.getElementById('warn_txt').innerHTML="Your Saved Profile";
					document.getElementById('warn_txt').style.color = "cornflowerblue";
					document.getElementById('warn_txt').style.display="block";
					document.getElementById("analyse_btn").style.display="none";
				}else{
					
					document.getElementById("analyse_btn").style.display="block";
				}
	      	}else {
	      		document.getElementById("step_1").innerHTML="Step-1 : Save Your profile for detecting Identity Clone attack";
	      		document.getElementById("step_1").style.padding = '2%';
	      		document.getElementById("step_1").style.fontWeight = 900;
	      		document.getElementById("update_btn").style.display="block";
	      		document.getElementById('warn_txt').style.display = 'none';
	      		console.log('User Data not Found');
	      	}
	    }else{
	      console.log("Chrome Runtime Error");	
	    }
	  });
}

function Is_identity_clone_attack (current_profile_data,profile_data) {
	 total_pts=14;
	 real_pts=0;

	 //if user_name is same it is not identity clone attack
	 if(current_profile_data.username==profile_data.username)
	 	return -1;

	 if(current_profile_data.name==profile_data.name)
	 	real_pts++;
	 if(Math.abs(current_profile_data.tweets-profile_data.tweets)<10)
	 	real_pts++;
	 if(Math.abs(current_profile_data.following-profile_data.following)<10)
	 	real_pts++;
	 if(Math.abs(current_profile_data.followers-profile_data.followers)<10)
	 	real_pts++;
	 if(Math.abs(current_profile_data.lists-profile_data.lists)<10)
	 	real_pts++;
	 if(Math.abs(current_profile_data.likes-profile_data.likes)<10)
	 	real_pts++;
	 if(Math.abs(current_profile_data.moments-profile_data.moments)<10)
		real_pts++;
	 if(Math.abs(current_profile_data.bio.length-profile_data.bio.length)<10)
	 	real_pts++;
	 if(current_profile_data.verified_account_data==profile_data.verified_account_data)
	 	real_pts++;

	 console.log("Identity = "+real_pts);
	 return real_pts;
}

document.getElementById("update_btn").addEventListener("click",function(){
	
	  chrome.storage.sync.set({"profile_data_pack":JSON.stringify(profile_data_pack)}, function() {
	    if (chrome.runtime.error) {
	      console.log("Runtime error.");
	    }else{
	    	console.log('Saved Data');
	    	document.getElementById("step_1").style.display = 'none';
	    	document.getElementById("update_btn").style.display="none";
	    	document.getElementById("analyse_btn").style.display="none";
	    	document.getElementById('warn_txt').style.display = 'block';
	    	document.getElementById('warn_txt').innerHTML="Your Saved Profile";
	    	document.getElementById('warn_txt').style.color = "cornflowerblue";	
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
			Check_user_twitter_data(profile_data_pack);
		});
    }else{
    	document.body.innerHTML="<h5 style='padding: 5%;color: cornflowerblue;'>Only For Twitter Folks<h5>";
    }
});