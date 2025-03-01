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
    <main className={`main ${theme} ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="logo-container">
            <div className={`logo-icon ${theme}`}>
              <span className="logo-text">M</span>
            </div>
            <h1 className="app-title">Markdown Studio</h1>
          </div>
          
          <div className="header-buttons">
            <button
              onClick={toggleFullscreen}
              className={`icon-button ${theme}`}
              aria-label="Toggle fullscreen"
            >
              {isFullscreen ? '🗕' : '🗖'}
            </button>
            <button
              onClick={toggleTheme}
              className={`icon-button ${theme}`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </header>
        
        {/* Editor Controls */}
        <div className={`editor-controls ${theme}`}>
          <div className="view-toggles">
            <button
              onClick={() => setViewMode('edit')}
              className={`view-toggle-button ${viewMode === 'edit' ? 'active' : ''} ${theme}`}
            >
              Edit
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`view-toggle-button ${viewMode === 'split' ? 'active' : ''} ${theme}`}
            >
              Split
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`view-toggle-button ${viewMode === 'preview' ? 'active' : ''} ${theme}`}
            >
              Preview
            </button>
          </div>
          
          <div className={`template-buttons ${viewMode === 'preview' ? 'hidden' : ''}`}>
            <div className="template-button-group">
              <button
                onClick={() => insertTemplate('table')}
                className={`template-button ${theme}`}
                title="Insert table"
              >
                Table
              </button>
              <button
                onClick={() => insertTemplate('codeblock')}
                className={`template-button ${theme}`}
                title="Insert code block"
              >
                Code
              </button>
              <button
                onClick={() => insertTemplate('quote')}
                className={`template-button ${theme}`}
                title="Insert blockquote"
              >
                Quote
              </button>
              <button
                onClick={() => insertTemplate('image')}
                className={`template-button ${theme}`}
                title="Insert image"
              >
                Image
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className={`content-area ${theme}`}>
          <div className={`panels-container ${viewMode}`}>
            {/* Editor Panel */}
            <div className={`editor-panel ${viewMode} ${theme}`}>
              <div className="panel-header">
                <div className="panel-title">Markdown</div>
                <div className="character-count">
                  {markdown.length} characters
                </div>
              </div>
              
              <div className="editor-container">
                <textarea
                  ref={editorRef}
                  value={markdown}
                  onChange={handleMarkdownChange}
                  className={`editor-textarea ${theme}`}
                  placeholder="Enter your Markdown here..."
                />
              </div>
            </div>
            
            {/* Preview Panel */}
            <div className={`preview-panel ${viewMode} ${theme}`}>
              <div className="panel-header">
                <div className="panel-title">Preview</div>
                <button
                  onClick={copyHtmlToClipboard}
                  className={`copy-button ${isCopied ? 'copied' : ''} ${theme}`}
                >
                  {isCopied ? 'Copied!' : 'Copy HTML'}
                </button>
              </div>
              
              <div className="preview-container">
                <div 
                  className={`markdown-preview ${theme}`}
                  dangerouslySetInnerHTML={{ __html: htmlOutput }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* HTML Output Section */}
        <div className={`html-output-container ${theme}`}>
          <div className="panel-header">
            <div className="panel-title">HTML Output</div>
            <button
              onClick={copyHtmlToClipboard}
              className={`copy-button primary ${isCopied ? 'copied' : ''} ${theme}`}
            >
              {isCopied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
          </div>
          
          <div className="html-textarea-container">
            <textarea
              value={htmlOutput}
              readOnly
              className={`html-textarea ${theme}`}
            />
            
            <div className="html-label">
              <span className={`language-tag ${theme}`}>
                HTML
              </span>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="footer">
          <p>✨ Markdown Studio • Built with Next.js and CSS</p>
        </footer>
      </div>
    </main>
  );
}
