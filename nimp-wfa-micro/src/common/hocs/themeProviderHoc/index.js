import "react";
import { ConfigProvider } from "antd";

export default (Comp, theme) => {
  console.log('theme', theme)
  return (props) => {
    return (
      <ConfigProvider theme={theme}>
        <Comp {...props} />
      </ConfigProvider>
    );
  };
};
