function extractDomain(url) {
  try {
    const urlObject = new URL(url);
    return urlObject.hostname.toLowerCase().replace('www.', '');
  } catch (e) {
    return null;
  }
}

function formatLastUpdated(timestamp) {
  if (!timestamp) return 'Never';
  const date = new Date(timestamp);
  const now = new Date();
  const diffMinutes = Math.floor((now - date) / 60000);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleDateString(undefined, options);
}

async function updatePopupInfo() {
  const countElement = document.getElementById('domainCount');
  const lastUpdateElement = document.getElementById('lastUpdate');
  
  countElement.textContent = domainListManager.getDomainCount();
  lastUpdateElement.textContent = formatLastUpdated(domainListManager.getLastUpdateTime());
}

async function refreshList() {
  const refreshButton = document.getElementById('refreshButton');
  refreshButton.disabled = true;
  
  try {
    await domainListManager.getDomainList(true); // Force refresh
    await checkCurrentDomain();
    await updatePopupInfo();
    
    // Notify background script that list has been updated
    chrome.runtime.sendMessage({ action: 'listUpdated' });
  } catch (error) {
    console.error('Error refreshing list:', error);
  } finally {
    refreshButton.disabled = false;
  }
}

async function checkCurrentDomain() {
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  const domain = extractDomain(tab.url);
  const messageDiv = document.getElementById('message');
  
  if (domain) {
    const domainList = await domainListManager.getDomainList();
    const isListed = domainList.includes(domain);
    
    if (isListed) {
      messageDiv.textContent = `${domain} is on the boycott list`;
      messageDiv.style.display = 'block';
    } else {
      messageDiv.style.display = 'none';
    }
  }
}

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('refreshButton').addEventListener('click', refreshList);
  await checkCurrentDomain();
  await updatePopupInfo();
});