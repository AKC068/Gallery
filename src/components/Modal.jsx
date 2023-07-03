import React, { useState, useEffect } from "react";
import { Modal } from "antd";

const PhotoModal = ({ visible, onClose, photo }) => {
  const size_suffix = "z";
  const [photoTitle, setPhotoTitle] = useState("");
  useEffect(() => {
    if (photo && photo.title.length > 0) {
      setPhotoTitle(photo.title);
    } else {
      setPhotoTitle("Untitled Image");
    }
  }, [photo]);

  return (
    <Modal
      open={visible}
      bodyStyle={{ padding: 15 }}
      onCancel={onClose}
      footer={null}
      title={photoTitle}
    >
      {photo && (
        <div>
          <img
            src={`https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_${size_suffix}.jpg`}
            alt={photo.title}
            style={{ width: "100%" }}
          />
          <p style={{ textAlign: "justify" }}>{photo.description._content}</p>
        </div>
      )}
    </Modal>
  );
};

export default PhotoModal;
