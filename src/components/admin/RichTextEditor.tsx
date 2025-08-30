import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote,
  Code,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
}

const RichTextEditor = ({ content, onChange, className }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: 'prose-ul',
          },
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
          HTMLAttributes: {
            class: 'prose-ol',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'prose-li',
          },
        },
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: 'prose-heading',
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: 'prose-p',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'prose-blockquote',
          },
        },
        code: {
          HTMLAttributes: {
            class: 'prose-code',
          },
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-lg max-w-none dark:prose-invert focus:outline-none',
          'min-h-[300px] p-6 border-0 overflow-y-auto',
          // Custom prose styling for proper preview
          'prose-headings:font-bold prose-headings:text-foreground',
          'prose-h1:text-3xl prose-h1:font-bold prose-h1:mb-4 prose-h1:mt-6',
          'prose-h2:text-2xl prose-h2:font-bold prose-h2:mb-3 prose-h2:mt-5',
          'prose-h3:text-xl prose-h3:font-bold prose-h3:mb-2 prose-h3:mt-4',
          'prose-p:text-base prose-p:leading-7 prose-p:mb-4',
          'prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4',
          'prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4',
          'prose-li:mb-1 prose-li:text-base',
          'prose-blockquote:border-l-4 prose-blockquote:border-border prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:bg-muted/30 prose-blockquote:py-2',
          'prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm',
          'prose-strong:font-bold prose-em:italic'
        ),
      },
    },
  });

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    disabled = false, 
    children 
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
  }) => (
    <Button
      type="button"
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-8 w-8 p-0",
        isActive && "bg-primary text-primary-foreground"
      )}
    >
      {children}
    </Button>
  );

  return (
    <div className={cn("border border-input rounded-lg bg-card shadow-sm overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="border-b border-border p-2 bg-muted/40 flex flex-wrap items-center gap-1">
        <div className="flex items-center space-x-1 mr-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
          >
            <Heading1 className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
          >
            <Heading2 className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
          >
            <Heading3 className="h-4 w-4" />
          </ToolbarButton>
        </div>
        
        <div className="w-px bg-border mx-2 h-6" />
        
        <div className="flex items-center space-x-1 mr-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
          >
            <Code className="h-4 w-4" />
          </ToolbarButton>
        </div>
        
        <div className="w-px bg-border mx-2 h-6" />
        
        <div className="flex items-center space-x-1 mr-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>
        </div>
        
        <div className="w-px bg-border mx-2 h-6" />
        
        <div className="flex items-center space-x-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
          >
            <Undo className="h-4 w-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
          >
            <Redo className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <div className="ml-auto text-xs text-muted-foreground opacity-70 hidden sm:block">
          Write your content here...
        </div>
      </div>
      
      {/* Editor */}
      <div className="bg-background/50 min-h-[300px] max-h-[600px] overflow-y-auto">
        <EditorContent editor={editor} className="min-h-[300px]" />
      </div>
      
      <div className="border-t border-border p-2 bg-muted/40 flex justify-between items-center text-xs text-muted-foreground">
        <div>
          Markdown formatting supported
        </div>
        <div className="flex items-center">
          <span>
            Rich text editor
          </span>
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;