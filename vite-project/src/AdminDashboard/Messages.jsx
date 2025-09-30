import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./dashboard.css";

export default function MessagesPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Alice Mutesi",
      type: "Seller",
      subject: "Issue with shop approval",
      content: "Hello admin, my shop approval seems delayed. Could you check?",
      date: "2025-09-05",
      status: "Unread",
      reply: ""
    },
    {
      id: 2,
      sender: "John Doe",
      type: "Customer",
      subject: "Problem with order",
      content: "I placed an order but it hasn’t arrived yet.",
      date: "2025-09-07",
      status: "Read",
      reply: ""
    },
    {
      id: 3,
      sender: "Brian Uwimana",
      type: "Seller",
      subject: "Payment issue",
      content: "I have not received payment for my last sales.",
      date: "2025-09-08",
      status: "Replied",
      reply: "Hello Brian, we checked and your payment is being processed."
    }
  ]);

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Open modal + mark Unread → Read
  const handleReply = (message) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === message.id && msg.status === "Unread"
          ? { ...msg, status: "Read" }
          : msg
      )
    );
    setSelectedMessage(message);
    setReplyText("");
    setShowModal(true);
  };

  // Send reply
  const sendReply = () => {
    if (!replyText.trim()) return;

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === selectedMessage.id
          ? { ...msg, reply: replyText, status: "Replied" }
          : msg
      )
    );
    toast.success("Reply sent successfully ✅");
    setShowModal(false);
    setReplyText("");
    setSelectedMessage(null);
  };

  // Show reply in toast + mark Unread → Read
  const viewReply = (message) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === message.id && msg.status === "Unread"
          ? { ...msg, status: "Read" }
          : msg
      )
    );

    toast.info(`Reply: ${message.reply}`, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header-row">
        <h2>Messages</h2>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Sender</th>
            <th>Type</th>
            <th>Subject</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((msg) => (
            <tr key={msg.id}>
              <td>{msg.sender}</td>
              <td>{msg.type}</td>
              <td>{msg.subject}</td>
              <td>{msg.date}</td>
              <td>
                <span className={`status-badge ${msg.status.toLowerCase()}`}>
                  {msg.status}
                </span>
              </td>
              <td>
                {msg.status !== "Replied" ? (
                  <button
                    className="reply-btn"
                    onClick={() => handleReply(msg)}
                  >
                    Reply
                  </button>
                ) : (
                  <button
                    className="view-reply-btn"
                    onClick={() => viewReply(msg)}
                  >
                    View Reply
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Reply to {selectedMessage?.sender}</h3>
            <p>
              <strong>Message:</strong> {selectedMessage?.content}
            </p>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply here..."
              className="reply-textarea"
            />
            <div className="modal-actions">
              <button onClick={sendReply} className="send-btn">
                Send Reply
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}
