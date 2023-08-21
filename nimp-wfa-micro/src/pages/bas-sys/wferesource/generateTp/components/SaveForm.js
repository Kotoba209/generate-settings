import {
  ModalForm,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
// import { Modal, message } from 'antd';
import React, { useRef, useEffect } from 'react';

const SaveForm = (props) => {
  const restFormRef = useRef();
  const { values, saveModalVisible } = props;
  useEffect(() => {
    if (Object.keys(values).length === 0 || !saveModalVisible) return;
    restFormRef.current?.setFieldsValue(values);
  }, [values, restFormRef, saveModalVisible]);

  return (
    <ModalForm
      title="保存配置"
      formRef={restFormRef}
      open={props.saveModalVisible}
      modalProps={{
        onCancel: () => {
          props.onCancel();
        },
      }}
      submitter={{
        searchConfig: {
          resetText: '取消',
        },
        resetButtonProps: {
          onClick: () => {
            restFormRef.current?.resetFields();
            //   setModalVisible(false);
            props.onCancel();
          },
        },
      }}
      onFinish={async (values) => {
        // await waitTime(2000);
        props.onSubmit(values);
        return true;
      }}
    >
      <ProFormText
        width="md"
        name="settingsName"
        label="配置名称"
        placeholder="请输入名称"
        rules={[{ required: true, message: '请输入配置名称' }]}
      />

      <ProFormTextArea
        width="md"
        name="configDesc"
        label="配置描述"
        placeholder="请输入描述"
      />
    </ModalForm>
  );
};

export default SaveForm;
