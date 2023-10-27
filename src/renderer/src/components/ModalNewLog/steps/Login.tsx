import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Input } from 'antd';
import { InfoCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { Credentials } from 'src/types';
import { Dispatch, SetStateAction } from 'react';

export default function Login(props: { onChange: Dispatch<SetStateAction<Credentials>> }) {
  return (
    <div className="step__container">
      <h1>Kirjaudu sisään</h1>

      <div className="step__body">
        <Input
          placeholder="Käyttäjänimi"
          onChange={(e) => props.onChange((prev) => ({ ...prev, username: e.target.value }))}
          prefix={<UserOutlined className="site-form-item-icon" />}
          suffix={
            <Tooltip title="Ninchat käyttäjän sähköpostiosoite">
              <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
            </Tooltip>
          }
        />
        <Input.Password
          placeholder="Salasana"
          onChange={(e) => props.onChange((prev) => ({ ...prev, password: e.target.value }))}
          iconRender={(visible: boolean) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
        />
      </div>

      <div className="step__footer"></div>
    </div>
  );
}
