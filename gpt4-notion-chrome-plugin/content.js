chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { apiKey, parentPageId } = request;
  console.log(apiKey, parentPageId);

  function createNotionPage(content) {
    chrome.runtime.sendMessage(
      { apiKey, parentPageId, content },
      (response) => {
        if (response.success) {
          console.log(response.data)
          console.log("Notion page created successfully");
        } else {
          console.error("Error creating Notion page");
        }
      }
    );
  }

  function extractConversation() {
    const userMessages = Array.from(
      document.querySelectorAll(
        '.chat-message-role-text[text="user"] + div textarea'
      )
    ).map((element) => "User: " + element.value.trim());

    const assistantMessages = Array.from(
      document.querySelectorAll(
        '.chat-message-role-text[text="assistant"] + div textarea'
      )
    ).map((element) => "Assistant: " + element.value.trim());

    const conversation = userMessages
      .map((userMessage, index) => [userMessage, assistantMessages[index]])
      .flat()
      .filter((message) => message)
      .join("\n\n");

    return conversation;
  }

  const content = extractConversation();
  createNotionPage(content);
});
