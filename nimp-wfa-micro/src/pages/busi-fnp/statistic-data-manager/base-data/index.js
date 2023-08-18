import { connect, /* KeepAlive */ /* patchKeepAlive */ } from 'umi';
import services from '@/services/demo';
import {
  // ActionType,
  FooterToolbar,
  // PageContainer,
  // ProDescriptions,
  // ProDescriptionsItemProps,
  ProTable,
  // ModalForm,
} from '@ant-design/pro-components';
import {
  Button,
  // Divider,
  // Drawer,
  message,
  // Row,
  Form,
  Popconfirm,
  Tooltip,
} from 'antd';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import CreateForm from '@/pages/busi-fnp/statistic-data-manager/components/CreateForm';
// import UpdateForm from '@/pages/busi-fnp/statistic-data-manager/components/UpdateForm';

const {
  addRegionOrder,
  queryList,
  deleteRegionOrder,
  modifyRegionOrder,
  getRegion,
  getAllCname,
} = services.UserController;

const TableList = (props) => {
  const { global } = props;
  const [createModalVisible, handleModalVisible] = useState(false);
  // const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  // const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  // const footerToolbarExtraRef = useRef();
  // const sideMenuWidthRef = useRef();
  const formRef = useRef();
  // const [row, setRow] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [baseList, setBaseList] = useState([]);
  const [allCname, setAllCname] = useState([]);
  const [selectedRowsState, setSelectedRows] = useState([]);
  const [updateId, setUpdateId] = useState(null);
  const [sideMenuWid, setSideMenuWid] = useState(global.sideMenuWidth);
  const [tableDataLoading, setTableDataLoading] = useState(false);
  // const [queryLoading, setQueryLoading] = useState(false);
  // const [delConfirm, setDelConfirm] = useState(false);
  const [form] = Form.useForm();
  // const [form] = ProTable.useFormInstance
  useEffect(() => {
    const fn = async () => {
      const regions = await getRegion();
      const allCname = await getAllCname();
      setBaseList(
        regions?.map((i) => ({
          label: i.content,
          value: i.id,
        })),
      );
      setAllCname(
        allCname?.map((i) => ({
          label: i.pChname,
          value: i.pThreeCode,
        })),
      );
      getList();
    };
    fn();
    // resp = resp.map(i => ({text: i.content, status: i.id}))
    // setBaseList(resp);
    // console.log('resp', resp)
  }, []);

  useEffect(() => {
    // const dom = footerToolbarExtraRef.current;
    // sideMenuWidthRef.current = global.sideMenuWidth;
    setSideMenuWid(global.sideMenuWidth);
  }, [global]);

  const getList = useCallback(async () => {
    let formValues = formRef.current?.getFieldsValue() || {};
    formValues = {
      ...formValues,
      baseAirport: formValues?.baseAirport?.join() || '',
    };
    setTableDataLoading(true);
    const resp = await queryList(formValues);
    setTableDataLoading(false);
    setDataSource(resp);
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

  const handleUpdate = useCallback(
    /**
     * 更新节点
     * @param fields
     */
    async (fields) => {
      const hide = message.loading('正在修改');
      try {
        await modifyRegionOrder({ ...fields });
        hide();
        message.success('修改成功');
        return true;
      } catch (error) {
        hide();
        return false;
      }
    },
    [],
  );
  /**
   *  删除节点
   */
  const handleRemove = useCallback(async (selectedRows) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;
    try {
      await deleteRegionOrder(selectedRows.map((row) => row.uuid).join() || '');
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

  const columns = [
    {
      title: '基地',
      dataIndex: 'baseAirport', // search: false,
      hideInTable: true,
      hideInForm: true, // 添加表单控制
      valueType: 'select',
      // colSize: 1,
      fieldProps: {
        mode: 'multiple',
        allowClear: true,
        maxTagCount: 2,
        options: baseList,
      },
    },
    {
      title: '基地',
      dataIndex: 'base', // search: false,
      hideInTable: true,
      // hideInForm: true, // 添加表单控制
      hideInSearch: true,
      valueType: 'select',
      fieldProps: {
        allowClear: true,
        options: allCname,
        labelInValue: true,
      },
    },
    {
      title: '基地码',
      dataIndex: 'planeName', // search: false,
      hideInSearch: true,
      hideInForm: true,
      align: 'center',
      // width: 340
    },
    {
      title: '基地中文名称',
      dataIndex: 'region', // search: false,
      hideInSearch: true,
      hideInForm: true,
      // width: 340,
      align: 'center',
    },
    {
      title: '顺序',
      dataIndex: 'orderNum',
      hideInSearch: true,
      align: 'center',
      // width: 340
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
              // handleUpdateModalVisible(true);
              handleModalVisible(true);
              const formValues = {
                ...record,
                base: { label: record.region, value: record.planeName },
              };
              console.log('formValues', formValues);
              console.log('form', form);
              setUpdateId(record.uuid);
              form.setFieldsValue(formValues);
            }}
          >
            编辑
          </a>
          {/* <Divider type="vertical" />
          <a href="">订阅警报</a> */}
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
        rowKey="uuid"
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
              onClick={() => handleModalVisible(true)}
              loading={tableDataLoading}
            >
              添加
            </Button>
          </>
        }
        // 表格右上内容
        // toolBarRender={() => [
        //   <Button
        //     key="export"
        //     type="primary"
        //     onClick={() => handleModalVisible(true)}
        //   >
        //     导出
        //   </Button>,
        // ]}
        // request={async (params, sorter, filter) => {
        //   const data = await queryList({
        //     ...params,
        //     baseAirport: 'ALL',
        //   });
        //   return {
        //     data: data
        //   };
        // }}
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
          selectedRowKeys: selectedRowsState.map((i) => i.uuid),
          // getCheckboxProps: (record) => ({
          //   disabled:
          //     selectedRowsState.length >= 1
          //       ? selectedRowsState.map((i) => i.uuid).includes(record.uuid) ===
          //         false
          //       : false,
          // }),
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
            title={selectedRowsState.length > 1 ? '每次只能删除一条' : ''}
          >
            <Popconfirm
              title="提示"
              description="确定要删除所选项吗?"
              onConfirm={async () => {
                await handleRemove(selectedRowsState);
                setSelectedRows([]);
                getList();
                // actionRef.current?.reloadAndRest?.();
              }}
              disabled={selectedRowsState.length > 1}
              // onCancel={cancel}
              okText="确定"
              cancelText="取消"
            >
              <Button danger disabled={selectedRowsState.length > 1}>
                删除
              </Button>
            </Popconfirm>
          </Tooltip>
          {/* <Button>
            删除
          </Button> */}
          {/* <Button type="primary">批量审批</Button> */}
        </FooterToolbar>
      )}
      <CreateForm
        onCancel={() => {
          handleModalVisible(false);
          setUpdateId(null);
          form.resetFields();
        }}
        modalVisible={createModalVisible}
        isNew={!updateId}
      >
        <ProTable
          form={{
            form,
            // initialValues:{
            //   'planeName': 3
            // }
          }}
          onSubmit={async (value) => {
            console.log('value', value);
            let success = null;
            const { base, orderNum } = value;
            const formValues = {
              uuid: updateId,
              orderNum,
              planeName: base.value,
              region: base.label.split('-')[1],
            };
            if (updateId) {
              success = await handleUpdate(formValues);
            } else {
              success = await handleAdd(formValues);
            }

            if (success) {
              handleModalVisible(false);
              getList();
              setUpdateId(null);
              form.resetFields();
              // if (actionRef.current) {
              // }
            }
          }}
          type="form"
          columns={columns}
        />
      </CreateForm>
      {/* {stepFormValues && Object.keys(stepFormValues).length ? (
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
      ) : null} */}

      {/* <Drawer
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
      </Drawer> */}
    </div>
  );
};

export default connect((state) => {
  const global = state.global;
  return {
    global,
  };
})(TableList);
