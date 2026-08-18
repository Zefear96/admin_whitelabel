import { Table } from "antd";
import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetClientList } from "../../../hooks/client/useGetClientList";
import type { CustomerProfileType } from "../../../types/client/customerProfile";
import { ClientListSkeleton } from "../../service-desk/clients/ClientListSkeleton";
import { antifraudClientColumns } from "./antifraudClientColumns";

const DETAILS_PATH = "/compliance/antifraud/details";

function AntifraudClientTable() {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const navigate = useNavigate();
  const { data: clientList, isLoading, error } = useGetClientList(page, size, "createdDate,ASC");

  if (isLoading) {
    return <ClientListSkeleton />;
  }

  return (
    <>
      {error && (
        <div style={{ color: "red", marginBottom: 16 }}>
          Ошибка загрузки: {error.message}
        </div>
      )}
      <Table<CustomerProfileType>
        rowClassName={() => "group"}
        rowKey={(row) => row.id || row.absClientId}
        onRow={(record) => ({
          onClick: () => navigate(`${DETAILS_PATH}/${record.absClientId}`),
        })}
        dataSource={clientList?.clients || []}
        columns={antifraudClientColumns}
        style={{ marginTop: 16, cursor: "pointer" }}
        bordered
        size="small"
        pagination={{
          pageSize: size,
          current: (clientList?.page ?? 0) + 1,
          total: clientList?.totalElements || 0,
          showSizeChanger: true,
          showTotal: (total) => `Всего ${total} клиентов`,
        }}
        onChange={(pagination) => {
          setPage((pagination.current || 1) - 1);
          setSize(pagination.pageSize || 20);
        }}
      />
    </>
  );
}

export default memo(AntifraudClientTable);
