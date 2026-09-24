import { useMemo, useState } from "react";

const quickPrompts = [
  "How do I add a transaction?",
  "How do I set a budget?",
  "What is analytics?",
  "How do I check my insights?",
];

const getReply = (input) => {
  const text = input.toLowerCase();

  if (text.includes("transaction") || text.includes("add")) {
    return "Go to Dashboard and click “+ Add Transaction”. Fill in the amount, category, and date, then save.";
  }

  if (text.includes("budget") || text.includes("spend")) {
    return "Open Budgets, choose a category, enter your monthly limit, and save the budget to track your spending.";
  }

  if (text.includes("analytics") || text.includes("report")) {
    return "Use the Analytics page to review expense trends and category-wise spending patterns.";
  }

  if (text.includes("insight") || text.includes("summary")) {
    return "Visit Insights to see personalized summaries about your financial habits and spending behavior.";
  }

  if (text.includes("login") || text.includes("logout")) {
    return "Use the login page to sign in. You can log out anytime from the top-right navigation button.";
  }

  if (text.includes("hello") || text.includes("hi")) {
    return "Hi! I can help with transactions, budgets, dashboard insights, and analytics.";
  }

  return "You can ask about adding transactions, setting budgets, checking analytics, or understanding your financial insights.";
};

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hi! I’m FinTrack Assistant. Ask me how to manage your finances.",
    },
  ]);
  const [input, setInput] = useState("");

  const canSend = useMemo(() => input.trim().length > 0, [input]);

  const sendMessage = (messageText) => {
    const text = messageText.trim();
    if (!text) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text,
    };

    const botMessage = {
      id: Date.now() + 1,
      sender: "bot",
      text: getReply(text),
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput("");
  };

  return (
    <div className="chat-widget">
      <button className="chat-toggle" onClick={() => setIsOpen((prev) => !prev)}>
        {isOpen ? "Close" : "Chat"}
      </button>

      {isOpen && (
        <div className="chat-panel">
          <div className="chat-header">
            <div>
              <strong>FinTrack Assistant</strong>
            </div>
            <button className="mini-close" onClick={() => setIsOpen(false)}>
              ×
            </button>
          </div>

          <div className="chat-body">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-message ${message.sender === "user" ? "user" : "bot"}`}
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="quick-prompts">
            {quickPrompts.map((prompt) => (
              <button key={prompt} className="quick-prompt" onClick={() => sendMessage(prompt)}>
                {prompt}
              </button>
            ))}
          </div>

          <div className="chat-input-row">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your money..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage(input);
                }
              }}
            />
            <button disabled={!canSend} onClick={() => sendMessage(input)}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatWidget;
