import { Bot, User, AlertCircle, Clipboard } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const Time = ({ date }) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date instanceof Date ? date : new Date(date));

function CodeBlock({ inline, className, children, ...props }) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const code = String(children ?? "").replace(/\n$/, "");

  if (inline) {
    return (
      <code className="px-1 py-0.5 rounded bg-gray-100 text-gray-800 text-[0.9em]">
        {children}
      </code>
    );
  }

  const lang = match?.[1] ?? "text";
  return (
    <div className="relative group">
      <button
        onClick={() => {
          navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        }}
        className="absolute right-2 top-2 z-10 hidden group-hover:flex items-center gap-1
                   px-2 py-1 text-xs rounded bg-white/80 border border-gray-200 shadow-sm"
        title="Copy code"
      >
        <Clipboard className="w-3.5 h-3.5" />
        {copied ? "Copied" : "Copy"}
      </button>
      <SyntaxHighlighter
        language={lang}
        style={oneDark}
        PreTag="div"
        customStyle={{ margin: 0, borderRadius: "0.5rem" }}
        {...props}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

const Markdown = ({ children }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      h1: ({ children }) => (
        <h1 className="text-xl font-semibold mb-2">{children}</h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-lg font-semibold mb-2">{children}</h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-base font-semibold mb-2">{children}</h3>
      ),
      p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
      a: ({ href, children }) => (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline underline-offset-2"
        >
          {children}
        </a>
      ),
      ul: ({ children }) => (
        <ul className="list-disc ml-5 space-y-1 mb-3">{children}</ul>
      ),
      ol: ({ children }) => (
        <ol className="list-decimal ml-5 space-y-1 mb-3">{children}</ol>
      ),
      li: ({ children }) => <li className="leading-relaxed">{children}</li>,
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-gray-300 pl-3 italic text-gray-700 mb-3">
          {children}
        </blockquote>
      ),
      table: ({ children }) => (
        <div className="overflow-x-auto mb-3">
          <table className="w-full text-sm border border-gray-200 rounded-lg">
            {children}
          </table>
        </div>
      ),
      thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
      th: ({ children }) => (
        <th className="text-left px-3 py-2 border-b border-gray-200 font-semibold">
          {children}
        </th>
      ),
      td: ({ children }) => (
        <td className="px-3 py-2 border-b border-gray-100">{children}</td>
      ),
      code: CodeBlock,
      pre: ({ children }) => <pre className="mb-3">{children}</pre>,
      hr: () => <hr className="my-4 border-gray-200" />,
    }}
  >
    {children}
  </ReactMarkdown>
);

const ChatMessage = ({ message }) => {
  const { text, isBot, timestamp, isError } = message;

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
          <div
            className={`prose prose-sm max-w-none ${
              isBot
                ? isError
                  ? "text-red-800 prose-headings:text-red-800 prose-a:text-red-700"
                  : "text-gray-800 prose-headings:text-gray-900 prose-a:text-blue-600"
                : "text-white prose-headings:text-white prose-a:text-white"
            }`}
          >
            {/* Render Markdown for bot & user — safe because we don't allow raw HTML */}
            <Markdown>{text}</Markdown>
          </div>

          <p
            className={`text-xs mt-1 ${
              isBot
                ? isError
                  ? "text-red-600"
                  : "text-gray-500"
                : "text-blue-100"
            }`}
          >
            <Time date={timestamp} />
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
