// List of domains to check (add your domains here)
const domainList = [
    'example.com',
    'google.com',
    'github.com'
    // Add more domains as needed
  ];
  
  // Function to extract domain from URL
  function extractDomain(url) {
    try {
      const urlObject = new URL(url);
      return urlObject.hostname.toLowerCase();
    } catch (e) {
      return null;
    }
  }
  
  // Check if domain is in the list
  function isDomainInList(domain) {
    return domainList.includes(domain);
  }
  
  // Listen for tab updates
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
      const domain = extractDomain(tab.url);
      
      if (domain && isDomainInList(domain)) {
        // Change to active icon
        chrome.action.setIcon({
          path: {
            "16": "images/icon-active16.png",
            "48": "images/icon-active48.png",
            "128": "images/icon-active128.png"
          },
          tabId: tabId
        });
      } else {
        // Change to inactive icon
        chrome.action.setIcon({
          path: {
            "16": "images/icon-inactive16.png",
            "48": "images/icon-inactive48.png",
            "128": "images/icon-inactive128.png"
          },
          tabId: tabId
        });
      }
    }
  });
  
  // Listen for tab activation (when user switches tabs)
  chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    const domain = extractDomain(tab.url);
    
    if (domain && isDomainInList(domain)) {
      // Change to active icon
      chrome.action.setIcon({
        path: {
          "16": "images/icon-active16.png",
          "48": "images/icon-active48.png",
          "128": "images/icon-active128.png"
        },
        tabId: activeInfo.tabId
      });
    } else {
      // Change to inactive icon
      chrome.action.setIcon({
        path: {
          "16": "images/icon-inactive16.png",
          "48": "images/icon-inactive48.png",
          "128": "images/icon-inactive128.png"
        },
        tabId: activeInfo.tabId
      });
    }
  });