// Component for rich text editing
import { useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import './RichTextEditor.css';
import { ToolbarPlugin } from './RichTextEditor/ToolbarPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { ParagraphNode, TextNode } from 'lexical';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';

interface RichTextEditorProps {
  onChange?(json: string): void;
  readonly?: boolean;
  initialValue?: string;
}

const LoadInitialContentPlugin = ({
  initialValue,
}: {
  initialValue: string;
}) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!initialValue) return;
    const parsed = editor.parseEditorState(JSON.parse(initialValue));
    editor.setEditorState(parsed);
  }, [editor, initialValue]);

  return null;
};

export const RichTextEditor = ({
  onChange = () => {},
  readonly = false,
  initialValue,
}: RichTextEditorProps) => {
  const initialConfig = {
    namespace: 'RTEditor',
    theme: {},
    onError(error: Error) {
      throw error;
    },
    editorState: initialValue
      ? () => (editor: any) => {
          const parsed = editor.parseEditorState(JSON.parse(initialValue));
          editor.setEditorState(parsed);
        }
      : undefined,
    editable: !readonly,
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      ParagraphNode,
      TextNode,
    ],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container">
        {!readonly && (
          <div className="editor-toolbar">
            <ToolbarPlugin />
          </div>
        )}
        <div className="editor-content">
          <RichTextPlugin
            ErrorBoundary={LexicalErrorBoundary}
            contentEditable={<ContentEditable className="editor-input" />}
          />
        </div>
      </div>
      <HistoryPlugin />
      <ListPlugin />
      <OnChangePlugin
        onChange={(editorState) => {
          editorState.read(() => {
            const json = JSON.stringify(editorState);
            onChange(json); // Send JSON string to form
          });
        }}
      />
      {initialValue && <LoadInitialContentPlugin initialValue={initialValue} />}
    </LexicalComposer>
  );
};
