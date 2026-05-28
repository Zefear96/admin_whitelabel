import { Card, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import TableSkeleton from "../accounts/TableSkeleton";
import { useGetCountryList } from "../../../../hooks/dictionary/country/useGetCountryList";
import type { CountryType } from "../../../../types/dictionary/countryType";
import ButtonCreate from "../../../../components/dataEntry/ButtonCreate";
import { useState } from "react";
import ImportCountriesModal from "./ImportCountriesModal";
import EditCountryModal from "./EditCountryModal";
import DetailsCountryModal from "./DetailsCountryModal";

export default function DictionaryCountryPage() {
    const { data, isLoading, error } = useGetCountryList();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<CountryType | null>(null);
    const columns: ColumnsType<CountryType> = [
        {
            title: "Наименование",
            dataIndex: "name"
        },
        {
            title: "ISO-код",
            dataIndex: "code"
        },
        {
            title: "Код",
            dataIndex: "litCode"
        },
    ]

    if (isLoading) {
        return <TableSkeleton />
    }

    return (
        <>
            <Card
                title="Справочник стран"
                extra={<ButtonCreate title="Импортировать страны" onClick={() => setIsCreateModalOpen(true)} />}
            >
                {error && <p style={{ color: "red" }}>Ошибка загрузки</p>}
                <Table
                    rowKey={(row) => row.id}
                    columns={columns}
                    loading={isLoading}
                    dataSource={data ?? []}
                    pagination={false}
                    scroll={{ x: 'max-content' }}
                    onRow={(record) => ({
                        onClick: () => {
                            setSelectedRow(record);
                            setIsDetailsModalOpen(true);
                        }
                    })}
                    style={{ cursor: "pointer" }}
                />
            </Card>
            <ImportCountriesModal
                isModalOpen={isCreateModalOpen}
                setIsModalOpen={setIsCreateModalOpen}
            />
            <DetailsCountryModal
                isModalOpen={isDetailsModalOpen}
                setIsModalOpen={setIsDetailsModalOpen}
                data={selectedRow}
                onEditClick={() => setIsEditModalOpen(true)}
            />
            <EditCountryModal
                isModalOpen={isEditModalOpen}
                setIsModalOpen={setIsEditModalOpen}
                data={selectedRow}
            />
        </>
    )
}