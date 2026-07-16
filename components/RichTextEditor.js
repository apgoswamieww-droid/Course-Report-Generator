'use client'

import { CKEditor } from '@ckeditor/ckeditor5-react'
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic'
import { Essentials } from '@ckeditor/ckeditor5-essentials'
import { Bold, Italic, Underline } from '@ckeditor/ckeditor5-basic-styles'
import { List } from '@ckeditor/ckeditor5-list'
import { Heading } from '@ckeditor/ckeditor5-heading'
import { Paragraph } from '@ckeditor/ckeditor5-paragraph'
import { Undo } from '@ckeditor/ckeditor5-undo'

import 'ckeditor5/ckeditor5.css'

export default function RichTextEditor({ value, onChange }) {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={value || ''}
      onChange={(event, editor) => {
        onChange(editor.getData())
      }}
      config={{
        licenseKey: 'GPL',
        plugins: [Essentials, Bold, Italic, Underline, List, Heading, Paragraph, Undo],
        toolbar: ['undo', 'redo', '|', 'heading', '|', 'bold', 'italic', 'underline', '|', 'numberedList', 'bulletedList'],
      }}
    />
  )
}
