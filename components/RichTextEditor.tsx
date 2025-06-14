'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Link as LinkIcon,
  ImageIcon,
  Type,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Toggle } from '@/components/ui/toggle';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import TextStyle from '@tiptap/extension-text-style';
import { Extension } from '@tiptap/core';
import { ChainedCommands } from '@tiptap/react';

interface FontSizeOptions {
  types: string[];
}

interface FontWeightOptions {
  types: string[];
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (fontSize: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
    fontWeight: {
      setFontWeight: (fontWeight: string) => ReturnType;
      unsetFontWeight: () => ReturnType;
    };
  }
}

const FontSize = Extension.create<FontSizeOptions>({
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
        ({ chain }: { chain: () => ChainedCommands }) =>
          chain().setMark('textStyle', { fontSize }).run(),
      unsetFontSize:
        () =>
        ({ chain }: { chain: () => ChainedCommands }) =>
          chain().setMark('textStyle', { fontSize: null }).run(),
    };
  },
});

const FontWeight = Extension.create<FontWeightOptions>({
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
        (fontWeight: string) =>
        ({ chain }: { chain: () => ChainedCommands }) =>
          chain().setMark('textStyle', { fontWeight }).run(),
      unsetFontWeight:
        () =>
        ({ chain }: { chain: () => ChainedCommands }) =>
          chain().setMark('textStyle', { fontWeight: null }).run(),
    };
  },
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const fontSizes = {
  'text-xs': '0.75rem',
  'text-sm': '0.875rem',
  'text-base': '1rem',
  'text-lg': '1.125rem',
  'text-xl': '1.25rem',
  'text-2xl': '1.5rem',
  'text-3xl': '1.875rem',
  'text-4xl': '2.25rem',
} as const;

const fontWeights = {
  'font-light': '300',
  'font-normal': '400',
  'font-medium': '500',
  'font-semibold': '600',
  'font-bold': '700',
  'font-extrabold': '800',
} as const;

type FontSizeKey = keyof typeof fontSizes;
type FontWeightKey = keyof typeof fontWeights;

export function RichTextEditor({ value, onChange, className }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      TextStyle,
      FontSize.configure({
        types: ['textStyle'],
      }),
      FontWeight.configure({
        types: ['textStyle'],
      }),
      Link.configure({
        HTMLAttributes: {
          class: 'link',
        },
      }),
      Image.configure({
          HTMLAttributes: {
          class: 'image',
          },
        }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const getFontSize = () => {
    const fontSize = editor.getAttributes('textStyle').fontSize;
    return (Object.entries(fontSizes).find(([, value]) => value === fontSize)?.[0] as FontSizeKey) || 'text-base';
  };

  const getFontWeight = () => {
    const fontWeight = editor.getAttributes('textStyle').fontWeight;
    return (Object.entries(fontWeights).find(([, value]) => value === fontWeight)?.[0] as FontWeightKey) || 'font-normal';
  };

  return (
    <div className={cn('rich-text-editor', className)}>
      <div className="sticky top-[64px] z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-1 items-center p-2">
            <Select
              value={getFontSize()}
              onValueChange={(value: FontSizeKey) => {
                editor.chain().focus().setMark('textStyle', { fontSize: fontSizes[value] }).run();
              }}
            >
              <SelectTrigger className="w-[130px] h-8">
                <Type className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Font size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text-xs">Extra Small</SelectItem>
                <SelectItem value="text-sm">Small</SelectItem>
                <SelectItem value="text-base">Normal</SelectItem>
                <SelectItem value="text-lg">Large</SelectItem>
                <SelectItem value="text-xl">Extra Large</SelectItem>
                <SelectItem value="text-2xl">2XL</SelectItem>
                <SelectItem value="text-3xl">3XL</SelectItem>
                <SelectItem value="text-4xl">4XL</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={getFontWeight()}
              onValueChange={(value: FontWeightKey) => {
                editor.chain().focus().setMark('textStyle', { fontWeight: fontWeights[value] }).run();
              }}
            >
              <SelectTrigger className="w-[130px] h-8">
                <Bold className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Font weight" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="font-light">Light</SelectItem>
                <SelectItem value="font-normal">Normal</SelectItem>
                <SelectItem value="font-medium">Medium</SelectItem>
                <SelectItem value="font-semibold">Semibold</SelectItem>
                <SelectItem value="font-bold">Bold</SelectItem>
                <SelectItem value="font-extrabold">Extra Bold</SelectItem>
              </SelectContent>
            </Select>

            <Toggle
              size="sm"
              pressed={editor.isActive('bold')}
              onPressedChange={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold className="h-4 w-4" />
            </Toggle>

            <Toggle
              size="sm"
              pressed={editor.isActive('italic')}
              onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic className="h-4 w-4" />
            </Toggle>

            <Toggle
              size="sm"
              pressed={editor.isActive('strike')}
              onPressedChange={() => editor.chain().focus().toggleStrike().run()}
            >
              <Strikethrough className="h-4 w-4" />
            </Toggle>

            <Toggle
              size="sm"
              pressed={editor.isActive('bulletList')}
              onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
            >
              <List className="h-4 w-4" />
            </Toggle>

            <Toggle
              size="sm"
              pressed={editor.isActive('orderedList')}
              onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <ListOrdered className="h-4 w-4" />
            </Toggle>

            <Toggle
              size="sm"
              pressed={editor.isActive('heading', { level: 1 })}
              onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            >
              <Heading1 className="h-4 w-4" />
            </Toggle>

            <Toggle
              size="sm"
              pressed={editor.isActive('heading', { level: 2 })}
              onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              <Heading2 className="h-4 w-4" />
            </Toggle>

            <Toggle
              size="sm"
              pressed={editor.isActive('heading', { level: 3 })}
              onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
              <Heading3 className="h-4 w-4" />
            </Toggle>

            <Toggle
              size="sm"
              pressed={editor.isActive('link')}
              onPressedChange={() => editor.chain().focus().toggleLink(editor.getAttributes('link').href).run()}
            >
              <LinkIcon className="h-4 w-4" />
            </Toggle>

            <Dialog>
              <DialogTrigger asChild>
                <Toggle
                  size="sm"
                  pressed={editor.isActive('image')}
                >
                  <ImageIcon className="h-4 w-4" />
                </Toggle>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Insert Image</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      placeholder="https://example.com/image.jpg"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const url = (e.target as HTMLInputElement).value;
                          if (url) {
                            editor.chain().focus().setImage({ src: url }).run();
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <EditorContent editor={editor} className="p-4 min-h-[200px] prose prose-sm max-w-none border rounded-lg" />
    </div>
  );
} 