function checkKeyword() {
    const keyword = 'open now';
    if (document.body.innerText.includes(keyword)) {
      chrome.runtime.sendMessage({ action: 'keywordFound' });
    } else {
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
}

checkKeyword();
