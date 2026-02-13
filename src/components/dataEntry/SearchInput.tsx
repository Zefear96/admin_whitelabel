import React from 'react';
import { AudioOutlined } from '@ant-design/icons';
import { Input, Space } from 'antd';
import type { GetProps } from 'antd';

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

const suffix = <AudioOutlined style={{ fontSize: 16, color: '#1677ff' }} />;

const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);

export default function SearchInput() {
    return (
        <Space direction="vertical">
            <Search placeholder="Поиск клиента по АБС" onSearch={onSearch} size='large' enterButton className='s' />
        </Space>
    )
}