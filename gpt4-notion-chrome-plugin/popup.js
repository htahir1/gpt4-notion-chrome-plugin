document.getElementById('createPage').addEventListener('click', () => {
    const apiKey = document.getElementById('apiKey').value;
    const parentPageId = document.getElementById('parentPageId').value;
  
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { apiKey, parentPageId });
    });
  
    window.close();
  });