import { Popconfirm as AntPopconfirm, type PopconfirmProps as AntPopconfirmProps } from "antd";

export interface PopconfirmProps extends AntPopconfirmProps {}

export default function Popconfirm(props: PopconfirmProps) {
  return (
    <AntPopconfirm
      okText={props.okText ?? "Да"}
      cancelText={props.cancelText ?? "Нет"}
      {...props}
    />
  );
}

