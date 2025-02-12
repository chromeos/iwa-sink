console.log("IWA Kitchen Sink Extension");
console.log("Extension id:", chrome.runtime.id);

const STATUS_OK = "OK";
const STATUS_ERROR = "Error";

const REQUEST_VERSION_CHECK = "version";

// Process messages from the IWA
chrome.runtime.onMessageExternal.addListener(mainExternalMessageListener);

console.log("Extension started.");

async function mainExternalMessageListener(request, sender, sendResponse) {
  console.log("Message from external app received.");
  console.log("Sender ID:", sender.id,
              "URL:", sender.url, 
              "Origin:", sender.origin);
  console.log("Request:", JSON.stringify(request));
  
  // Reply to "extension enabled" check
  if (request === REQUEST_VERSION_CHECK) {
    return processVersionCheck(sendResponse);
  }
  
  // chrome.identity.getProfileUserInfo
  if (request.api === "chrome.identity.getProfileUserInfo") {
    return await getProfileUserInfo(sendResponse);
  }

  return processUnknownRequest(sendResponse);
}

function processVersionCheck(sendResponse) {
  console.log("Process version check");
  const manifest = chrome.runtime.getManifest();
  sendResponse({
    status: STATUS_OK,
    version: manifest.version,
    // note: VERSION_NOTE
  });
  return true;
}

function createApiResponse(apiName, status, output) {
  let result = {
    apiName: apiName,
    status: status,
    output: output
  };
  return result;
}

function processUnknownRequest(sendResponse) {
  console.log("Process unknown request");
  sendResponse({
    status: STATUS_ERROR,
    message: "Unknown request"
  });
  return true;
}

//
// chrome.identity.getProfileUserInfo()
async function getProfileUserInfo(sendResponse) {
  const userProfileInfo = await chrome.identity.getProfileUserInfo();
  console.log("Calling chrome.identity.getProfileUserInfo():", JSON.stringify(userProfileInfo));
  sendResponse(createApiResponse("chrome.identity.getProfileUserInfo", STATUS_OK, JSON.stringify(userProfileInfo)));
  return true;
}
