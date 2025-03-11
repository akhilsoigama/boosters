import { useCurrentEditor } from "@tiptap/react";
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaCode,
  FaParagraph,
  FaHeading,
  FaListUl,
  FaListOl,
  FaUndo,
  FaRedo,
  FaQuoteLeft,
  FaCodeBranch,
  FaEraser,
} from "react-icons/fa";

const getButtonClass = (isActive) =>
  `p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    isActive ? "bg-blue-500 text-white" : "  hover:bg-gray-900"
  }`;

export const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-t-lg  dark:border-gray-700">
      <div className="flex gap-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={getButtonClass(editor.isActive("bold"))}
          aria-label="Bold"
        >
          <FaBold />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={getButtonClass(editor.isActive("italic"))}
          aria-label="Italic"
        >
          <FaItalic />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={getButtonClass(editor.isActive("strike"))}
          aria-label="Strikethrough"
        >
          <FaStrikethrough />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={getButtonClass(editor.isActive("code"))}
          aria-label="Code"
        >
          <FaCode />
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`${getButtonClass(editor.isActive("heading", { level: 1 }))} flex`}
          aria-label="Heading 1"
        >
          <FaHeading /> 1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`${getButtonClass(editor.isActive("heading", { level: 2 }))} flex`}
          aria-label="Heading 2"
        >
          <FaHeading /> 2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`${getButtonClass(editor.isActive("heading", { level: 3 }))} flex`}
          aria-label="Heading 3"
        >
          <FaHeading /> 3
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={getButtonClass(editor.isActive("paragraph"))}
          aria-label="Paragraph"
        >
          <FaParagraph />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={getButtonClass(editor.isActive("blockquote"))}
          aria-label="Blockquote"
        >
          <FaQuoteLeft />
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={getButtonClass(editor.isActive("bulletList"))}
          aria-label="Bullet List"
        >
          <FaListUl />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={getButtonClass(editor.isActive("orderedList"))}
          aria-label="Ordered List"
        >
          <FaListOl />
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={getButtonClass(editor.isActive("codeBlock"))}
          aria-label="Code Block"
        >
          <FaCodeBranch />
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          className={getButtonClass(false)}
          aria-label="Clear Formatting"
        >
          <FaEraser />
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className={getButtonClass(false)}
          aria-label="Undo"
        >
          <FaUndo />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className={getButtonClass(false)}
          aria-label="Redo"
        >
          <FaRedo />
        </button>
      </div>
    </div>
  );
};