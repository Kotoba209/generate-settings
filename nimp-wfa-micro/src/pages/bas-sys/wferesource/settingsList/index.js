import { connect, history /* KeepAlive */ /* patchKeepAlive */ } from 'umi';
import services from '@/services';
import {
  // ActionType,
  FooterToolbar,
  ProTable,
} from '@ant-design/pro-components';
import {
  Button,
  Divider,
  // Drawer,
  message,
  // Row,
  Form,
  Popconfirm,
  Tooltip,
} from 'antd';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import request from '@/utils/request';
import { formatSettingsData } from '@/utils';
// import SaveForm from '../generateTp/SaveForm';

const {
  addRegionOrder,
  queryList,
  deleteSetting,
  modifyRegionOrder,
  getRegion,
  getAllCname,
} = services.PageSettings;

const TableList = (props) => {
  const { global } = props;
  const actionRef = useRef();
  const formRef = useRef();
  const [dataSource, setDataSource] = useState([]);
  const [selectedRowsState, setSelectedRows] = useState([]);
  const [sideMenuWid, setSideMenuWid] = useState(global.sideMenuWidth);
  const [tableDataLoading, setTableDataLoading] = useState(false);
  // const [queryLoading, setQueryLoading] = useState(false);
  // const [delConfirm, setDelConfirm] = useState(false);
  const [form] = Form.useForm();
  // const [form] = ProTable.useFormInstance

  const getList = useCallback(async () => {
    let formValues = formRef.current?.getFieldsValue() || {};
    formValues = {
      ...formValues,
    };
    setTableDataLoading(true);
    const resp = (await queryList(formValues)) || [];
    console.log('resp', resp);
    setTableDataLoading(false);
    const { code, msg, data } = resp;
    if (code !== 0) {
      return message.error(msg || '查询失败');
    }
    if (Array.isArray(data)) {
      setDataSource(data);
    }
  }, [formRef]);

  useEffect(() => {
    // const dom = footerToolbarExtraRef.current;
    // sideMenuWidthRef.current = global.sideMenuWidth;
    setSideMenuWid(global.sideMenuWidth);
  }, [global]);

  useEffect(() => {
    getList();
  }, []);

  /**
   * 添加节点
   */
  const handleAdd = useCallback(async (fields) => {
    const hide = message.loading('正在添加');
    try {
      await addRegionOrder({ ...fields });
      hide();
      message.success('添加成功');
      return true;
    } catch (error) {
      console.log('error', error);
      hide();
      return false;
    }
  }, []);
  /**
   *  删除节点
   */
  const handleRemove = useCallback(async (selectedRows) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;
    try {
      await deleteSetting(selectedRows.map((row) => row._id).join() || '');
      hide();
      message.success('删除成功');
      getList();
      return true;
    } catch (error) {
      hide();
      message.error('删除失败');
      return false;
    }
  }, []);

  const generatePreviewCode = (record) => {
    const { headData, queryFormData, bodyJsonConfig } =
      formatSettingsData(record);
    const parmas = {
      headData,
      queryFormData,
      // settingsName,
      // configDesc,
      bodyJsonConfig: bodyJsonConfig ? JSON.parse(bodyJsonConfig) : '',
    };
    request
      .post('/node-serve/setTableParams', {
        ...parmas,
      })
      .then((resp) => {
        const { code, msg } = resp;
        if (code === 0) {
          message.success(msg);
        } else {
          message.error(msg);
        }
      })
      .catch((err) => {
        message.error(err);
      });
  };

  const delSettingById = async (record) => {
    const { _id } = record;
    console.log('_id', _id);
    if (!_id) return;
    const data = await deleteSetting(_id);
    const { code, msg } = data;
    if (code !== 0) {
      return message.error(msg);
    }
    message.success(msg);
    getList();
  };

  const columns = [
    {
      title: '配置名称',
      dataIndex: 'settingsName', // search: false,
      // hideInTable: true,
      hideInForm: true, // 添加表单控制
      // hideInSearch: true,
      align: 'center',
    },
    {
      title: '配置描述',
      dataIndex: 'configDesc', // search: false,
      hideInSearch: true,
      hideInForm: true,
      align: 'center',
      // width: 340
    },
    // {
    //   title: '基地中文名称',
    //   dataIndex: 'region', // search: false,
    //   hideInSearch: true,
    //   hideInForm: true,
    //   // width: 340,
    //   align: 'center',
    // },
    {
      title: '查询表单字段名称',
      dataIndex: 'queryName',
      hideInSearch: true,
      hideInForm: true,
      align: 'center',
      // width: 340
    },
    {
      title: '配置表头',
      dataIndex: 'headName',
      hideInSearch: true,
      hideInForm: true,
      align: 'center',
      // width: 340
    },
    {
      title: '自定义配置JSON',
      dataIndex: 'bodyJsonConfig',
      hideInSearch: true,
      hideInForm: true,
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      align: 'center',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              history.push(
                `/main/micro-app/portal/list/generate-tp;id=${record._id}`,
              );
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              generatePreviewCode(record);
            }}
          >
            生成
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="确定删除吗?"
            onConfirm={() => delSettingById(record)}
          >
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <ProTable
        actionRef={actionRef}
        formRef={formRef}
        tableClassName="tableName"
        rowKey="_id"
        tableAlertRender={false}
        search={{
          // searchText: '查询',
          // resetText: '清空',
          labelWidth: 'auto',
          span: 7,
          optionRender: false,
          // layout: 'horizontal',
        }}
        headerTitle={
          <>
            <Button
              key="query"
              type="primary"
              onClick={() => {
                getList();
              }}
              style={{ marginRight: 8 }}
              loading={tableDataLoading}
            >
              查询
            </Button>
            <Button
              key="reset"
              type="primary"
              onClick={() => {
                formRef?.current.resetFields();
              }}
              style={{ marginRight: 8 }}
              loading={tableDataLoading}
            >
              重置
            </Button>
            <Button
              key="add"
              type="primary"
              onClick={() => {}}
              loading={tableDataLoading}
            >
              添加
            </Button>
          </>
        }
        options={{
          fullScreen: true,
          reload: false,
          setting: true,
          density: false,
        }} // 表格小工具
        pagination={false} // 分页
        dataSource={dataSource}
        columns={columns}
        loading={tableDataLoading}
        rowSelection={{
          columnTitle: ' ', // 去掉全选
          hideDefaultSelections: true, // 去掉全选
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
          selectedRowKeys: selectedRowsState.map((i) => i._id),
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
          <Tooltip
            placement="top"
            // title={selectedRowsState.length > 1 ? '每次只能删除一条' : ''}
          >
            <Popconfirm
              title="提示"
              description="确定要删除所选项吗?"
              onConfirm={async () => {
                await handleRemove(selectedRowsState);
                setSelectedRows([]);
                getList();
              }}
              okText="确定"
              cancelText="取消"
            >
              <Button danger>
                删除
              </Button>
            </Popconfirm>
          </Tooltip>
        </FooterToolbar>
      )}
    </div>
  );
};

export default connect((state) => {
  const global = state.global;
  return {
    global,
  };
})(TableList);
