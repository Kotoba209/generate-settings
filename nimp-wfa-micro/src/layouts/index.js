import React, { useEffect } from 'react';
import {
  connect,
  // Outlet,
  // useAliveController,
  KeepAliveLayout,
  /* patchKeepAlive, */
} from 'umi';
import { Layout, ConfigProvider } from 'antd';
import themeProviderHoc from '@/common/hocs/themeProviderHoc/index';

const { Content } = Layout;

const BasicLayout = (props) => {
  console.log('<-layout->', props);

  const { children = <></>, ...rest } = props;
  return (
    <>
      <ConfigProvider>
        <KeepAliveLayout  {...props}>
        <Content>{React.cloneElement(children, rest)}</Content>
        </KeepAliveLayout>
      </ConfigProvider>
    </>
  );
};

export default connect((state) => {
  const global = state.global;
  return {
    global,
  };
})(
  themeProviderHoc(BasicLayout, {
    components: {
      Menu: {
        colorPrimary: '#BC261A',
      },
    },
    token: {
      colorPrimary: '#BC261A',
    },
  }),
);
