// Component for rich text editing
import React, { useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import './RichTextEditor.css';

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
    // editorState: () => {
    //   if (initialValue) {
    //     return (editor: any) => {
    //       const parsedState = editor.parseEditorState(initialValue);
    //       editor.setEditorState(parsedState);
    //     };
    //   }
    // },
    editorState: initialValue
      ? () => (editor: any) => {
          console.log(initialValue);
          const parsed = editor.parseEditorState(JSON.parse(initialValue));
          editor.setEditorState(parsed);
        }
      : undefined,
    editable: !readonly,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        ErrorBoundary={LexicalErrorBoundary}
        contentEditable={<ContentEditable className="editor-input" />}
        // placeholder={<div className="editor-placeholder">Start typing...</div>}
      />
      <HistoryPlugin />
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
