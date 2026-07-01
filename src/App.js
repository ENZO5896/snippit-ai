export default function SnippitAI() { return ( <div className="min-h-screen bg-white text-black flex flex-col"> {/* Top Navbar */} <header className="w-full border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 bg-white z-50"> <div className="flex items-center gap-2"> <div className="w-9 h-9 rounded-2xl bg-black text-white flex items-center justify-center font-bold"> S </div> <div> <h1 className="font-bold text-lg">SNIPPIT AI</h1> <p className="text-xs text-gray-500">Smart conversations powered by AI</p> </div> </div>

<div className="flex items-center gap-3">
      <button className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition text-sm font-medium">
        Login
      </button>

      <button className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center text-lg">
        ⚙️
      </button>
    </div>
  </header>

  {/* Main Layout */}
  <div className="flex flex-1 overflow-hidden">
    {/* Sidebar */}
    <aside className="hidden md:flex w-72 border-r border-gray-200 bg-gray-50 flex-col p-4 gap-4">
      <button className="w-full bg-black text-white rounded-2xl py-3 font-semibold hover:opacity-90 transition">
        + New Chat
      </button>

      <div className="flex flex-col gap-2 overflow-y-auto">
        <div className="p-3 rounded-2xl bg-white shadow-sm hover:bg-gray-100 cursor-pointer transition">
          AI Business Ideas
        </div>

        <div className="p-3 rounded-2xl bg-white shadow-sm hover:bg-gray-100 cursor-pointer transition">
          Homework Help
        </div>

        <div className="p-3 rounded-2xl bg-white shadow-sm hover:bg-gray-100 cursor-pointer transition">
          Content Creation
        </div>
      </div>

      <div className="mt-auto bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
        <h2 className="font-semibold mb-1">SNIPPIT Premium</h2>
        <p className="text-sm text-gray-500 mb-3">
          Faster responses, smarter AI and premium tools.
        </p>

        <button className="w-full bg-black text-white rounded-2xl py-2 hover:opacity-90 transition">
          Upgrade
        </button>
      </div>
    </aside>

    {/* Chat Section */}
    <main className="flex-1 flex flex-col justify-between bg-white">
      {/* Welcome Area */}
      <div className="flex-1 overflow-y-auto px-4 py-10 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Welcome to SNIPPIT AI
            </h1>

            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Your modern AI assistant for chatting, creativity, studying,
              business ideas and everyday tasks.
            </p>
          </div>

          {/* AI Message */}
          <div className="flex gap-4 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center font-bold shrink-0">
              S
            </div>

            <div className="bg-gray-100 rounded-3xl px-5 py-4 max-w-2xl shadow-sm">
              <p className="leading-relaxed">
                Hey 👋 I’m SNIPPIT AI. Ask me anything — from homework,
                coding and business ideas to content creation and daily
                productivity.
              </p>
            </div>
          </div>

          {/* User Message */}
          <div className="flex gap-4 justify-end mb-8">
            <div className="bg-black text-white rounded-3xl px-5 py-4 max-w-2xl shadow-sm">
              <p>Help me redesign my AI website interface.</p>
            </div>

            <div className="w-10 h-10 rounded-2xl bg-gray-200 flex items-center justify-center font-bold shrink-0">
              U
            </div>
          </div>

          {/* Suggested Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
            <button className="text-left bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-3xl p-5 transition">
              <h3 className="font-semibold mb-1">🎨 Design Ideas</h3>
              <p className="text-sm text-gray-500">
                Generate modern interface concepts and layouts.
              </p>
            </button>

            <button className="text-left bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-3xl p-5 transition">
              <h3 className="font-semibold mb-1">💻 Coding Help</h3>
              <p className="text-sm text-gray-500">
                Build websites, apps and AI tools faster.
              </p>
            </button>

            <button className="text-left bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-3xl p-5 transition">
              <h3 className="font-semibold mb-1">📚 Study Assistant</h3>
              <p className="text-sm text-gray-500">
                Get help with assignments, summaries and research.
              </p>
            </button>

            <button className="text-left bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-3xl p-5 transition">
              <h3 className="font-semibold mb-1">🚀 Business Growth</h3>
              <p className="text-sm text-gray-500">
                Discover ideas to grow your startup or brand.
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="border-t border-gray-200 bg-white px-4 py-4 md:px-10 sticky bottom-0">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-100 rounded-3xl px-4 py-3 flex items-center gap-3 shadow-sm border border-gray-200">
            {/* Upload Image */}
            <button className="w-11 h-11 rounded-2xl bg-white hover:bg-gray-200 transition flex items-center justify-center text-lg shadow-sm">
              🖼️
            </button>

            {/* Upload File */}
            <button className="w-11 h-11 rounded-2xl bg-white hover:bg-gray-200 transition flex items-center justify-center text-lg shadow-sm">
              📎
            </button>

            {/* More Menu */}
            <button className="w-11 h-11 rounded-2xl bg-white hover:bg-gray-200 transition flex items-center justify-center text-lg shadow-sm">
              ⋯
            </button>

            {/* Input */}
            <input
              type="text"
              placeholder="Message SNIPPIT AI..."
              className="flex-1 bg-transparent outline-none text-base px-2"
            />

            {/* Send Button */}
            <button className="bg-black text-white px-5 py-3 rounded-2xl hover:opacity-90 transition font-medium">
              Send
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-3">
            SNIPPIT AI may produce mistakes. Verify important information.
          </p>
        </div>
      </div>
    </main>
  </div>
</div>

); }