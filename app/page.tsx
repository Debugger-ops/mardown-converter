'use client';

import { useState, ChangeEvent } from 'react';
import { remark } from 'remark';
import html from 'remark-html';

export default function Home() {
  const [markdown, setMarkdown] = useState<string>('# Hello World\n\nThis is a **bold** statement and this is *italic*.\n\n## Lists\n\n- Item 1\n- Item 2\n  - Nested item\n\n## Code\n\n```javascript\nconst greeting = "Hello, world!";\nconsole.log(greeting);\n```\n\n## Links\n\n[Visit GitHub](https://github.com)');
  const [htmlOutput, setHtmlOutput] = useState<string>('');
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  // Convert markdown to HTML using remark
  const convertMarkdownToHtml = async (md: string): Promise<string> => {
    const processedContent = await remark()
      .use(html)
      .process(md);
    
    return processedContent.toString();
  };

  const handleConvert = async (): Promise<void> => {
    const convertedHtml = await convertMarkdownToHtml(markdown);
    setHtmlOutput(convertedHtml);
    setIsPreviewMode(true);
  };

  const handleMarkdownChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setMarkdown(e.target.value);
  };

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Markdown to HTML Converter</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between mb-4">
          <button 
            onClick={() => setIsPreviewMode(false)}
            className={`px-4 py-2 rounded ${!isPreviewMode ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Edit
          </button>
          <button 
            onClick={handleConvert}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Convert
          </button>
          <button 
            onClick={() => setIsPreviewMode(true)}
            className={`px-4 py-2 rounded ${isPreviewMode ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Preview
          </button>
        </div>
        
        {!isPreviewMode ? (
          <div className="mb-4">
            <label htmlFor="markdown" className="block text-sm font-medium text-gray-700 mb-2">
              Markdown Input
            </label>
            <textarea
              id="markdown"
              value={markdown}
              onChange={handleMarkdownChange}
              className="w-full h-64 p-4 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your Markdown here..."
            />
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              HTML Preview
            </label>
            <div 
              className="w-full h-64 p-4 border border-gray-300 rounded-md overflow-auto prose" 
              dangerouslySetInnerHTML={{ __html: htmlOutput }}
            />
          </div>
        )}
        
        {isPreviewMode && (
          <div className="mb-4">
            <label htmlFor="html-output" className="block text-sm font-medium text-gray-700 mb-2">
              HTML Output
            </label>
            <textarea
              id="html-output"
              value={htmlOutput}
              readOnly
              className="w-full h-64 p-4 border border-gray-300 rounded-md font-mono text-sm"
            />
          </div>
        )}
      </div>
    </main>
  );
}