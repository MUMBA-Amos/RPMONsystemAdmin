import { ErrorMessage, useField } from "formik";
import React, { useEffect, useRef, useState } from "react";
interface IProps {
  label: string;
  name: string;
  disabled?: boolean;
}

export const ApTextEditor: React.FC<IProps> = (props) => {
  const { label, disabled, name } = props;
  const [field, meta, { setValue }] = useField(name);

  const editorRef: any = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const { CKEditor, ClassicEditor }: any = editorRef.current || {};

  useEffect(() => {
    editorRef.current = {
      // CKEditor: require('@ckeditor/ckeditor5-react'), // depricated in v3
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor, // v3+
      ClassicEditor: require("@ckeditor/ckeditor5-build-classic"),
    };
    setEditorLoaded(true);
  }, []);

  return editorLoaded ? (
    <div className="mb-5">
      <label className="block mb-2 label" htmlFor="email">
        {label}
      </label>

      <CKEditor
        editor={ClassicEditor}
        data={"abc"}
        onReady={(editor: any) => {
        }}
        onChange={(event: any, editor: any) => {
          const data = editor.getData();
          setValue(data);
        }}
        disabled={disabled}
      />
      <ErrorMessage className="error-message" name={name} component="div" />
    </div>
  ) : (
    <div>Editor loading</div>
  );
};

interface IViewProps {
  content: string;
}

export const ApHTMLContent: React.FC<IViewProps> = ({ content }) => {
  return <div dangerouslySetInnerHTML={{ __html: content }}></div>;
};
