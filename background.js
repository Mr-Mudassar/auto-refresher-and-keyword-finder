let targetTabId = null;
let targetUrl = null;
let refreshIntervalId = null;

chrome.storage.local.get('targetUrl', (data) => {
  targetUrl = data.targetUrl;
});

function startRefreshing() {
  if (targetUrl) {
    refreshIntervalId = setInterval(() => {
      chrome.tabs.query({ url: targetUrl }, (tabs) => {
        if (tabs.length > 0) {
          targetTabId = tabs[0].id;
          chrome.scripting.executeScript({
            target: { tabId: targetTabId },
            function: checkKeyword
          });
        }
      });
    }, 3000); // Refresh every 3 seconds
  }
}

function stopRefreshing() {
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId);
    refreshIntervalId = null;
  }
}

function checkKeyword() {
  const keyword = 'open now';
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    chrome.tabs.executeScript(currentTab.id, {
      code: `
        const keyword = 'open now';
        if (document.body.innerText.includes(keyword)) {
          chrome.runtime.sendMessage({ action: 'keywordFound' });
        }
      `
    });
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'start') {
    startRefreshing();
  } else if (request.action === 'stop') {
    stopRefreshing();
  } else if (request.action === 'keywordFound') {
    const predefinedUrl = 'https://youtube.com/shorts/XnPOYxLtwGw?si=QAebyXcfSxW99VL6';
    chrome.tabs.create({ url: predefinedUrl });
    stopRefreshing(); // Stop refreshing if keyword is found
  }
});
