import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, Popconfirm, Table, Typography, Button } from 'antd';
// import request from '@/utils/request';
// import { generateRandomId } from '@/utils';
import SelectComp from './SelectComp';

const tableComponentMaps = {
  select: (props) => {
    return <SelectComp {...props} />;
  },
  text: (props) => {
    return <Input {...props} />;
  },
};

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  options,
  ...restProps
}) => {
  const inputNode = tableComponentMaps[inputType] ? (
    tableComponentMaps[inputType]({ options })
  ) : (
    <Input />
  );
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `请输入 ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const SettingsTable = (props) => {
  const {
    columns = [],
    data = [],
    tableItemsShowType = {},
    optionsMap = {},
    form,
    editingKey,
    cancel = () => ({}),
  } = props;
  const [tableColumns, setTableColumns] = useState(columns);
  const [tableData, setTableData] = useState([]);
  // const [isEditing, setisEditing] = useState(second)
  // const [editingKey, setEditingKey] = useState('');
  // const isEditing = (record) => record.key === editingKey;
  useEffect(() => {
    setTableColumns(columns);
    setTableData(data);
  }, [columns, data]);

  const isEditing = useCallback(
    (record) => record.key === editingKey,
    [editingKey],
  );

  // const cancel = () => {
  //   setEditingKey('');
  // };

  // const handleAdd = () => {
  //   const count = tableData.length + 1;
  //   const newData = {
  //     uuid: generateRandomId(), // 随机生成一个uuid
  //     key: count,
  //     name: `航司 ${count}`,
  //     field: 'airline',
  //     type: `input`,
  //     isRequire: 0,
  //   };
  //   setTableData([...tableData, newData]);
  // };

  // const submit = useCallback(() => {
  //   request.post('/setTableParams', {
  //     tableData,
  //   });
  // }, [tableData]);

  const mergedColumns = tableColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: tableItemsShowType[col.dataIndex]
          ? tableItemsShowType[col.dataIndex]
          : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        options: optionsMap[col.dataIndex],
      }),
    };
  });

  return (
    <>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={tableData}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
    </>
  );
};

export default SettingsTable;
