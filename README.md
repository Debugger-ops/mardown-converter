# HTML to Markdown Converter

A lightweight, efficient tool that converts HTML documents into clean, well-formatted Markdown.

## Features

- **Accurate Conversion**: Preserves the structure and meaning of HTML content when converting to Markdown
- **Support for Common Elements**: Handles headings, paragraphs, lists, links, images, tables, code blocks, and more
- **Custom Options**: Configure output formatting with various options
- **Clean Output**: Produces readable, minimal Markdown without unnecessary whitespace
- **Batch Processing**: Convert multiple files or entire directories at once
- **CLI & API Support**: Use as a command-line tool or integrate into your application
- **Dark Mode**: Ability to toggle between light and dark mode

## Installation

### Via npm

```bash
npm install html-to-markdown-converter
```

### Via yarn

```bash
yarn add html-to-markdown-converter
```

### Manual Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/debugger-ops/html-to-markdown-converter.git
   ```
2. Navigate to the project directory:
   ```bash
   cd html-to-markdown-converter
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Command Line Interface

Convert a single HTML file:

```bash
html2md input.html -o output.md
```

Convert multiple files:

```bash
html2md input1.html input2.html -o output_dir/
```

With custom options:

```bash
html2md input.html -o output.md --gfm --bulletListMarker=* --codeBlockStyle=fenced
```

### API Usage

```javascript
const html2md = require('html-to-markdown-converter');

// Convert HTML string to Markdown
const markdown = html2md.convert('<h1>Hello World</h1><p>This is a paragraph.</p>');
console.log(markdown);

// Convert with options
const options = {
  gfm: true,
  bulletListMarker: '*',
  codeBlockStyle: 'fenced'
};

const markdownWithOptions = html2md.convert(htmlString, options);
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `gfm` | Boolean | `true` | Use GitHub Flavored Markdown |
| `bulletListMarker` | String | `-` | Character to use for bullet lists (`-`, `*`, or `+`) |
| `codeBlockStyle` | String | `fenced` | Code block style (`fenced` or `indented`) |
| `emDelimiter` | String | `*` | Character for emphasis (`*` or `_`) |
| `strongDelimiter` | String | `**` | Character for strong emphasis (`**` or `__`) |
| `linkReferenceStyle` | String | `inlined` | Link style (`inlined`, `referenced`, or `collapsed`) |
| `preserveImageSize` | Boolean | `false` | Preserve image dimensions when converting |
| `tableStyle` | String | `pipe` | Table style (`pipe` or `simple`) |

## Element Support

The converter handles the following HTML elements:

- Headings (`h1` through `h6`)
- Paragraphs (`p`)
- Lists (`ul`, `ol`, `li`)
- Links (`a`)
- Images (`img`)
- Emphasis (`em`, `i`)
- Strong emphasis (`strong`, `b`)
- Code (`code`, `pre`)
- Blockquotes (`blockquote`)
- Horizontal rules (`hr`)
- Tables (`table`, `tr`, `th`, `td`)
- Line breaks (`br`)

## Examples

### Input HTML

```html
<!DOCTYPE html>
<html>
<body>
  <h1>Sample Document</h1>
  <p>This is a <strong>bold text</strong> and <em>italic text</em>.</p>
  <h2>Lists</h2>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </ul>
  <h2>Links and Images</h2>
  <p>Visit <a href="https://example.com">Example</a> website.</p>
  <img src="image.jpg" alt="Sample Image">
</body>
</html>
```

### Output Markdown

```markdown
# Sample Document

This is a **bold text** and *italic text*.

## Lists

- Item 1
- Item 2
- Item 3

## Links and Images

Visit [Example](https://example.com) website.

![Sample Image](image.jpg)
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to all contributors who have helped make this tool better
- Inspired by various HTML-to-Markdown converters in the open-source community
