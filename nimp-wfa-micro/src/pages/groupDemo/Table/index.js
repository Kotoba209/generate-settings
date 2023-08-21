import { connect, KeepAlive /* patchKeepAlive */ } from 'umi';
import services from '@/services/index';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, Drawer, message, Row } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';

const { addUser, queryList, deleteUser, modifyUser } =
  services.UserController;

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields) => {
  // patchKeepAlive((config) => {
  //   // 这里可以获取到最新的 keepalive 配置
  //   config.push('/main/micro-app/portal/page1:query');
  //   console.log('config', config);
  //   // 操作配置之后返回
  //   return config;
  // });
  const hide = message.loading('正在添加');
  try {
    await addUser({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields) => {
  const hide = message.loading('正在配置');
  try {
    await modifyUser(
      {
        userId: fields.id || '',
      },
      {
        name: fields.name || '',
        nickName: fields.nickName || '',
        email: fields.email || '',
      },
    );
    hide();

    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await deleteUser({
      userId: selectedRows.find((row) => row.id)?.id || '',
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const tableListDataSource = [];
const creators = ['付小小', '曲丽丽', '林东东', '陈帅帅', '兼某某'];

for (let i = 0; i < 10; i += 1) {
  tableListDataSource.push({
    id: i,
    nickName: 'AppName',
    containers: Math.floor(Math.random() * 20),
    name: creators[Math.floor(Math.random() * creators.length)],
    gender: i % 2 === 1 ? '男' : '女',
    createdAt: Date.now() - Math.floor(Math.random() * 2000),
    money: Math.floor(Math.random() * 2000) * i,
    progress: Math.ceil(Math.random() * 100) + 1,
    memo:
      i % 2 === 1
        ? '很长很长很长很长很长很长很长的文字要展示但是要留下尾巴'
        : '简短备注文案',
  });
}

const TableList = (props) => {
  const { global } = props;
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  const footerToolbarExtraRef = useRef();
  const sideMenuWidthRef = useRef();
  const [row, setRow] = useState();
  const [sideMenuWid, setSideMenuWid] = useState(global.sideMenuWidth)
  const [selectedRowsState, setSelectedRows] = useState([]);
  console.log('props233', props)
  useEffect(() => {
    console.log('footerToolbarExtraRef', footerToolbarExtraRef)
    const dom = footerToolbarExtraRef.current;
    console.log('dom', dom)
    console.log('global.sideMenuWidth', global)
    sideMenuWidthRef.current = global.sideMenuWidth
    console.log('sideMenuWidthRef.current', sideMenuWidthRef.current)
    setSideMenuWid(global.sideMenuWidth)
    // setSideMenuWid()
    // dom.style.left =  global.sideMenuWidth;
    // dom.style.width =  `100% - ${global.sideMenuWidth}px`;
  }, [global, footerToolbarExtraRef])
  
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      // tip: '名称是唯一的 key',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '名称为必填项',
          },
        ],
      },
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
      valueType: 'text',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      hideInForm: true,
      valueEnum: {
        0: { text: '男', status: 'MALE' },
        1: { text: '女', status: 'FEMALE' },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      search: false,
    },
    {
      title: '备注',
      dataIndex: 'memo',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
          >
            配置
          </a>
          <Divider type="vertical" />
          <a href="">订阅警报</a>
        </>
      ),
    },
  ];

  return (
    <div>
      <ProTable
        actionRef={actionRef}
        tableClassName="tableName"
        rowKey="id"
        search={{
          labelWidth: 'auto',
          span: 6,
          optionRender: () => <></>,
          // layout: 'horizontal',
        }}
        headerTitle={
          <>
            <Button
              key="primary"
              type="primary"
              onClick={() => {
                alert('query');
              }}
              style={{ marginRight: 8 }}
            >
              查询
            </Button>
            <Button
              key="1"
              type="primary"
              onClick={() => handleModalVisible(true)}
            >
              添加
            </Button>
          </>
        }
        toolBarRender={() => [
          <Button
            key="1"
            type="primary"
            onClick={() => handleModalVisible(true)}
          >
            导出
          </Button>,
        ]}
        request={async (params, sorter, filter) => {
          const res = await queryList({
            ...params,
            baseAirport: "ALL"
          });
          // console.log('data123', res);
          return {
            data: tableListDataSource,
            // success,
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          style={{
            zIndex: 9999,
            left: sideMenuWid,
            width: `calc(100% - ${sideMenuWid}px)`,
          }}
          extra={
            <div>
              已选择{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              项&nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
          <Button type="primary">批量审批</Button>
        </FooterToolbar>
      )}
      <CreateForm
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      >
        <ProTable
          onSubmit={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="id"
          type="form"
          columns={columns}
        />
      </CreateForm>
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value);
            if (success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}

      <Drawer
        width={600}
        open={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.name && (
          <ProDescriptions
            column={2}
            title={row?.name}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.name,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </div>
  );
};

const TableA = connect((state) => {
  const global = state.global;
  return {
    global,
  };
})(TableList)

export default () => (
  // <KeepAlive name="page1">
    <TableA />
  // </KeepAlive>
);
