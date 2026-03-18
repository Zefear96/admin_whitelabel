import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { CustomerProfileType } from "../../../types/client/customerProfile";
import { useGetClientList } from "../../../hooks/client/useGetClientList";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ClientList(){
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(20);
    const [sort, setSort] = useState("createdDate,ASC");
    const navigate = useNavigate();
    const { data:clientList, isLoading:clientListLoading, error:clientListError } = useGetClientList(page, size, sort);

    const columns: ColumnsType<CustomerProfileType> = [
        {
          title: "ABS number",
          dataIndex: "absClientId",
        },
        {
          title: "Имя",
          dataIndex: "firstName",
        },
        {
          title: "Фамилия",
          dataIndex: "lastName",
        },
        {
          title: "ИНН",
          dataIndex: "inn",
        },
        // {
        //   title: "Дата рождения",
        //   dataIndex: "birthDate",
        //   render: (text: string) => <div>{text ? new Date(text).toLocaleDateString() : '-'}</div>
        // },
        {
          title: "Email",
          dataIndex: "email",
        },
        {
          title: "Телефон",
          dataIndex: "phoneNumber",
        },
      ]

    // Отладочная информация
    // console.log('ClientList render:', {
    //     isLoading: clientListLoading,
    //     hasData: !!clientList,
    //     clientsCount: clientList?.clients?.length || 0,
    //     clients: clientList?.clients,
    //     error: clientListError
    // });

    return(
        <>
            {clientListError && (
                <div style={{ color: 'red', marginBottom: 16 }}>
                    Ошибка загрузки: {clientListError.message}
                </div>
            )}
            <Table<CustomerProfileType>
                rowClassName={() => "group"}
                rowKey={(row) => row.id || row.absClientId}
                onRow={(record) => ({
                    onClick: () => navigate(`/service-desk/clients/details/${record.absClientId}`),
                })}
                dataSource={clientList?.clients || []}
                columns={columns}
                loading={clientListLoading}
                style={{ marginTop: 16 , cursor: 'pointer'}}
                bordered
                size="small"
                pagination={{
                    pageSize: size,
                    current: (clientList?.page ?? 0) + 1, // Ant Design использует 1-based индексацию
                    total: clientList?.totalElements || 0,
                    showSizeChanger: true,
                    showTotal: (total) => `Всего ${total} клиентов`,
                }}
                onChange={(pagination) => {
                    setPage((pagination.current || 1) - 1); // Конвертируем обратно в 0-based
                    setSize(pagination.pageSize || 20);
                }}
            />
        </>
    )
}