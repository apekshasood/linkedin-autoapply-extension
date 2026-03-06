(async function () {

  const response = await fetch(chrome.runtime.getURL("userData.json"));
  const user = await response.json();

  const fillInputs = () => {

    document.querySelectorAll("input").forEach(input => {

      const label = input.labels?.[0]?.innerText?.toLowerCase() || "";
      const placeholder = input.placeholder?.toLowerCase() || "";

      if (label.includes("first") || placeholder.includes("first")) {
        input.value = user.firstName;
      }

      if (label.includes("last") || placeholder.includes("last")) {
        input.value = user.lastName;
      }

      if (label.includes("email")) {
        input.value = user.email;
      }

      if (label.includes("phone")) {
        input.value = user.phone;
      }

      if (label.includes("city")) {
        input.value = user.city;
      }

    });

    document.querySelectorAll("textarea").forEach(textarea => {

      const label = textarea.labels?.[0]?.innerText?.toLowerCase() || "";

      if (label.includes("experience")) {
        textarea.value = user.totalExperience;
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

})();

const uploadResume = async () => {

  const fileInput = document.querySelector('input[type="file"]');

  if (!fileInput) return;

  const response = await fetch(chrome.runtime.getURL("resume.pdf"));
  const blob = await response.blob();

  const file = new File([blob], "resume.pdf", { type: "application/pdf" });

  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);

  fileInput.files = dataTransfer.files;

};

setTimeout(uploadResume, 3000);