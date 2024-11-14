class DomainListManager {
  constructor() {
    this.domainList = [];
    this.lastFetch = 0;
    this.cacheValidityDuration = 60 * 60 * 1000;
    this.listUrl = 'https://raw.githubusercontent.com/ramonm/ditchred/main/domains.json';
  }

  async getDomainList(forceRefresh = false) {
    if (forceRefresh || this.shouldRefreshCache()) {
      try {
        const response = await fetch(this.listUrl, {
          cache: 'no-store',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (!data || !data.domains) throw new Error('Invalid data format');
        
        this.domainList = data.domains;
        this.lastFetch = Date.now();
      } catch (error) {
        if (this.domainList.length === 0) this.domainList = [];
        throw error;
      }
    }
    return this.domainList;
  }

  shouldRefreshCache() {
    return Date.now() - this.lastFetch > this.cacheValidityDuration;
  }

  getLastUpdateTime() {
    return this.lastFetch;
  }

  getDomainCount() {
    return this.domainList.length;
  }
}

const domainListManager = new DomainListManager();