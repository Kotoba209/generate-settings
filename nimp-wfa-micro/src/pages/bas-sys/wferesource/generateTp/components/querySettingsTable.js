import React, {
  useState,
  useEffect,
  useCallback,
  useImperativeHandle,
} from 'react';
import { Form, Input, Popconfirm, Table, Typography, Button } from 'antd';
import request from '@/utils/request';
import { generateRandomId } from '@/utils';
// import SelectComp from './components/SelectComp';
import SettingsTable from './SettingsTable';

const tableItemsShowType = {
  type: 'select',
  isRequire: 'select',
};
const optionsMap = {
  type: [
    {
      value: 'input',
      label: '输入框',
    },
    {
      value: 'select',
      label: '单选',
    },
    {
      value: 'multipleSelect',
      label: '多选',
    },
    {
      value: 'date',
      label: '日期',
    },
  ],
  isRequire: [
    {
      value: 0,
      label: '否',
    },
    {
      value: 1,
      label: '是',
    },
  ],
};

const QuerySettingsTable = (props) => {
  const { queryRef } = props;
  const [form] = Form.useForm();
  const [queryFormData, setQueryFormData] = useState([
    {
      name: '航司',
      field: 'airline',
      type: 'input',
      isRequire: 1,
      key: generateRandomId(),
    }
  ]); // 查询表单数据
  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record) => record.key === editingKey;

  useImperativeHandle(queryRef, () => ({
    getData: () => queryFormData,
  }));

  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      field: '',
      type: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const del = (record) => {
    const { uuid } = record;
    const cpQueryFormData = JSON.parse(JSON.stringify(queryFormData));
    const index = cpQueryFormData.findIndex((item) => item.uuid === uuid);
    if (index > -1) {
      cpQueryFormData.splice(index, 1);
      setQueryFormData(cpQueryFormData);
    }
  };

  const queryFormDataSave = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...queryFormData];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setQueryFormData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setQueryFormData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleAdd = () => {
    const count = queryFormData.length + 1;
    const newData = {
      uuid: generateRandomId(), // 随机生成一个uuid
      key: generateRandomId(),
      name: `航司${count}`,
      field: 'airline',
      type: `input`,
      isRequire: 0,
    };
    setQueryFormData([...queryFormData, newData]);
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
      title: '类型',
      dataIndex: 'type',
      // width: '10%',
      editable: true,
    },
    {
      title: '是否必填',
      dataIndex: 'isRequire',
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
              onClick={() => queryFormDataSave(record.key)}
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
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
          marginRight: 15,
        }}
      >
        新增
      </Button>
      {/* <Button
        onClick={submit}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        保存
      </Button> */}

      <SettingsTable
        columns={columns}
        data={queryFormData}
        tableItemsShowType={tableItemsShowType}
        optionsMap={optionsMap}
        form={form}
        editingKey={editingKey}
        cancel={cancel}
      />
    </div>
  );
};

export default QuerySettingsTable;
