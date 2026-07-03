import { useEffect, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { Button, DatePicker, Divider, Modal, Space, Typography, message } from "antd";
import { useGetAccountStatement } from "../../../../hooks/product/useGetAccountStatement";
import { useGetCardStatement } from "../../../../hooks/product/useGetCardStatement";
import type { ProductStatementType } from "../../../../types/product/StatementDataType";

const { RangePicker } = DatePicker;

const formatDateValue = (date: Dayjs) => date.format("YYYY-MM-DD");

export interface ProductStatementSectionProps {
  statementType: ProductStatementType;
  productId: string;
  userId: string;
}

export function ProductStatementSection({ statementType, productId, userId }: ProductStatementSectionProps) {
  const today = dayjs();
  const [dates, setDates] = useState<[Dayjs, Dayjs]>([today.subtract(30, "day"), today]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const cardStatement = useGetCardStatement();
  const accountStatement = useGetAccountStatement();
  const isCardStatement = statementType === "card";
  const isPending = isCardStatement ? cardStatement.isPending : accountStatement.isPending;
  const error = isCardStatement ? cardStatement.error : accountStatement.error;

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const closePdfModal = () => {
    setIsPdfModalOpen(false);
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  };

  const handleGetStatement = async () => {
    try {
      cardStatement.reset();
      accountStatement.reset();
      const fromDate = formatDateValue(dates[0]);
      const toDate = formatDateValue(dates[1]);

      const blob = isCardStatement
        ? await cardStatement.mutateAsync({ cardId: productId, userId, fromDate, toDate })
        : await accountStatement.mutateAsync({ accountId: productId, userId, fromDate, toDate });

      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }

      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setIsPdfModalOpen(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Не удалось получить выписку";
      message.error(errorMessage);
    }
  };

  return (
    <>
      <Divider style={{ margin: "20px 0 16px" }} />
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <RangePicker
            value={dates}
            onChange={(value) => {
              if (value?.[0] && value?.[1]) {
                setDates([value[0], value[1]]);
              }
            }}
            allowClear={false}
            format="DD.MM.YYYY"
            style={{ cursor: "pointer" }}
          />
          <Button type="primary" loading={isPending} onClick={handleGetStatement}>
            Получить выписку
          </Button>
        </div>



        {error && (
          <Typography.Text type="danger">
            {error instanceof Error ? error.message : "Не удалось получить выписку"}
          </Typography.Text>
        )}
      </Space>

      <Modal
        title="Просмотр выписки"
        open={isPdfModalOpen}
        onCancel={closePdfModal}
        footer={null}
        width="90%"
        style={{ top: 24 }}
        destroyOnClose
      >
        {pdfUrl && (
          <iframe
            src={pdfUrl}
            title="Выписка"
            style={{ width: "100%", height: "80vh", border: "none" }}
          />
        )}
      </Modal>
    </>
  );
}
