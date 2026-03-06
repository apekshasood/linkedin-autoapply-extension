document.getElementById("start").addEventListener("click", async () => {
  console.log('popup start button clicked');
  // send message to active tab's content script
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.id) return;

  chrome.tabs.sendMessage(tab.id, { action: 'startAutoApply' }, response => {
    console.log('content script response', response);
  });
});