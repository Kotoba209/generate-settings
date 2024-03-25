import React, { useState, useRef, useEffect } from 'react';
import { history, useLocation } from 'umi';
import { Layout, Button, Card, Input, message, Row, Col } from 'antd';
import request from '@/utils/request';
import { formatSettingsData } from '@/utils';
import QuerySettingsTable from './components/querySettingsTable';
import HeadSettingsTable from './components/headSettingsTable';
import SaveForm from './components/SaveForm';

const { TextArea } = Input;

const headerStyle = {
  // textAlign: 'center',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: '#fff',
};

const JsonConfigExample = `[
  {
    "fields": ["airline", "airline1", "airline2"], // 第一级显要示的字段
    "dataName": "list", // 实际子列表名称，可自定义,下方的 list 要在模板中使用，不可修改名称
    "list": [
      {
        "fields": ["fltNo", "aircrftType"] // 子列表要显示的字段
      }
    ]
  }
]`;

const { Header, Content } = Layout;

const isValidJson = (str) => {
  console.log('str', str);
  if (!str) {
    return;
  }
  try {
    let jsonStr = JSON.parse(str);
    if (!Array.isArray(jsonStr)) {
      message.warning('显示列表配置信息应为有效的数组格式');
      return false;
    }
    return true;
  } catch (e) {
    message.warning('请输入有效的 JSON 格式');
    return false;
  }
};
const getconfigBodyFieldsLen = (body, totalFieldsLen) => {
  body.forEach((item) => {
    totalFieldsLen = totalFieldsLen + item.fields.length;
    if (item.list) {
      totalFieldsLen = getconfigBodyFieldsLen(item.list, totalFieldsLen);
    }
  });
  return totalFieldsLen;
};

const isValidHeadAndConfigBody = (head, body) => {
  let headList = [];
  let totalFieldsLen = 0;
  const index = head.findIndex(
    (item) => item.children && item.children.length > 0,
  );
  if (index !== -1) {
    headList = [...head[index].children];
    head.splice(index, 1);
  }
  headList = [...headList, ...head];
  totalFieldsLen = getconfigBodyFieldsLen(JSON.parse(body), totalFieldsLen);

  if (head.length !== totalFieldsLen) {
    message.warning(
      `表头和表格列表显示字段数量不一致，head：${head.length}，body：${totalFieldsLen}`,
    );
    return false;
  }
  return true;
};

export default function index() {
  const [bodyJsonConfig, setBodyJsonConfig] = useState('');
  const [saveModalVisible, handleSaveModalVisible] = useState(false);
  const [saveFormValues, setSaveFormValues] = useState({});
  const [isCopy, setIsCopy] = useState(false);
  const queryFormRef = useRef();
  const headTableRef = useRef();
  const location = useLocation();
  const { query: { id } } = location;
  // const id = pathname.split('id=')[1];

  useEffect(() => {
    const fetchSettingById = () => {
      if (!id) return;
      request.get(`/node-serve/getSetting/${id}`).then((resp) => {
        const { code, msg, data } = resp;
        if (code !== 0) {
          return message.error(msg || '查询失败');
        }
        message.success('查询成功');
        const {
          headData,
          queryFormData,
          bodyJsonConfig,
          settingsName,
          configDesc,
        } = formatSettingsData(data);
        setBodyJsonConfig(bodyJsonConfig);
        setSaveFormValues({ settingsName, configDesc });
        queryFormRef.current.setData(queryFormData);
        headTableRef.current.setData(headData);
      });
    };
    fetchSettingById();
  }, []);

  const generate = () => {
    console.log(queryFormRef.current.getData());
    const queryFormData = queryFormRef.current.getData();
    const headData = headTableRef.current.getData();
    // const headData = [
    //   {
    //     key: '7rjJ8lgYeD',
    //     name: '航司',
    //     field: 'airline',
    //     rowSpan: 1,
    //     colSpan: 1,
    //     uuid: 'BeSSb0CyUe',
    //   },
    //   {
    //     uuid: 'CKKsqhg3Dq',
    //     key: '8h5Ew1kPwt',
    //     name: '航班号',
    //     field: 'fltNo',
    //     rowSpan: 1,
    //     colSpan: 1,
    //   },
    //   {
    //     uuid: 'bh56wuon1N',
    //     key: 'Hu8PwlQ79Y',
    //     name: '到达站',
    //     field: 'arrive',
    //     rowSpan: 1,
    //     colSpan: 1,
    //   },
    //   {
    //     uuid: 'fdxrFypWIQ',
    //     key: 'w7JUOnF29Y',
    //     name: '出发站',
    //     field: 'dep',
    //     rowSpan: 1,
    //     colSpan: 1,
    //   },
    //   {
    //     uuid: 'vl9kW6DVme',
    //     key: 'gxSYk790i2',
    //     name: '开始日期',
    //     field: 'startDate',
    //     rowSpan: 1,
    //     colSpan: 1,
    //   },
    //   {
    //     uuid: 'lN5L0uLPTB',
    //     key: 'MfykdxjYKn',
    //     name: '结束日期',
    //     field: 'endDate',
    //     rowSpan: 1,
    //     colSpan: 1,
    //   },
    // ];
    if (
      (bodyJsonConfig && !isValidJson(bodyJsonConfig)) ||
      (bodyJsonConfig && !isValidHeadAndConfigBody(headData, bodyJsonConfig))
    ) {
      return;
    }
    console.log('bodyJsonConfig', bodyJsonConfig)
    request
      .post(
        '/node-serve/setTableParams',
        {
          queryFormData,
          headData,
          bodyJsonConfig: bodyJsonConfig ? JSON.parse(bodyJsonConfig) : {},
        },
        true,
      )
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
  
  const copy = () => {
    handleSaveModalVisible(true);
    setIsCopy(true);
  }

  const save = (settingsParam) => {
    let url = '/node-serve/setSettings';
    const { settingsName, configDesc } = settingsParam;
    const queryFormData = queryFormRef.current.getData();
    console.log('bodyJsonConfig', bodyJsonConfig);
    const headData = headTableRef.current.getData();
    // const headData = [
    //   {
    //     key: '7rjJ8lgYeD',
    //     name: '航司',
    //     field: 'airline',
    //     rowSpan: 1,
    //     colSpan: 1,
    //     uuid: 'BeSSb0CyUe',
    //   },
    //   {
    //     uuid: 'CKKsqhg3Dq',
    //     key: '8h5Ew1kPwt',
    //     name: '航班号',
    //     field: 'fltNo',
    //     rowSpan: 1,
    //     colSpan: 1,
    //   },
    //   {
    //     uuid: 'bh56wuon1N',
    //     key: 'Hu8PwlQ79Y',
    //     name: '到达站',
    //     field: 'arrive',
    //     rowSpan: 1,
    //     colSpan: 1,
    //   },
    //   {
    //     uuid: 'fdxrFypWIQ',
    //     key: 'w7JUOnF29Y',
    //     name: '出发站',
    //     field: 'dep',
    //     rowSpan: 1,
    //     colSpan: 1,
    //   },
    //   {
    //     uuid: 'vl9kW6DVme',
    //     key: 'gxSYk790i2',
    //     name: '开始日期',
    //     field: 'startDate',
    //     rowSpan: 1,
    //     colSpan: 1,
    //   },
    //   {
    //     uuid: 'lN5L0uLPTB',
    //     key: 'MfykdxjYKn',
    //     name: '结束日期',
    //     field: 'endDate',
    //     rowSpan: 1,
    //     colSpan: 1,
    //   },
    // ];
    if (!queryFormData && !headData && !bodyJsonConfig) {
      return;
    }
    if (
      (!!bodyJsonConfig && !isValidJson(bodyJsonConfig)) ||
      (bodyJsonConfig && !isValidHeadAndConfigBody(headData, bodyJsonConfig))
    ) {
      return;
    }
    const childHead = headData[0].children || [];
    let queryField = queryFormData?.map((i) => i.field).join(',');
    let queryName = queryFormData?.map((i) => i.name).join(',');
    let queryType = queryFormData?.map((i) => i.type).join(',');
    let queryIsRequire = queryFormData?.map((i) => i.isRequire).join(',');
    let headField = headData?.map((i) => i.field).join(',');
    let headName = headData?.map((i) => i.name).join(',');
    let headRowSpan = headData?.map((i) => i.rowSpan).join(',');
    let headColSpan = headData?.map((i) => i.colSpan).join(',');
    let childHeadField = childHead?.map((i) => i.field).join(',');
    let childHeadName = childHead?.map((i) => i.name).join(',');
    let childHeadRowSpan = childHead?.map((i) => i.rowSpan).join(',');
    let childHeadColSpan = childHead?.map((i) => i.colSpan).join(',');

    request
      .post(url, {
        id: id && !isCopy ? id : '',
        queryField,
        queryName,
        queryType,
        queryIsRequire,
        headField,
        headName,
        headRowSpan,
        headColSpan,
        childHeadField,
        childHeadName,
        childHeadRowSpan,
        childHeadColSpan,
        settingsName,
        configDesc,
        bodyJsonConfig: bodyJsonConfig ? JSON.parse(bodyJsonConfig) : '',
      })
      .then((resp) => {
        handleSaveModalVisible(false);
        const { code, msg } = resp;
        if (code === 0) {
          message.success(msg);
        } else {
          message.error(msg);
        }
      })
      .catch((err) => {
        handleSaveModalVisible(false);
        message.error(err);
      });
  };

  const handleJumpList = () => {
    // history.push('/main/micro-app/portal/list/settings-list;data=233');
    if (id) {
      history.goBack();
      return;
    }
    history.push('/main/settings');
    // window.location.href = '/main/settings';
  };

  return (
    <>
      <Layout>
        <Header style={headerStyle}>
          <Button type="primary" onClick={generate} style={{ marginRight: 15 }}>
            生成
          </Button>
          <Button
            type="primary"
            onClick={() => handleSaveModalVisible(true)}
            style={{ marginRight: 15 }}
          >
            保存
          </Button>
          {id && (
            <Button type="primary" onClick={() => copy()} style={{ marginRight: 15 }}>
              复制
            </Button>
          )}
          <Button type="primary" onClick={() => handleJumpList()} style={{ marginRight: 15 }}>
            历史配置
          </Button>
          {/* {id && (
            <Button type="primary" onClick={() => handleJumpList()}>
              返回
            </Button>
          )} */}
        </Header>
        <Content>
          <Card title="查询表单配置" bordered={false}>
            <QuerySettingsTable queryRef={queryFormRef} />
          </Card>
          <Card title="表头配置(包含一般列表显示)" bordered={false}>
            <HeadSettingsTable headRef={headTableRef} />
          </Card>
          <Card title="特殊显示列表配置" bordered={false}>
            <Row>
              <Col span={12}>
                <span>请输入JSON格式:</span>
                <TextArea
                  rows={11}
                  value={bodyJsonConfig}
                  onChange={(e) => {
                    setBodyJsonConfig(e.target.value);
                  }}
                />
              </Col>
              <Col span={12}>
                <span>
                  JSON 示例（复制下列信息至{' '}
                  <a href="https://www.json.cn/" target="_blank">
                    JSON解析
                  </a>{' '}
                  进行格式化）:
                </span>
                <TextArea
                  disabled
                  rows={11}
                  value={JsonConfigExample}
                  style={{ color: '#000' }}
                />
              </Col>
            </Row>
          </Card>
        </Content>
        <SaveForm
          onSubmit={async (value) => {
            console.log('value', value);
            // const success = await handleUpdate(value);
            save(value);
          }}
          onCancel={() => {
            handleSaveModalVisible(false);
            // setStepFormValues({});
          }}
          saveModalVisible={saveModalVisible}
          values={saveFormValues}
        />
      </Layout>
    </>
  );
}
