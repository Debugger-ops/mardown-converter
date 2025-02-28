'use client';

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { remark } from 'remark';
import html from 'remark-html';
import './page.css';
export default function MarkdownConverter() {
  const [markdown, setMarkdown] = useState<string>('# Hello World\n\nThis is a **bold** statement and this is *italic*.\n\n## Lists\n\n- Item 1\n- Item 2\n  - Nested item\n\n## Code\n\n```javascript\nconst greeting = "Hello, world!";\nconsole.log(greeting);\n```\n\n## Links\n\n[Visit GitHub](https://github.com)');
  const [htmlOutput, setHtmlOutput] = useState<string>('');
  const [viewMode, setViewMode] = useState<'edit' | 'split' | 'preview'>('split');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // Convert markdown to HTML using remark
  const convertMarkdownToHtml = async (md: string): Promise<string> => {
    try {
      const processedContent = await remark().use(html).process(md);
      return processedContent.toString();
    } catch (error) {
      console.error('Error converting markdown:', error);
      return '<p>Error converting markdown</p>';
    }
  };

  // Auto-convert when markdown changes
  useEffect(() => {
    const debounce = setTimeout(async () => {
      const convertedHtml = await convertMarkdownToHtml(markdown);
      setHtmlOutput(convertedHtml);
    }, 300);
    
    return () => clearTimeout(debounce);
  }, [markdown]);

  // Focus editor when switching to edit mode
  useEffect(() => {
    if (viewMode === 'edit' && editorRef.current) {
      editorRef.current.focus();
    }
  }, [viewMode]);

  const handleMarkdownChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setMarkdown(e.target.value);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const copyHtmlToClipboard = () => {
    navigator.clipboard.writeText(htmlOutput)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Insert template content
  const insertTemplate = (templateType: string) => {
    let template = '';
    
    switch(templateType) {
      case 'table':
        template = '\n| Header 1 | Header 2 | Header 3 |\n| --- | --- | --- |\n| Row 1, Col 1 | Row 1, Col 2 | Row 1, Col 3 |\n| Row 2, Col 1 | Row 2, Col 2 | Row 2, Col 3 |\n';
        break;
      case 'codeblock':
        template = '\n```javascript\n// Your code here\nconst example = "Hello, world!";\nconsole.log(example);\n```\n';
        break;
      case 'quote':
        template = '\n> This is a blockquote with a very important quote inside of it.\n';
        break;
      case 'image':
        template = '\n![Alt text](https://example.com/image.jpg "Image Title")\n';
        break;
    }
    
    if (editorRef.current) {
      const cursorPos = editorRef.current.selectionStart;
      const textBefore = markdown.substring(0, cursorPos);
      const textAfter = markdown.substring(cursorPos);
      setMarkdown(textBefore + template + textAfter);
      
      // Set cursor position after inserted template
      setTimeout(() => {
        if (editorRef.current) {
          const newPosition = cursorPos + template.length;
          editorRef.current.focus();
          editorRef.current.setSelectionRange(newPosition, newPosition);
        }
      }, 0);
    }
  };

  return (
    <main className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'
    } ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="container mx-auto py-6 px-4 h-full flex flex-col">
        {/* Header */}
        <header className="mb-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'
            }`}>
              <span className="text-white text-xl font-bold">M</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Markdown Studio</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleFullscreen}
              className={`p-2 rounded-md ${
                theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
              }`}
              aria-label="Toggle fullscreen"
            >
              {isFullscreen ? '🗕' : '🗖'}
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-md ${
                theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
              }`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </header>
        
        {/* Editor Controls */}
        <div className={`mb-4 flex flex-wrap items-center justify-between rounded-t-lg p-2 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-sm`}>
          <div className="flex space-x-1">
            <button
              onClick={() => setViewMode('edit')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'edit' 
                  ? theme === 'dark' 
                    ? 'bg-gray-700 text-blue-400' 
                    : 'bg-blue-100 text-blue-700' 
                  : theme === 'dark'
                    ? 'text-gray-400 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'split' 
                  ? theme === 'dark' 
                    ? 'bg-gray-700 text-blue-400' 
                    : 'bg-blue-100 text-blue-700' 
                  : theme === 'dark'
                    ? 'text-gray-400 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Split
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'preview' 
                  ? theme === 'dark' 
                    ? 'bg-gray-700 text-blue-400' 
                    : 'bg-blue-100 text-blue-700' 
                  : theme === 'dark'
                    ? 'text-gray-400 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Preview
            </button>
          </div>
          
          <div className={`flex flex-wrap mt-2 sm:mt-0 ${viewMode === 'preview' ? 'hidden' : ''}`}>
            <div className="flex space-x-1">
              <button
                onClick={() => insertTemplate('table')}
                className={`p-2 rounded-md text-xs ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                title="Insert table"
              >
                Table
              </button>
              <button
                onClick={() => insertTemplate('codeblock')}
                className={`p-2 rounded-md text-xs ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                title="Insert code block"
              >
                Code
              </button>
              <button
                onClick={() => insertTemplate('quote')}
                className={`p-2 rounded-md text-xs ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                title="Insert blockquote"
              >
                Quote
              </button>
              <button
                onClick={() => insertTemplate('image')}
                className={`p-2 rounded-md text-xs ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                title="Insert image"
              >
                Image
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className={`flex-1 overflow-hidden rounded-b-lg shadow-xl ${
          theme === 'dark' ? 'bg-gray-800 shadow-gray-900/30' : 'bg-white shadow-gray-200/60'
        }`}>
          <div className={`h-full flex ${
            viewMode === 'split' ? 'flex-col md:flex-row' : 'flex-col'
          }`}>
            {/* Editor Panel */}
            <div className={`${
              viewMode === 'preview' ? 'hidden' : 
              viewMode === 'split' ? 'h-1/2 md:h-auto md:w-1/2' : 'flex-1'
            } flex flex-col border-b md:border-b-0 ${
              theme === 'dark' ? 'md:border-r border-gray-700' : 'md:border-r border-gray-200'
            }`}>
              <div className="p-3 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                <div className="text-sm font-medium">Markdown</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {markdown.length} characters
                </div>
              </div>
              
              <div className="flex-1 overflow-hidden">
                <textarea
                  ref={editorRef}
                  value={markdown}
                  onChange={handleMarkdownChange}
                  className={`w-full h-full p-4 resize-none focus:outline-none font-mono text-sm leading-relaxed ${
                    theme === 'dark' 
                      ? 'bg-gray-800 text-gray-200' 
                      : 'bg-white text-gray-800'
                  }`}
                  placeholder="Enter your Markdown here..."
                />
              </div>
            </div>
            
            {/* Preview Panel */}
            <div className={`${
              viewMode === 'edit' ? 'hidden' : 
              viewMode === 'split' ? 'h-1/2 md:h-auto md:w-1/2' : 'flex-1'
            } flex flex-col`}>
              <div className="p-3 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                <div className="text-sm font-medium">Preview</div>
                <button
                  onClick={copyHtmlToClipboard}
                  className={`text-xs px-3 py-1 rounded-md transition-colors ${
                    isCopied 
                      ? theme === 'dark' 
                        ? 'bg-green-700 text-green-100' 
                        : 'bg-green-100 text-green-800'
                      : theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {isCopied ? 'Copied!' : 'Copy HTML'}
                </button>
              </div>
              
              <div className="flex-1 overflow-auto">
                <div 
                  className={`prose max-w-none h-full p-4 ${
                    theme === 'dark' ? 'prose-invert' : ''
                  }`}
                  dangerouslySetInnerHTML={{ __html: htmlOutput }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* HTML Output Section */}
        <div className={`mt-6 rounded-lg shadow-lg overflow-hidden ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="p-3 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
            <div className="text-sm font-medium">HTML Output</div>
            <button
              onClick={copyHtmlToClipboard}
              className={`text-xs px-3 py-1 rounded-md transition-colors ${
                isCopied 
                  ? theme === 'dark' 
                    ? 'bg-green-700 text-green-100' 
                    : 'bg-green-100 text-green-800'
                  : theme === 'dark'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isCopied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
          </div>
          
          <div className="relative">
            <textarea
              value={htmlOutput}
              readOnly
              className={`w-full h-32 p-4 resize-none focus:outline-none font-mono text-xs ${
                theme === 'dark' 
                  ? 'bg-gray-800 text-gray-300' 
                  : 'bg-gray-50 text-gray-800'
              }`}
            />
            
            <div className="absolute top-2 right-2">
              <span className={`text-xs px-2 py-1 rounded-md ${
                theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
              }`}>
                HTML
              </span>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400 py-4">
          <p>✨ Markdown Studio • Built with Next.js and Tailwind CSS</p>
        </footer>
      </div>
    </main>
  );
}
