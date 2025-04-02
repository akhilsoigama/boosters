'use client';
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import { EditorContent, EditorProvider } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ReactMarkdown from 'react-markdown';
import TurndownService from 'turndown';
import { MenuBar } from './Menubar';
import { useEffect, useState } from 'react';



const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
];

const TiptapEditor = ({ onChange, value}) => {
  const [editorContent, setEditorContent] = useState(value || '');

  useEffect(() => {
    setEditorContent(value || '');
  }, [value]);

  return (
    <div className="w-full">
      Content
      <EditorProvider
        name='content'
        slotBefore={<MenuBar />}
        extensions={[StarterKit]}
        content={editorContent}
        onUpdate={({ editor }) => {
          const html = editor.getHTML();
          setEditorContent(html);
          onChange(html);
        }}
        immediatelyRender={false}
      >

      </EditorProvider>
    </div>
  );
};


export default TiptapEditor;


// 'use client';
// import { useEditor, EditorContent } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Color from '@tiptap/extension-color';
// import TextStyle from '@tiptap/extension-text-style';
// import { useEffect, useState } from 'react';
// import { MenuBar } from './Menubar';

// const TiptapEditor = ({ onChange, value }) => {
//   const [mounted, setMounted] = useState(false);
//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({
//         listItem: {
//           HTMLAttributes: {
//             class: 'list-item',
//           },
//         },
//       }),
//       Color,
//       TextStyle,
//     ],
//     content: value,
//     onUpdate: ({ editor }) => {
//       const html = editor.getHTML();
//       onChange(html);
//     },
//   });

//   useEffect(() => {
//     setMounted(true);
//     return () => setMounted(false);
//   }, []);

//   useEffect(() => {
//     if (editor && mounted && value !== editor.getHTML()) {
//       editor.commands.setContent(value || '');
//     }
//   }, [value, editor, mounted]);

//   if (!mounted) return null;

//   return (
//     <div className="w-full">
//       Content
//       {editor && <MenuBar editor={editor} />}
//       <EditorContent editor={editor} />
//     </div>
//   );
// };

// export default TiptapEditor;


