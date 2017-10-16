chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "get_links"});
  });
});

chrome.runtime.onMessage.addListener(
  function(response, sender, sendResponse) {
  	alert(response)
  });


