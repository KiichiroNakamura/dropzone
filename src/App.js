import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import "./styles.css";

// const img = {
//   display: "block",
//   maxWidth: "260px",
//   maxHeight: "200px",
//   height: "200px",
//   objectFit: "cover"
// };

export default function App() {
  const [files, setFiles] = useState([]);
  const [fileErrors, setfileErrors] = useState([]);
  const MAX_SIZE = 2000000;

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    accept: "image/jpg, image/jpeg, image/png, image/gif",
    maxSize: MAX_SIZE,
    onDrop: (acceptedFiles, rejectedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
      setfileErrors(rejectedFiles.length > 0 ? rejectedFiles[0].errors : []);
      showText = files.length === 0;
    },
    onDragEnter: () => {
      setFiles([]);
      setfileErrors([]);
    }
  });

  let classes = "dropzone";
  let showText = files.length === 0;

  const additionalClass = isDragAccept
    ? `${classes} accept`
    : isDragReject
    ? `${classes} reject`
    : classes;

  const previewStyle = {
    display: "block",
    maxWidth: "260px",
    maxHeight: "100px",
    height: "100px",
    objectFit: "scale-down"
  };

  const iconStyle = {
    display: "block",
    width: "48px",
    height: "48px"
    // "text-align": "center",
    // "align-content": "center",
    // "flex-direction": "column"
  };

  const revokeDataUri = (files) => {
    files.forEach((file) => URL.revokeObjectURL(file.preview));
  };

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      // files.forEach((file) => URL.revokeObjectURL(file.preview));
      revokeDataUri(files);
    },
    [files]
  );

  const onClickHandler = () => {
    // files.forEach((file) => URL.revokeObjectURL(file.preview));
    revokeDataUri(files);
    setFiles([]);
    setfileErrors([]);
    alert("This will remove image preview and logo from farm");
  };

  const onSubmitHandler = () => alert("This will save to S3 as the farm logo");

  const errors = {
    FILESIZE: "More than 2MB in size",
    FILETYPE: "Not an image file"
  };

  const getErrorMessage = () => {
    switch (fileErrors[0].code) {
      case "file-invalid-type":
        return <p className={"error"}>{errors.FILETYPE}</p>;
      case "file-too-large":
        return <p className={"error"}>{errors.FILESIZE}</p>;
      default:
        return <p className={"error"}>File error</p>;
    }
  };

  return (
    <section className="container">
      <div {...getRootProps({ className: `${additionalClass}` })}>
        <input {...getInputProps()} />
        {isDragActive ? (
          isDragReject ? (
            <p>Not an image file</p>
          ) : (
            <p>Drop file here ...</p>
          )
        ) : (
          showText &&
          (fileErrors.length > 0 ? (
            getErrorMessage()
          ) : (
            <img
              alt="upload"
              key={1}
              src={"~/public/upload-illustration@2x.png"}
              style={iconStyle}
            />
            // <>
            //   {/* <p>[ .jpg, .jpeg, .png, .gif ]</p>
            //   <p>2MB max size</p> */}
            //   <p>
            //     Drag and drop your logo image file here, or click to select
            //     files
            //   </p>
            // </>
          ))
        )}
        {files.map((file) => (
          <img
            alt="Preview"
            key={file.preview}
            src={file.preview}
            style={previewStyle}
          />
        ))}
      </div>
      <button className={"remove"} onClick={onClickHandler}>
        Remove image
      </button>
      <button onClick={onSubmitHandler}>Save image</button>
    </section>
  );
}
