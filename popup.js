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

// Get the current tab's URL and check the domain
chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
  const url = tabs[0].url;
  const domain = extractDomain(url);
  const messageDiv = document.getElementById('message');
  
  if (domain && await isDomainInList(domain)) {
    messageDiv.textContent = `${domain} is on the boycott list`;
  } else {
    messageDiv.style.display = 'none';
  }
});