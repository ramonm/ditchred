importScripts('shared.js');

function extractDomain(url) {
  try {
    const urlObject = new URL(url);
    return urlObject.hostname.toLowerCase().replace('www.', '');
  } catch (e) {
    return null;
  }
}

async function isDomainInList(domain) {
  const domainList = await domainListManager.getDomainList();
  return domainList.includes(domain);
}

async function updateIcon(tabId, url) {
  const domain = extractDomain(url);
  if (domain) {
    const isListed = await isDomainInList(domain);
    await chrome.action.setIcon({
      path: {
        "16": `/images/icon-${isListed ? 'active' : 'inactive'}16.png`,
        "48": `/images/icon-${isListed ? 'active' : 'inactive'}48.png`,
        "128": `/images/icon-${isListed ? 'active' : 'inactive'}128.png`
      },
      tabId: tabId
    });
  }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    updateIcon(tabId, tab.url);
  }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  if (tab.url) {
    updateIcon(activeInfo.tabId, tab.url);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'listUpdated') {
    chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
      if (tabs[0]) {
        await updateIcon(tabs[0].id, tabs[0].url);
      }
    });
  }
});