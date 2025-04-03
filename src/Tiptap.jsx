import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TrackChangeExtension from './track.tsx';

const Tiptap = () => {
  const extensions = [
    StarterKit,
    TrackChangeExtension.configure({
      enabled: true,
      dataOpUserId: '12',
      dataOpUserNickname: '1221',
      onStatusChange(status) {
        console.log('Status changed:', status);
      },
    }),
  ];
  const [content, setContent] = useState('<p>Hello World!</p>');

  const editor = useEditor({
    extensions,
    content,
    onUpdate: () => {
      setContent(editor.getHTML());
      console.log(content);
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
      <span dangerouslySetInnerHTML={{ __html: content }}></span>
      {content}
    </>
  );
};

export default Tiptap;
