import React, { useState } from 'react';
import { useEditor, EditorContent, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import { SuggestionInsertMark } from './SuggestionInsertMark';
import { SuggestionDeleteMark } from './SuggestionDeleteMark';
import { SuggestionModeExtension } from './suggestion-mode';
import './styles.css';
const extensions = [
  StarterKit,
  Highlight.configure({ multicolor: true }),
  SuggestionInsertMark,
  SuggestionDeleteMark,
  SuggestionModeExtension,
];

const content = '<p>Hello World!</p>';

const Tiptap = () => {
  const [newContent, setNewContent] = useState(content);
  const editor = useEditor({
    extensions,
    content: newContent,
    onUpdate: ({ editor }) => {
      setNewContent(editor.getHTML());
    },
  });

  return (
    <>
      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={editor.isActive('highlight') ? 'is-active' : ''}
      >
        Toggle highlight
      </button>
      <EditorContent editor={editor} />
      <FloatingMenu editor={editor}>This is the floating menu</FloatingMenu>
    </>
  );
};

export default Tiptap;
