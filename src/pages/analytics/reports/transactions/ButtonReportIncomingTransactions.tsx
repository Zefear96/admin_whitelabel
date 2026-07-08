import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Button, Modal } from "antd";
import { RobotoRegularBase64 } from '../../../../utils/Roboto-Regular-base64';
import dayjs from "dayjs";
import { PrinterOutlined } from "@ant-design/icons";
import { useState } from "react";
import type { IncomingTransactionType } from "../../../../types/banking-gateway/transactionsType";

interface ExportButtonProps {
  transactions: IncomingTransactionType[];
  bankCode: string;
  agentName: string;
  fromDate?: string;
  toDate?: string;
}

interface TableRow {
  index: number;
  creationDate: string;
  paymentId: string;
  transactionType: string;
  receiver: string;
  status: string;
  amount: string;
}

export const ButtonReportIncomingTransactions = ({ transactions, bankCode, agentName, fromDate, toDate }: ExportButtonProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const totalAmount = transactions.reduce((sum, tx) => {
    return sum + Number(tx.amount || 0);
  }, 0);
  const currency = transactions[0]?.currency?.toUpperCase() ?? "KGS";
  const dateRangeStr = fromDate && toDate
    ? `c «${dayjs(fromDate).format("DD.MM.YYYY")}» по «${dayjs(toDate).format("DD.MM.YYYY")}»`
    : "c «______» по «______»";

  const generatePdf = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    // Подключаем кастомный шрифт
    doc.addFileToVFS("Roboto-Regular.ttf", RobotoRegularBase64);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.setFont("Roboto");
    doc.setFontSize(14);

    const pageWidth = doc.internal.pageSize.getWidth();

    // Заголовок документа
    doc.text("Реестр входящих платежей, проведенных с использованием", pageWidth / 2, 20, { align: "center" });
    doc.text(`cистемы aгента ${agentName}`, pageWidth / 2, 28, { align: "center" });
    doc.text(dateRangeStr, pageWidth / 2, 36, { align: "center" });

    const tableColumns: { header: string; dataKey: keyof TableRow }[] = [
      { header: "№", dataKey: "index" },
      { header: "Дата и время", dataKey: "creationDate" },
      { header: "ID платежа", dataKey: "paymentId" },
      { header: "Наименование услуги", dataKey: "transactionType" },
      { header: "Лицевой счет", dataKey: "receiver" },
      { header: "Статус", dataKey: "status" },
      { header: `Сумма ${currency}`, dataKey: "amount" },
    ];

    const tableData: TableRow[] = transactions.map((tx, index) => ({
      index: index + 1,
      creationDate: tx.creationDate ? dayjs(tx.creationDate).format("DD.MM.YYYY HH:mm:ss") : "-",
      paymentId: tx.id || "-",
      transactionType: tx.transactionType || "-",
      receiver: tx.receiver || "-",
      status: tx.status?.toUpperCase() || "-",
      amount: tx.amount != null ? String(tx.amount) : "-",
    }));

    autoTable(doc, {
      startY: 44,
      head: [tableColumns.map(c => c.header)],
      body: tableData.map(row => tableColumns.map(c => row[c.dataKey])),
      foot: [["", "Итого:", "", "", "", "", totalAmount.toFixed(2)]],
      theme: "grid",
      showFoot: "lastPage",
      headStyles: {
        fillColor: [220, 220, 220],
        textColor: 0,
        font: "Roboto",
        fontStyle: "normal",
        halign: "center",
      },
      bodyStyles: {
        font: "Roboto",
        fontStyle: "normal",
        fontSize: 10,
        halign: "center",
      },
      footStyles: {
        font: "Roboto",
        fontStyle: "normal",
        fontSize: 10,
        halign: "right",
      },
      columnStyles: {
        0: { cellWidth: 10 },   // №
        1: { cellWidth: 30 },   // Дата и время
        2: { cellWidth: 55 },   // ID платежа
        3: { cellWidth: 40 },   // Наименование услуги
        4: { cellWidth: 50 },   // Лицевой счет
        5: { cellWidth: 25 },   // Статус
        6: { cellWidth: 25 },   // Сумма
      },
      styles: {
        overflow: 'linebreak',
      },
      margin: { left: (doc.internal.pageSize.getWidth() - 240) / 2 },
    });

    return doc
    // doc.save(`transactions_${bankCode}.pdf`);
  };


  const handlePreview = () => {
    const doc = generatePdf();
    const blob = doc.output("blob"); // получаем PDF как Blob
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);
    setModalVisible(true);
  };

  const handleDownload = () => {
    const doc = generatePdf();
    doc.save(`transactions_${bankCode}.pdf`);
  };

  return (
    <>
      {/* <Button onClick={generatePdf} variant="outlined" color="cyan" >Сформировать документ</Button> */}

      <Button onClick={handlePreview} style={{ marginRight: 8 }} icon={<PrinterOutlined />} color="cyan" variant="outlined">Сформировать документ</Button>

      <Modal
        title="Предпросмотр PDF"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width="80%"
        style={{ top: 20 }}
      >
        {previewUrl && (
          <iframe
            src={previewUrl}
            style={{ width: '100%', height: '80vh', border: 'none' }}
          />
        )}
      </Modal>
    </>
  )
};
