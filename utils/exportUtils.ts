
import { ChatMessage, GroundingChunk } from '../types';

const formatDate = (date: Date): string => {
  return date.toLocaleString();
};

const formatGroundingChunks = (chunks: GroundingChunk[]): string => {
  if (!chunks || chunks.length === 0) return "";
  let markdown = "\n**Sources:**\n";
  chunks.forEach(chunk => {
    const source = chunk.web || chunk.retrievedContext;
    if (source && source.uri) {
      markdown += `- [${source.title || source.uri}](${source.uri})\n`;
    }
  });
  return markdown;
};

export const formatChatToMarkdown = (chatHistory: ChatMessage[]): string => {
  if (!chatHistory || chatHistory.length === 0) return "No chat history to export.";

  const header = `# Chat Export - ${formatDate(new Date())}\n\n`;
  
  const body = chatHistory.map(msg => {
    let messageMarkdown = `**${msg.role === 'user' ? 'User' : 'Model'} (${formatDate(msg.timestamp)}):**\n`;
    messageMarkdown += `${msg.text.replace(/\n/g, '\n\n')}\n`; // Ensure newlines in message are paragraphs
    if (msg.role === 'model' && msg.groundingChunks) {
      messageMarkdown += formatGroundingChunks(msg.groundingChunks);
    }
    if (msg.error) {
        messageMarkdown += `\n*[Error: ${msg.error}]*\n`
    }
    return messageMarkdown;
  }).join("\n---\n\n"); // Separator between messages

  return header + body;
};

export const formatChatToJson = (chatHistory: ChatMessage[]): string => {
  return JSON.stringify(chatHistory, null, 2);
};
