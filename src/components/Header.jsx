import { Sparkles, RotateCcw } from "lucide-react";

const Header = ({ onClearChat }) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Deepcrop AI</h1>
          </div>
        </div>

        <button
          onClick={onClearChat}
          className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          title="Clear Chat"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-sm font-medium">Clear</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
