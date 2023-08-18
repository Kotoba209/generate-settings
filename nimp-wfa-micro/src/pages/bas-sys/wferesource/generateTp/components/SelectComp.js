import React, { useState } from 'react';
import { Select } from 'antd';

const SelectComp = (props) => {
  const { value = 'input', onChange, options } = props;
  const [v, setV] = useState(value);
  const [list, setList] = useState(options)
  return (
    <Select
      value={v}
      onChange={(e) => {
        onChange(e);
        setV(e);
      }}
      options={list}
    ></Select>
  );
};

export default SelectComp;
