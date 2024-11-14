// Function to extract domain from URL
function extractDomain(url) {
  try {
    const urlObject = new URL(url);
    return urlObject.hostname.toLowerCase().replace('www.', '');
  } catch (e) {
    return null;
  }
}

// Format the last updated time
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

// Update the popup information
async function updatePopupInfo() {
  const countElement = document.getElementById('domainCount');
  const lastUpdateElement = document.getElementById('lastUpdate');
  
  if (countElement && lastUpdateElement) {
    countElement.textContent = domainListManager.getDomainCount().toString();
    lastUpdateElement.textContent = formatLastUpdated(domainListManager.getLastUpdateTime());
  }
}

// Handle list refresh
async function refreshList() {
  const refreshButton = document.getElementById('refreshButton');
  refreshButton.disabled = true;
  
  try {
    await domainListManager.getDomainList(true); // Force refresh
    await checkCurrentDomain();
    await updatePopupInfo();
    chrome.runtime.sendMessage({ action: 'listUpdated' });
  } catch (error) {
    console.error('Error refreshing list:', error);
  } finally {
    refreshButton.disabled = false;
  }
}

// Check current domain against the list
async function checkCurrentDomain() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const domain = extractDomain(tab.url);
    const messageDiv = document.getElementById('message');
    const detailsDiv = document.getElementById('details');

    if (domain) {
      const domainList = await domainListManager.getDomainList();
      const isListed = domainList.includes(domain);

      if (isListed) {
        messageDiv.textContent = `${domain} is on the boycott list`;
        messageDiv.style.display = 'block';
        detailsDiv.style.display = 'block';
      } else {
        messageDiv.style.display = 'none';
        detailsDiv.style.display = 'none';
      }
    }
  } catch (error) {
    console.error('Error checking domain:', error);
  }
}

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const refreshButton = document.getElementById('refreshButton');
    if (refreshButton) {
      refreshButton.addEventListener('click', refreshList);
    }
    
    await checkCurrentDomain();
    await updatePopupInfo();
  } catch (error) {
    console.error('Error initializing popup:', error);
  }
});