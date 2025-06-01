import { RichTextReadOnly as MuiRichTextReadOnly } from 'mui-tiptap';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';

// Create a new lowlight instance
const lowlight = createLowlight(common);

// Import all languages you want to support
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import python from 'highlight.js/lib/languages/python';
import rust from 'highlight.js/lib/languages/rust';
import go from 'highlight.js/lib/languages/go';
import cpp from 'highlight.js/lib/languages/cpp';
import java from 'highlight.js/lib/languages/java';
import php from 'highlight.js/lib/languages/php';
import ruby from 'highlight.js/lib/languages/ruby';
import sql from 'highlight.js/lib/languages/sql';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import yaml from 'highlight.js/lib/languages/yaml';
import markdown from 'highlight.js/lib/languages/markdown';

// Register the languages
lowlight.register('javascript', javascript);
lowlight.register('typescript', typescript);
lowlight.register('html', html);
lowlight.register('css', css);
lowlight.register('python', python);
lowlight.register('rust', rust);
lowlight.register('go', go);
lowlight.register('cpp', cpp);
lowlight.register('java', java);
lowlight.register('php', php);
lowlight.register('ruby', ruby);
lowlight.register('sql', sql);
lowlight.register('bash', bash);
lowlight.register('json', json);
lowlight.register('yaml', yaml);
lowlight.register('markdown', markdown);

interface RichTextReadOnlyProps {
  content: string;
}

const extensions = [
  StarterKit.configure({
    codeBlock: false,
  }),
  CodeBlockLowlight.configure({
    lowlight,
    defaultLanguage: 'javascript',
    HTMLAttributes: {
      class: 'code-block not-prose my-4',
    },
  }),
];

export function RichTextReadOnly({ content }: RichTextReadOnlyProps) {
  if (!content) {
    return null;
  }

  return (
    <div className="prose prose-lg max-w-none dark:prose-invert 
      prose-p:my-4 prose-p:text-lg prose-p:leading-relaxed
      prose-headings:mt-8 prose-headings:mb-4
      prose-h1:text-4xl prose-h1:font-extrabold
      prose-h2:text-3xl prose-h2:font-bold
      prose-h3:text-2xl prose-h3:font-semibold
      prose-li:my-2 prose-li:text-lg
      prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
      prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
      prose-blockquote:my-6 prose-blockquote:pl-6 prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:italic prose-blockquote:text-lg
      prose-pre:my-6 prose-pre:bg-muted/50 prose-pre:p-4 prose-pre:rounded-lg
      prose-code:bg-muted/50 prose-code:rounded-md prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm
      prose-img:my-8 prose-img:rounded-lg
      prose-hr:my-8
      prose-table:my-6 prose-table:border-collapse prose-table:w-full
      prose-th:border prose-th:border-border prose-th:p-2 prose-th:bg-muted/50
      prose-td:border prose-td:border-border prose-td:p-2
      [&>*:first-child]:mt-0 [&>*:last-child]:mb-0
      selection:bg-primary/20">
      <MuiRichTextReadOnly content={content} extensions={extensions} />
    </div>
  );
} 