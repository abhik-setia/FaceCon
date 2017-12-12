var name,tweets,following,followers,lists,likes,user_name,bio,location_data,joinDate,verified_account_data,birthDatetext,profile_image_url;

function refreshPage(){
    window.location.reload();
} 

function Check_user_twitter_data (current_profile_data) {
	chrome.storage.sync.get("profile_data_pack", function(items) {

	    if (!chrome.runtime.error) {
	    	if(items.profile_data_pack!=null)
	      	{
				console.log('User Data Found');
				//check for current user details and perform identity clone attack check here
				accuracy=Is_identity_clone_attack(current_profile_data,JSON.parse(items.profile_data_pack));
				if(accuracy==-1)
				{
					//This is real profile
					document.getElementById('warn_txt').innerHTML="Your Saved Profile";
					document.getElementById('warn_txt').style.color = "cornflowerblue";
					document.getElementById('warn_txt').style.display="block";
					document.getElementById("analyse_btn").style.display="none";
					document.getElementById("remove_btn").style.display="block";
					
				}else{
					//chances of identity clone attack
					if(accuracy!=0){
						console.log('Attack');
						document.getElementById('warn_txt').style.display="block";
						document.getElementById('warn_txt').innerHTML="Identity Clone Attack <br>chances : "+Math.round(accuracy*100) +"%";
						document.getElementById('warn_txt').style.borderColor="red";
					
					}
					document.getElementById("analyse_btn").style.display="block";
					
				}
	      	}else {
	      		//save profile data first
	      		document.getElementById("step_1").innerHTML="Step-1 : Save Your profile for detecting Identity Clone attack";
	      		document.getElementById("step_1").style.padding = '2%';
	      		document.getElementById("step_1").style.fontWeight = 900;
	      		document.getElementById("update_btn").style.display="block";
	      		document.getElementById('warn_txt').style.display = 'none';
	      		console.log('User Data not Found');
	      	}
	    }else{
	      console.log('Chrome Runtime Error : '+chrome.runtime.error);
	    }
	  });
}

function Is_identity_clone_attack (current_profile_data,profile_data) {
	 total_pts=7;
	 real_pts=0;

	 //if user_name is same it is not identity clone attack
	 if(current_profile_data.username==profile_data.username)
	 	return -1;

	 //if the current account is verified no need to check further
	 if(current_profile_data.verified_account=="Verified account")
	 {
	 	return 0;	
	 }

	 if(current_profile_data.name==profile_data.name)
	 {
	 	real_pts++;
	 }
	 if(Math.abs(current_profile_data.tweets-profile_data.tweets)<10)
	 {
	 	real_pts++;
	 }if(Math.abs(current_profile_data.following-profile_data.following)<10)
	 {
	 	real_pts++;
	 }if(Math.abs(current_profile_data.followers-profile_data.followers)<10)
	 {
	 	real_pts++;
	 }if(Math.abs(current_profile_data.likes-profile_data.likes)<10)
	 {
	 	real_pts++;
	 }if(Math.abs(current_profile_data.bio.length-profile_data.bio.length)<10)
	 {
	 	real_pts++;
	 }if(current_profile_data.location==profile_data.location)
	 {
	 	real_pts++;
	 }
	 console.log("Identity points = "+real_pts);
	 return real_pts/total_pts;
}

document.getElementById("analyse_btn").addEventListener("click",function(){
	console.log('Analysing');
	function sendRequest(){

			// Cancel the form submit
    		event.preventDefault();

	        // Set up an asynchronous AJAX POST request
	        var hr = new XMLHttpRequest();
	        var url = "http://127.0.0.1:5000/fakeprof";
	        
	        hr.open("POST", url, true);
	        
	        var params = "name="+profile_data_pack.name+
	        			"&tweets="+profile_data_pack.tweets+
	        			"&following="+profile_data_pack.following+
	        			"&followers="+profile_data_pack.followers+
	        			"&lists="+profile_data_pack.lists+
	        			"&likes="+profile_data_pack.likes+
	        			"&username="+profile_data_pack.username+
	        			"&bio="+profile_data_pack.bio+
	        			"&location="+profile_data_pack.location+
	        			"&join_date="+profile_data_pack.join_date+
	        			"&verified_account="+profile_data_pack.verified_account+
	        			"&birth_date="+profile_data_pack.birth_date+
	        			"&profile_image_bk_url="+profile_data_pack.profile_image_bk_url+
	        			"&profile_image_url="+profile_data_pack.profile_image_url;
	    
	        // Set correct header for form data 
		    hr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			
	        // Handle request state change events
	        hr.onreadystatechange = function() { 
	                // If the request completed
	            if (hr.readyState == 4) {
	                if (hr.status == 200) {
	                    // success
	                    resp=JSON.parse(hr.responseText);
	                    
	                    probability=resp.probability;
	                    profile_type=resp.profile_type;

	                    console.log(' probability : '+ probability +' profile_type : ' + profile_type);
	                    document.getElementById('form-group-div').style.display='none';
	                    
	                    document.getElementById('form-group-div-result').style.display='block';
	                    document.getElementById('analyse_btn').style.display='none';

	                   document.getElementById('profile_type_bk').innerHTML=profile_type;

	                } else {
	                    // Show what went wrong
	                    console.log('Something went wrong')
	                }
	            }
	        };       			
	        hr.send(params);
	    }
	sendRequest();    
});

document.getElementById("update_btn").addEventListener("click",function(){
	  chrome.storage.sync.set({"profile_data_pack":JSON.stringify(profile_data_pack)}, function() {
	    if (chrome.runtime.error) {
	      console.log('Chrome Runtime Error : '+chrome.runtime.error);
	    }else{
	    	console.log('Saved Data');
	    	document.getElementById("step_1").style.display = 'none';
	    	document.getElementById("update_btn").style.display="none";
	    	document.getElementById("remove_btn").style.display="block";
	    	document.getElementById("analyse_btn").style.display="none";
	    	document.getElementById('warn_txt').style.display = 'block';
	    	document.getElementById('warn_txt').innerHTML="Your Saved Profile";
	    	document.getElementById('warn_txt').style.color = "cornflowerblue";	
	    }
	  });
});

document.getElementById("feedback_btn").addEventListener("click",function () {
	document.getElementById("feedback_btn_col").style.display = 'block';
});

document.getElementById("feedback_btn_fake").addEventListener("click",function () {
	document.getElementById("feedback_btn_col").style.display = 'none';
	document.getElementById("feedback_btn").style.display = 'none';
	document.getElementById("res_txt").style.display = 'block';
	sendFeedback(1);
});

document.getElementById("feedback_btn_legitimate").addEventListener("click",function () {
	document.getElementById("feedback_btn_col").style.display = 'none';
	document.getElementById("feedback_btn").style.display = 'none';
	document.getElementById("res_txt").style.display = 'block';
	sendFeedback(0);
});

function sendFeedback(profile_type){

			// Cancel the form submit
    		event.preventDefault();

	        // Set up an asynchronous AJAX POST request
	        var hr = new XMLHttpRequest();
	        var url = "http://127.0.0.1:5000/feedback";
	        
	        hr.open("POST", url, true);
	        
	        var params = "name="+profile_data_pack.name+
	        			"&tweets="+profile_data_pack.tweets+
	        			"&following="+profile_data_pack.following+
	        			"&followers="+profile_data_pack.followers+
	        			"&lists="+profile_data_pack.lists+
	        			"&likes="+profile_data_pack.likes+
	        			"&username="+profile_data_pack.username+
	        			"&bio="+profile_data_pack.bio+
	        			"&location="+profile_data_pack.location+
	        			"&join_date="+profile_data_pack.join_date+
	        			"&verified_account="+profile_data_pack.verified_account+
	        			"&birth_date="+profile_data_pack.birth_date+
	        			"&profile_image_bk_url="+profile_data_pack.profile_image_bk_url+
	        			"&profile_image_url="+profile_data_pack.profile_image_url+
	        			"&profile_type="+profile_type;
	    	    console.log('Response Sent with params '+params );
	                
	        // Set correct header for form data 
		    hr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			
	        // Handle request state change events
	        hr.onreadystatechange = function() { 
	                // If the request completed
	            if (hr.readyState == 4) {
	                if (hr.status == 200) {
	                    // success
	                    resp=JSON.parse(hr.responseText);
	                    console.log('Response Sent with params '+params );
	                } else {
	                    // Show what went wrong
	                    console.log('Something went wrong')
	                }
	            }
	        }; 			
	        hr.send(params);
}


document.getElementById("remove_btn").addEventListener("click",function(){
	chrome.storage.sync.remove("profile_data_pack", function(items) {

	    if (!chrome.runtime.error) {
	    	console.log(' Removed saved profile');
	    	refreshPage();
	    }else{
	    	console.log('Chrome Runtime Error : '+chrome.runtime.error);
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
	    	console.log(data);
	    	document.getElementById("before_txt").style.display="none";
	        document.getElementById("form_section").style.display="block";	
	    	profile_data_pack=JSON.parse(data);
			document.getElementById("Name_bk").innerHTML=profile_data_pack.name;
			document.getElementById("Tweets_bk").innerHTML=profile_data_pack.tweets;
			document.getElementById("Following_bk").innerHTML=profile_data_pack.following;
			document.getElementById("Followers_bk").innerHTML=profile_data_pack.followers;
			document.getElementById("Likes_bk").innerHTML=profile_data_pack.likes;
			document.getElementById("Lists_bk").innerHTML=profile_data_pack.lists;
			document.getElementById("profile_pic").src=profile_data_pack.profile_image_url;
			Check_user_twitter_data(profile_data_pack);
		});
    }else{
    	document.body.innerHTML="<h5 style='padding: 5%;color: cornflowerblue;'>Only For Twitter Folks<h5>";
    }
});