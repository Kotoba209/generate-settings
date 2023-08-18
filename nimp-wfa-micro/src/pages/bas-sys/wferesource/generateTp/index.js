import React, { useState, useRef } from 'react';
import { Layout, Button, Card, Input, message, Row, Col } from 'antd';
import request from '@/utils/request';
import QuerySettingsTable from './components/querySettingsTable';
import HeadSettingsTable from './components/headSettingsTable';

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
    message.warning(`表头和表格列表显示字段数量不一致，head：${head.length}，body：${totalFieldsLen}`);
    return false;
  }
  return true;
};

export default function index() {
  const [bodyJsonConfig, setBodyJsonConfig] = useState('');
  const queryFormRef = useRef();
  const headTableRef = useRef();

  const save = () => {
    console.log(queryFormRef.current.getData());
    const queryFormData = queryFormRef.current.getData();
    const headData = [
      {
        key: '7rjJ8lgYeD',
        name: '航司',
        field: 'airline',
        rowSpan: 1,
        colSpan: 1,
        uuid: 'BeSSb0CyUe',
      },
      {
        uuid: 'CKKsqhg3Dq',
        key: '8h5Ew1kPwt',
        name: '航班号',
        field: 'fltNo',
        rowSpan: 1,
        colSpan: 1,
      },
      {
        uuid: 'bh56wuon1N',
        key: 'Hu8PwlQ79Y',
        name: '到达站',
        field: 'arrive',
        rowSpan: 1,
        colSpan: 1,
      },
      {
        uuid: 'fdxrFypWIQ',
        key: 'w7JUOnF29Y',
        name: '出发站',
        field: 'dep',
        rowSpan: 1,
        colSpan: 1,
      },
      {
        uuid: 'vl9kW6DVme',
        key: 'gxSYk790i2',
        name: '开始日期',
        field: 'startDate',
        rowSpan: 1,
        colSpan: 1,
      },
      {
        uuid: 'lN5L0uLPTB',
        key: 'MfykdxjYKn',
        name: '结束日期',
        field: 'endDate',
        rowSpan: 1,
        colSpan: 1,
      },
    ];
    if (
      (bodyJsonConfig && !isValidJson(bodyJsonConfig)) ||
      !isValidHeadAndConfigBody(headData, bodyJsonConfig)
    ) {
      return;
    }
    request
      .post('/setTableParams', {
        queryFormData,
        headData,
        bodyJsonConfig: JSON.parse(bodyJsonConfig),
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

  return (
    <>
      <Layout>
        <Header style={headerStyle}>
          <Button type="primary" onClick={save}>
            生成
          </Button>
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
      </Layout>
    </>
  );
}
