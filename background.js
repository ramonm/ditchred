// Import shared.js using importScripts
importScripts('shared.js');

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
async function isDomainInList(domain) {
  const domainList = await domainListManager.getDomainList();
  return domainList.includes(domain);
}

// Update icon based on domain status
async function updateIcon(tabId, url) {
  const domain = extractDomain(url);
  
  if (domain && await isDomainInList(domain)) {
    chrome.action.setIcon({
      path: {
        "16": "images/icon-active16.png",
        "48": "images/icon-active48.png",
        "128": "images/icon-active128.png"
      },
      tabId: tabId
    });
  } else {
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

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    updateIcon(tabId, tab.url);
  }
});

// Listen for tab activation
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab.url) {
    updateIcon(activeInfo.tabId, tab.url);
  }
});