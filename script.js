const form = document.querySelector("#webhook-form");
const eventNameInput = document.querySelector("#event-name");
const iftttKeyInput = document.querySelector("#ifttt-key");
const payloadUrlInput = document.querySelector("#payload-url");
const copyButton = document.querySelector("#copy-url");
const copyStatus = document.querySelector("#copy-status");
const sendTestButton = document.querySelector("#send-test");
const testStatus = document.querySelector("#test-status");

function cleanEventName(value) {
  return value.trim().replace(/\s+/g, "_");
}

function buildPayloadUrl() {
  const eventName = encodeURIComponent(cleanEventName(eventNameInput.value) || "github_push");
  const key = encodeURIComponent(iftttKeyInput.value.trim() || "YOUR_KEY");

  return `https://maker.ifttt.com/trigger/${eventName}/with/key/${key}`;
}

function updatePayloadUrl() {
  payloadUrlInput.value = buildPayloadUrl();
}

async function copyPayloadUrl() {
  updatePayloadUrl();

  try {
    await navigator.clipboard.writeText(payloadUrlInput.value);
    copyStatus.textContent = "Copied. Paste this into GitHub as the Payload URL.";
  } catch (error) {
    payloadUrlInput.select();
    copyStatus.textContent = "Select and copy the URL manually.";
  }
}

async function sendIftttTest() {
  updatePayloadUrl();
  testStatus.textContent = "Sending test request...";

  const testUrl = new URL(payloadUrlInput.value);
  testUrl.searchParams.set("value1", document.querySelector("#value-one").value);
  testUrl.searchParams.set("value2", document.querySelector("#value-two").value);
  testUrl.searchParams.set("value3", document.querySelector("#value-three").value);

  try {
    await fetch(testUrl, { mode: "no-cors" });

    testStatus.textContent = "Test sent. Check the IFTTT Applet activity log.";
  } catch (error) {
    testStatus.textContent = "Could not send the test. Check the event name and key.";
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  updatePayloadUrl();
  copyStatus.textContent = "URL generated.";
});

eventNameInput.addEventListener("input", updatePayloadUrl);
iftttKeyInput.addEventListener("input", updatePayloadUrl);
copyButton.addEventListener("click", copyPayloadUrl);
sendTestButton.addEventListener("click", sendIftttTest);
