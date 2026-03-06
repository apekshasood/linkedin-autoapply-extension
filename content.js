console.log('LinkedIn Auto Apply content script loaded');

let userData;

async function initUserData() {
  if (userData) return userData;
  try {
    const response = await fetch(chrome.runtime.getURL("userData.json"));
    userData = await response.json();
    return userData;
  } catch (err) {
    console.error('Could not load userData.json', err);
    throw err;
  }
}

async function startAutoApply() {
  let user;
  try {
    user = await initUserData();
  } catch (_err) {
    return;
  }

  const fillInputs = () => {
    document.querySelectorAll("input").forEach(input => {
      const label = input.labels?.[0]?.innerText?.toLowerCase() || "";
      const placeholder = input.placeholder?.toLowerCase() || "";

      if (label.includes("first") || placeholder.includes("first")) {
        input.value = user.firstName || '';
      }

      if (label.includes("last") || placeholder.includes("last")) {
        input.value = user.lastName || '';
      }

      if (label.includes("email")) {
        input.value = user.email || '';
      }

      if (label.includes("phone")) {
        input.value = user.phone || '';
      }

      if (label.includes("city")) {
        input.value = user.city || '';
      }
    });

    document.querySelectorAll("textarea").forEach(textarea => {
      const label = textarea.labels?.[0]?.innerText?.toLowerCase() || "";

      if (label.includes("experience")) {
        textarea.value = user.totalExperience || '';
      }
    });
  };

  const clickNext = () => {
    const buttons = document.querySelectorAll("button");

    buttons.forEach(btn => {
      const text = btn.innerText.toLowerCase();

      if (
        text.includes("next") ||
        text.includes("review") ||
        text.includes("submit")
      ) {
        btn.click();
      }
    });
  };

  setTimeout(() => {
    fillInputs();
    setTimeout(clickNext, 1500);
  }, 2000);

  // resume upload helper
  const uploadResume = async () => {
    try {
      const fileInput = document.querySelector('input[type="file"]');
      if (!fileInput) return;

      const response = await fetch(chrome.runtime.getURL(user.resumePath || "resume.pdf"));
      const blob = await response.blob();

      const fileName = user.resumePath ? user.resumePath.split('/').pop() : 'resume.pdf';
      const file = new File([blob], fileName, { type: "application/pdf" });

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInput.files = dataTransfer.files;
    } catch (err) {
      console.error('Failed to upload resume', err);
    }
  };

  setTimeout(uploadResume, 3000);
}

// automatically run when script loads
startAutoApply().catch(() => {});

// listen for messages from popup or background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startAutoApply') {
    console.log('received startAutoApply message');
    startAutoApply().then(() => sendResponse({status: 'started'}));
    return true; // indicate we will respond asynchronously
  }
});