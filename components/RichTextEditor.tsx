'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import { Extension, type Editor, type Range, type CommandProps } from '@tiptap/core';
import { Box, Button, ButtonGroup, IconButton, Tooltip, Select, MenuItem } from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatQuote,
  FormatListBulleted,
  FormatListNumbered,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  Image as ImageIcon,
  Link as LinkIcon,
  LinkOff,
  Undo,
  Redo,
  FormatSize,
} from '@mui/icons-material';
import { useEffect } from 'react';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      /**
       * Set the font size
       */
      setFontSize: (fontSize: string) => ReturnType;
      /**
       * Unset the font size
       */
      unsetFontSize: () => ReturnType;
    };
    fontWeight: {
      /**
       * Set the font weight
       */
      setFontWeight: (weight: string) => ReturnType;
      /**
       * Unset the font weight
       */
      unsetFontWeight: () => ReturnType;
    };
  }
}

// Custom extension for font size
const FontSize = Extension.create({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize,
            renderHTML: attributes => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }: CommandProps) =>
          chain()
            .setMark('textStyle', { fontSize })
            .run(),
      unsetFontSize:
        () =>
        ({ chain }: CommandProps) =>
          chain()
            .setMark('textStyle', { fontSize: null })
            .run(),
    };
  },
});

// Custom extension for font weight
const FontWeight = Extension.create({
  name: 'fontWeight',

  addOptions() {
    return {
      types: ['textStyle'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontWeight: {
            default: null,
            parseHTML: element => element.style.fontWeight,
            renderHTML: attributes => {
              if (!attributes.fontWeight) return {};
              return { style: `font-weight: ${attributes.fontWeight}` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontWeight:
        (weight: string) =>
        ({ chain }: CommandProps) =>
          chain()
            .setMark('textStyle', { fontWeight: weight })
            .run(),
      unsetFontWeight:
        () =>
        ({ chain }: CommandProps) =>
          chain()
            .setMark('textStyle', { fontWeight: null })
            .run(),
    };
  },
});

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px'];
const fontWeights = ['400', '500', '600', '700', '800', '900'];

export function RichTextEditor({ content, onChange, placeholder = 'Write something...' }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      FontSize.configure(),
      FontWeight.configure(),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update editor content when content prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <Box className="border rounded-lg overflow-hidden">
      <Box className="border-b bg-background p-2 flex flex-wrap gap-1">
        <ButtonGroup size="small" variant="outlined">
          <Select
            size="small"
            value={editor.getAttributes('textStyle').fontSize || '16px'}
            onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
            className="min-w-[80px]"
          >
            {fontSizes.map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
          <Select
            size="small"
            value={editor.getAttributes('textStyle').fontWeight || '400'}
            onChange={(e) => editor.chain().focus().setFontWeight(e.target.value).run()}
            className="min-w-[80px]"
          >
            {fontWeights.map((weight) => (
              <MenuItem key={weight} value={weight}>
                {weight}
              </MenuItem>
            ))}
          </Select>
        </ButtonGroup>

        <ButtonGroup size="small" variant="outlined">
          <Tooltip title="Bold">
            <IconButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive('bold') ? 'is-active' : ''}
            >
              <FormatBold />
            </IconButton>
          </Tooltip>
          <Tooltip title="Italic">
            <IconButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive('italic') ? 'is-active' : ''}
            >
              <FormatItalic />
            </IconButton>
          </Tooltip>
          <Tooltip title="Underline">
            <IconButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={editor.isActive('underline') ? 'is-active' : ''}
            >
              <FormatUnderlined />
            </IconButton>
          </Tooltip>
        </ButtonGroup>

        <ButtonGroup size="small" variant="outlined">
          <Tooltip title="Align Left">
            <IconButton
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
            >
              <FormatAlignLeft />
            </IconButton>
          </Tooltip>
          <Tooltip title="Align Center">
            <IconButton
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
            >
              <FormatAlignCenter />
            </IconButton>
          </Tooltip>
          <Tooltip title="Align Right">
            <IconButton
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
            >
              <FormatAlignRight />
            </IconButton>
          </Tooltip>
          <Tooltip title="Justify">
            <IconButton
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              className={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}
            >
              <FormatAlignJustify />
            </IconButton>
          </Tooltip>
        </ButtonGroup>

        <ButtonGroup size="small" variant="outlined">
          <Tooltip title="Bullet List">
            <IconButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive('bulletList') ? 'is-active' : ''}
            >
              <FormatListBulleted />
            </IconButton>
          </Tooltip>
          <Tooltip title="Numbered List">
            <IconButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive('orderedList') ? 'is-active' : ''}
            >
              <FormatListNumbered />
            </IconButton>
          </Tooltip>
          <Tooltip title="Blockquote">
            <IconButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={editor.isActive('blockquote') ? 'is-active' : ''}
            >
              <FormatQuote />
            </IconButton>
          </Tooltip>
        </ButtonGroup>

        <ButtonGroup size="small" variant="outlined">
          <Tooltip title="Add Image">
            <IconButton onClick={addImage}>
              <ImageIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add/Edit Link">
            <IconButton
              onClick={setLink}
              className={editor.isActive('link') ? 'is-active' : ''}
            >
              <LinkIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Remove Link">
            <IconButton
              onClick={() => editor.chain().focus().unsetLink().run()}
              disabled={!editor.isActive('link')}
            >
              <LinkOff />
            </IconButton>
          </Tooltip>
        </ButtonGroup>

        <ButtonGroup size="small" variant="outlined">
          <Tooltip title="Undo">
            <IconButton onClick={() => editor.chain().focus().undo().run()}>
              <Undo />
            </IconButton>
          </Tooltip>
          <Tooltip title="Redo">
            <IconButton onClick={() => editor.chain().focus().redo().run()}>
              <Redo />
            </IconButton>
          </Tooltip>
        </ButtonGroup>
      </Box>

      <Box className="prose max-w-none p-4">
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
} 