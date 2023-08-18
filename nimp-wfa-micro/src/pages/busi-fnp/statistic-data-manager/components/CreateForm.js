import { Modal } from 'antd';
import React, { useState, useEffect } from 'react';

const CreateForm = (props) => {
  const { modalVisible, onCancel, isNew } = props;
  console.log('isNew', isNew)
  const [btnText, setBtnText] = useState('添加');
  useEffect(() => {
    const text = !isNew ? '编辑' : '添加'
    setBtnText(text)
  }, [isNew])
  
  // const editFormRef = useRef(null);
  // useImperativeHandle(formRef, () => editFormRef.current);


  return (
    <Modal
      destroyOnClose
      title={btnText}
      width={420}
      open={modalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      {props.children}
    </Modal>
  );
};

export default CreateForm;
