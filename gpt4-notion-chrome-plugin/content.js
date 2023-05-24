chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const { apiKey, parentPageId } = request;
    console.log(apiKey, parentPageId);

    function createNotionPage(content) {
        const headers = {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        };
      
        const body = {
          'parent': { 'page_id': parentPageId },
          'properties': {
            'title': { 'title': [{ 'text': { 'content': document.title } }] }
          },
          'children': content.split('\n\n').map((line) => ({
            'object': 'block',
            'type': 'paragraph',
            'paragraph': {
              'text': [{ 'type': 'text', 'text': { 'content': line } }]
            }
          }))
        };
      
        fetch('https://api.notion.com/v1/pages', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(body)
        })
        .then(response => response.json())
        .then(data => console.log('Notion page created:', data))
        .catch(error => console.error('Error creating Notion page:', error));
      }

    function extractConversation() {
        const userMessages = Array.from(
            document.querySelectorAll('.chat-message-role-text[text="user"] + div textarea')
        ).map((element) => 'User: ' + element.value.trim());

        const assistantMessages = Array.from(
            document.querySelectorAll('.chat-message-role-text[text="assistant"] + div textarea')
        ).map((element) => 'Assistant: ' + element.value.trim());

        const conversation = userMessages
            .map((userMessage, index) => [userMessage, assistantMessages[index]])
            .flat()
            .filter((message) => message)
            .join('\n\n');

        return conversation;
    }

    const content = extractConversation();
    createNotionPage(content);
});