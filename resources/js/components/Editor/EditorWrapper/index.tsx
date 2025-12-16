import { useEffect } from 'react';
import '../../../../css/lexical.css';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { MuiContentEditable, placeHolderSx } from './styles';
import { Box } from '@mui/material';
import Toolbar from '../Toolbar';
import lexicalEditorConfig from '../config';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import ImagesPlugin from '../plugin/ImagePlugin';
import { $getRoot } from 'lexical';
import { $generateHtmlFromNodes } from '@lexical/html';

type Payload = { json: string; html: string; text: string };

type EditorWrapperProps = {
  initialJson?: string | null;
  onChange?: (p: Payload) => void;
};

function ChangeEmitter({ onChange }: { onChange?: (p: Payload) => void }) {
  const [editor] = useLexicalComposerContext();

  const handleChange = (editorState: any) => {
    const json = JSON.stringify(editorState.toJSON());

    editorState.read(() => {
      const html = $generateHtmlFromNodes(editor);
      const text = $getRoot().getTextContent();
      onChange?.({ json, html, text });
    });
  };

  return <OnChangePlugin onChange={handleChange} />;
}

function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();
  useEffect(() => editor.focus(), [editor]);
  return null;
}

export default function EditorWrapper({ initialJson, onChange }: EditorWrapperProps) {
  return (
    <LexicalComposer
      initialConfig={{
        ...lexicalEditorConfig,

        
        editorState: (editor) => {
          if (!initialJson) return;

          try {
            const parsed = editor.parseEditorState(initialJson);
            editor.setEditorState(parsed);
          } catch (e) {
            console.error('Failed to load Lexical JSON:', e);
          }
        },
      }}
    >
      <Toolbar />
      <Box sx={{ position: 'relative', mt: 1 }}>
        <RichTextPlugin
          contentEditable={<MuiContentEditable />}
          placeholder={<Box sx={placeHolderSx}>Enter your text here</Box>}
          ErrorBoundary={LexicalErrorBoundary}
        />

        <MyCustomAutoFocusPlugin />
        <ChangeEmitter onChange={onChange} />

        <HistoryPlugin />
        <ImagesPlugin captionsEnabled={false} />
        <ListPlugin />
        <LinkPlugin />
      </Box>
    </LexicalComposer>
  );
}
