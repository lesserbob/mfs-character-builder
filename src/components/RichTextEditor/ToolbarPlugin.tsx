import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  $createParagraphNode,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  HeadingTagType,
} from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { useEffect, useState } from 'react';
import { ButtonGroup, Select, MenuItem, IconButton } from '@mui/material';
import BoldIcon from '@mui/icons-material/FormatBold';
import ItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [blockType, setBlockType] = useState<string>('paragraph');

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode();
          const element = anchorNode.getTopLevelElementOrThrow();
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          setBlockType(type);
        }
        return false;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor]);

  const formatBlock = (type: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        switch (type) {
          case 'h1':
          case 'h2':
            $setBlocksType(selection, () =>
              $createHeadingNode(type as HeadingTagType)
            );
            break;
          case 'quote':
            $setBlocksType(selection, () => $createQuoteNode());
            break;
          default:
            $setBlocksType(selection, () => $createParagraphNode());
        }
      }
    });
  };

  return (
    <ButtonGroup
      variant="outlined"
      size="small"
      style={{ marginBottom: '8px' }}
    >
      <Select
        value={blockType}
        onChange={(e) => formatBlock(e.target.value)}
        style={{ minWidth: 120 }}
      >
        <MenuItem value="paragraph">Paragraph</MenuItem>
        <MenuItem value="h1">Heading 1</MenuItem>
        <MenuItem value="h2">Heading 2</MenuItem>
        <MenuItem value="quote">Quote</MenuItem>
      </Select>

      <IconButton
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        aria-label="Bold"
      >
        <BoldIcon />
      </IconButton>
      <IconButton
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        aria-label="Italic"
      >
        <ItalicIcon />
      </IconButton>
      {/* Underline is not natively supported, and (frankly) not worth busting my balls over
      <IconButton
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        aria-label="Underline"
      >
        <UnderlineIcon />
      </IconButton> */}
      <IconButton
        onClick={() =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        }
        aria-label="Bullet List"
      >
        <FormatListBulletedIcon />
      </IconButton>
      <IconButton
        onClick={() =>
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        }
        aria-label="Numbered List"
      >
        <FormatListNumberedIcon />
      </IconButton>
      <IconButton
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        aria-label="Undo"
      >
        <UndoIcon />
      </IconButton>
      <IconButton
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        aria-label="Redo"
      >
        <RedoIcon />
      </IconButton>
    </ButtonGroup>
  );
}
