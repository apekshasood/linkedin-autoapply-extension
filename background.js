// background.js
// Service worker for handling extension-wide logic

chrome.runtime.onInstalled.addListener(() => {
    console.log('LinkedIn Auto Apply installed');
});

// example listener to receive messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'apply') {
        // implement applying logic or forward to content script
        console.log('Apply requested', message);
    }
    sendResponse({status: 'received'});
});
