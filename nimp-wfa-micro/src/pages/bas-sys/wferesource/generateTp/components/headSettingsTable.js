import React, { useState, useImperativeHandle } from 'react';
import {
  Form,
  Input,
  Popconfirm,
  Typography,
  Button,
  Modal,
  Row,
  Col,
  message,
} from 'antd';
import { generateRandomId } from '@/utils';
// import SelectComp from './components/SelectComp';
import SettingsTable from './SettingsTable';

const HeadSettingsTable = (props) => {
  const { headRef } = props;
  const [form] = Form.useForm();
  const [headFormData, setHeadFormData] = useState([
    {
      key: generateRandomId(),
      name: '航司',
      field: 'airline',
      rowSpan: 1,
      colSpan: 1,
      uuid: generateRandomId(),
    },
  ]);
  const [editingKey, setEditingKey] = useState('');
  const [rowCount, setRowCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isEditing = (record) => record.key === editingKey;

  useImperativeHandle(headRef, () => ({
    getData: () => headFormData,
    setData: (data) => setHeadFormData(data),
  }));

  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      field: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const del = (record) => {
    const { uuid } = record;
    const cpheadFormData = JSON.parse(JSON.stringify(headFormData));
    const index = cpheadFormData.findIndex((item) => item.uuid === uuid);
    if (index > -1) {
      cpheadFormData.splice(index, 1);
      setHeadFormData(cpheadFormData);
    }
  };

  const headFormDataSave = async (uuid) => {
    try {
      const row = await form.validateFields();
      const newData = [...headFormData];
      let index = newData.findIndex((item) => uuid === item.uuid);
      let isUpdateChild = false;
      if (index < 0 && newData[0].children) {
        index = newData[0].children.findIndex((item) => uuid === item.uuid);
        if (index > -1) {
          isUpdateChild = true;
        }
      }
      if (index > -1) {
        let item = newData[index];
        if (isUpdateChild) {
          item = newData[0].children[index];
          newData[0].children[index] = { ...item, ...row };
        } else {
          newData.splice(index, 1, {
            ...item,
            ...row,
          });
        }

        setHeadFormData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setHeadFormData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleAddCol = () => {
    const count = headFormData.length + 1;
    const newData = {
      uuid: generateRandomId(), // 随机生成一个uuid
      key: generateRandomId(),
      name: `航司${count}`,
      field: `airline${count}`,
      rowSpan: 1,
      colSpan: 1,
      // children: [],
    };
    setHeadFormData([...headFormData, newData]);
  };

  const handleOk = () => {
    if (!headFormData[rowCount]) {
      return message.warning(`列表第${rowCount}行不存在，请先添加对应列`);
    }
    const list = headFormData[rowCount].children || [];
    const count = list.length + 1;
    const newData = {
      uuid: generateRandomId(), // 随机生成一个uuid
      key: generateRandomId(),
      name: `航司${count}`,
      field: `airline${count}`,
      rowSpan: 1,
      colSpan: 1,
    };
    headFormData[rowCount].children = [...list, newData];
    setHeadFormData([...headFormData]);
    setRowCount(0);
    setIsModalOpen(false);
  };

  const handleAddRow = () => {
    if (headFormData.length < 1) {
      return message.warning('请先添加列');
    }
    setIsModalOpen(true);
    // setHeadFormData([...headFormData, newData]);
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      width: '20%',
      editable: true,
    },
    {
      title: '字段',
      dataIndex: 'field',
      width: '15%',
      editable: true,
    },
    {
      title: '行占比',
      dataIndex: 'rowSpan',
      // width: '10%',
      editable: true,
    },
    {
      title: '列占比',
      dataIndex: 'colSpan',
      // width: '10%',
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => headFormDataSave(record.uuid)}
              style={{
                marginRight: 8,
              }}
            >
              保存
            </Typography.Link>
            <Popconfirm title="确定取消吗?" onConfirm={cancel}>
              <a>取消</a>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Typography.Link
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
            >
              编辑
            </Typography.Link>
            <span style={{ marginLeft: 15 }}>
              <Popconfirm title="确定删除吗?" onConfirm={() => del(record)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <Button
        onClick={handleAddCol}
        type="primary"
        style={{
          marginBottom: 16,
          marginRight: 15,
        }}
      >
        新增列
      </Button>
      <Button
        onClick={handleAddRow}
        type="primary"
        style={{
          marginBottom: 16,
          marginRight: 15,
        }}
      >
        新增行
      </Button>
      <SettingsTable
        columns={columns}
        data={headFormData}
        form={form}
        editingKey={editingKey}
        cancel={cancel}
      />
      <Modal
        title="表头新增行"
        open={isModalOpen}
        onOk={handleOk}
        okText="确定"
        cancelText="取消"
        onCancel={() => setIsModalOpen(false)}
      >
        <Row gutter={16} style={{ display: 'flex', alignItems: 'center' }}>
          <Col className="gutter-row" span={6}>
            在第几行增加行
          </Col>
          <Col className="gutter-row" span={6}>
            <Input
              disabled
              value={rowCount}
              onChange={(e) => setRowCount(e.target.value)}
            />
          </Col>
        </Row>
        <Row gutter={16} style={{ color: '#bc261a' }}>
          目前仅支持添加在第一列，如需自定义，请自行修改源码
        </Row>
      </Modal>
    </div>
  );
};

export default HeadSettingsTable;
