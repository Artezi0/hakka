import { RichTextEditor } from "@mantine/tiptap"

export default function Toolbar() {
 return (
    <RichTextEditor.Toolbar sticky stickyOffset={60}>
      <RichTextEditor.ControlsGroup>
        <RichTextEditor.ClearFormatting />
        <RichTextEditor.Bold />
        <RichTextEditor.Italic />
      </RichTextEditor.ControlsGroup>
      <RichTextEditor.ControlsGroup>
        <RichTextEditor.H1 />
        <RichTextEditor.H2 />
        <RichTextEditor.H3 />
      </RichTextEditor.ControlsGroup>  
      <RichTextEditor.ControlsGroup>
        <RichTextEditor.Link />
        <RichTextEditor.Unlink />
      </RichTextEditor.ControlsGroup> 
      <RichTextEditor.ControlsGroup>
        <RichTextEditor.AlignLeft />
        <RichTextEditor.AlignCenter />
        <RichTextEditor.AlignJustify />
        <RichTextEditor.AlignRight />
      </RichTextEditor.ControlsGroup>
    </RichTextEditor.Toolbar>
 ) 
}