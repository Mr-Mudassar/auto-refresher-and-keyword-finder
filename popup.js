document.addEventListener('DOMContentLoaded', () => {
    let targetUrl = '';
  
    document.getElementById('setUrlButton').addEventListener('click', () => {
      targetUrl = document.getElementById('urlInput').value;
      chrome.storage.local.set({ targetUrl }, () => {
        console.log('Target URL set to:', targetUrl);
      });
    });
  
    document.getElementById('startButton').addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'start' });
      console.log('Auto-refresh started');
    });
  
    document.getElementById('stopButton').addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'stop' });
      console.log('Auto-refresh stopped');
    });
  });
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'keywordFound') {
      const predefinedUrl = 'https://youtube.com/shorts/XnPOYxLtwGw?si=QAebyXcfSxW99VL6';
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        chrome.tabs.update(currentTab.id, { url: predefinedUrl });
      });
    }
  });
  