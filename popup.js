// Get the current tab's URL and check the domain
chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
  const url = tabs[0].url;
  const domain = extractDomain(url);
  const messageDiv = document.getElementById('message');
  
  if (isDomainInList(domain)) {
    messageDiv.textContent = `${domain} is on the boycott list`;
  } else {
    messageDiv.style.display = 'none';
  }
});

// Function to extract domain from URL
function extractDomain(url) {
  try {
    const urlObject = new URL(url);
    return urlObject.hostname.toLowerCase();
  } catch (e) {
    return null;
  }
}

// List of domains to check
const domainList = [
  'example.com',
  'google.com',
  'github.com'
  // Add more domains as needed
];

// Check if domain is in the list
function isDomainInList(domain) {
  return domainList.includes(domain);
}