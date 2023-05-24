// chrome.browserAction.onClicked.addListener((tab) => {
//   chrome.tabs.executeScript(tab.id, { file: "content.js" });
// });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { apiKey, parentPageId, content } = request;

  const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "Notion-Version": "2022-05-13",
    "Access-Control-Allow-Origin": "*"
  };

  const body = {
    parent: { page_id: parentPageId },
    properties: {
      title: { title: [{ text: { content: "GPT Conversation" } }] },
    },
    children: content.split("\n\n").map((line) => ({
      object: "block",
      type: "paragraph",
      paragraph: {
        text: [{ type: "text", text: { content: line } }],
      },
    })),
  };

  
  fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: headers,
    mode: 'no-cors',
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error) { sendResponse({ success: false, data: data }); }
      else { sendResponse({ success: true, data: data });}
    })
    .catch((error) => {
      console.error("Error creating Notion page:", error);
      sendResponse({ success: false, data: error });
    });

  return true; // Required for async sendResponse
});
