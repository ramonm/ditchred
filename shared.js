class DomainListManager {
  constructor() {
    this.domainList = [];
    this.lastFetch = 0;
    this.cacheValidityDuration = 60 * 60 * 1000; // 1 hour in milliseconds
    this.listUrl = 'https://raw.githubusercontent.com/ramonm/ditchred/refs/heads/main/domains.json';
  }

  async getDomainList() {
    if (this.shouldRefreshCache()) {
      try {
        const response = await fetch(this.listUrl, {
          cache: 'no-store',
          headers: {
            'Accept': 'application/json'
          }
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        this.domainList = data.domains;
        this.lastFetch = Date.now();
      } catch (error) {
        console.error('Error fetching domain list:', error);
        // Use cached list if available, otherwise use empty list
        if (this.domainList.length === 0) {
          this.domainList = [];
        }
      }
    }
    return this.domainList;
  }

  shouldRefreshCache() {
    return Date.now() - this.lastFetch > this.cacheValidityDuration;
  }
}

const domainListManager = new DomainListManager();
