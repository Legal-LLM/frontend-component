import { Bot, User, AlertCircle } from "lucide-react";

const ChatMessage = ({ message }) => {
  const { text, isBot, timestamp, isError } = message;

  const formatTime = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div
      className={`flex ${
        isBot ? "justify-start" : "justify-end"
      } animate-fade-in`}
    >
      <div
        className={`flex max-w-xs lg:max-w-md xl:max-w-lg ${
          isBot ? "flex-row" : "flex-row-reverse"
        } items-end space-x-2`}
      >
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-8 h-8 ml-2 rounded-full flex items-center justify-center ${
            isBot
              ? isError
                ? "bg-red-100"
                : "bg-gradient-to-r from-blue-500 to-purple-600"
              : "bg-gradient-to-r from-green-500 to-blue-500"
          }`}
        >
          {isBot ? (
            isError ? (
              <AlertCircle className="w-4 h-4 text-red-600" />
            ) : (
              <Bot className="w-4 h-4 text-white" />
            )
          ) : (
            <User className="w-4 h-4 text-white" />
          )}
        </div>

        {/* Message Bubble */}
        <div
          className={`px-4 py-3 rounded-2xl shadow-sm ${
            isBot
              ? isError
                ? "bg-red-50 border border-red-200"
                : "bg-white border border-gray-100"
              : "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
          } ${isBot ? "rounded-bl-sm" : "rounded-br-sm"}`}
        >
          <p
            className={`text-sm leading-relaxed ${
              isBot
                ? isError
                  ? "text-red-800"
                  : "text-gray-800"
                : "text-white"
            }`}
          >
            {text}
          </p>
          <p
            className={`text-xs mt-1 ${
              isBot
                ? isError
                  ? "text-red-600"
                  : "text-gray-500"
                : "text-blue-100"
            }`}
          >
            {formatTime(timestamp)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
