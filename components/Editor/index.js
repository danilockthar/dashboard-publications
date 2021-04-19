import { useState, useRef, useContext } from "react";
import EditorJs from "react-editor-js";
import { ContextState } from "../../context/global";
import { createOnePost } from "../../graphql/api";
import { EDITOR_JS_TOOLS } from "../../lib/editor";
import styles from "./style.module.scss";

const EditorJS = ({ content, title, excerpt }) => {
  const { faunaUser, setFaunaUser, refreshData } = useContext(ContextState);
  const [inputs, setInputs] = useState({
    title: title ?? "",
    excerpt: excerpt ?? "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const editorRef = useRef(null);

  let contenido = {};
  if (content) {
    contenido = {
      time: 1556098174501,
      blocks: content,
      version: "2.12.4",
    };
  } else {
    contenido = {
      time: 1556098174501,
      blocks: [
        {
          type: "header",
          data: {
            text: "Nueva nota.",
            level: 2,
          },
        },
        {
          type: "paragraph",
          data: {
            text: "Crea tu primer artículo",
          },
        },
      ],
      version: "2.12.4",
    };
  }

  const handleInputs = (e) => {
    const { name, value } = event.target;
    setInputs((prevstate) => ({ ...prevstate, [name]: value }));
  };

  const submit = async () => {
    if (inputs.title.length === 0 || inputs.excerpt.length === 0) {
      return;
    }
    setIsLoading(true);
    const savedData = await editorRef.current.save();
    let tags = [{ tag: "testing" }, { tag: "webapp" }];
    createOnePost(
      inputs.title,
      inputs.excerpt,
      savedData.blocks,
      tags,
      faunaUser.id
    )
      .then((output) => {
        setInputs({ title: "", excerpt: "" });
        editorRef.current.blocks.clear();
        refreshData();
      })
      .catch((err) => {
        console.log(err, "err");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <div className={styles.editorWrapper}>
      <button onClick={submit}> Publicar </button>
      <input
        name="title"
        value={inputs.title}
        onChange={(e) => handleInputs(e)}
      />
      <textarea
        name="excerpt"
        value={inputs.excerpt}
        onChange={(e) => handleInputs(e)}
      />
      <div className={styles.wrappEditor}>
        <EditorJs
          tools={EDITOR_JS_TOOLS}
          instanceRef={(instance) => (editorRef.current = instance)}
          data={contenido}
        />
      </div>
    </div>
  );
};

export default EditorJS;
