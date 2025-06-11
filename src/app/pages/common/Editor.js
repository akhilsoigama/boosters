'use client';

import { EditorProvider } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { MenuBar } from './Menubar';
import { useEffect, useState } from 'react';

const TiptapEditor = ({ onChange, value, height = '300px' }) => {
  const [editorContent, setEditorContent] = useState('');

  useEffect(() => {
    setEditorContent(value || '');
  }, [value]);

  return (
    <div className="w-full">
      <EditorProvider
        key={editorContent}
        extensions={[StarterKit]}
        content={editorContent}
        onUpdate={({ editor }) => {
          const html = editor.getHTML();
          setEditorContent(html);
          onChange(html);
        }}
        editorProps={{
          attributes: {
            class: `border rounded-md h-auto bg-white dark:bg-zinc-800 px-8 py-5 min-h-[${height}] focus:outline-none`,
          },
        }}
        slotBefore={<MenuBar />}
      />
    </div>
  );
};

export default TiptapEditor;
