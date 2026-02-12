import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Button, Modal } from "antd";
import type { TransactionBankReportType } from "../../../../types/transactionBankReportType";
import { RobotoRegularBase64 } from '../../../../utils/Roboto-Regular-base64';
import dayjs from "dayjs";
import { DownloadOutlined, PrinterOutlined } from "@ant-design/icons";
import { useState } from "react";

interface ExportButtonProps {
  transactions: TransactionBankReportType[];
  bankCode: string;
}

interface TableRow {
  index: number;
  date: string;
  paymentId: string;
  transactionType: string;
  receiverAccount: string;
  amount: string;
}

export const ButtonReportOutgoingTransactions = ({ transactions, bankCode }: ExportButtonProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const totalAmount = transactions.reduce((sum, tx) => {
    return sum + Number(tx.amount || 0);
  }, 0);
    console.log(totalAmount)

  const generatePdf = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    // Подключаем кастомный шрифт
    doc.addFileToVFS("Roboto-Regular.ttf", RobotoRegularBase64);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    doc.setFont("Roboto");
    doc.setFontSize(14);

    const pageWidth = doc.internal.pageSize.getWidth();

    // Заголовок документа
    doc.text("Реестр исходящих платежей, проведенных с использованием", pageWidth / 2, 20, { align: "center" });
    doc.text(`Системы Агента «${bankCode.toUpperCase()}»`, pageWidth / 2, 28, { align: "center" });
    doc.text("c «fromDate» по «toDate»", pageWidth / 2, 36, { align: "center" });

    // Подготовка данных для autoTable
    const tableColumns: { header: string; dataKey: keyof TableRow }[] = [
      { header: "№", dataKey: "index" },
      { header: "Дата и время", dataKey: "date" },
      { header: "ID платежа", dataKey: "paymentId" },
      { header: "Наименование услуги", dataKey: "transactionType" },
      { header: "Лицевой счет", dataKey: "receiverAccount" },
      { header: "Сумма (KGS)", dataKey: "amount" },
    ];

    const tableData = transactions.map((tx, index) => ({
      index: index + 1,
      date: dayjs(tx.date).format("DD.MM.YYYY HH:mm") || "-",
      paymentId: tx.paymentId || "-",
      transactionType: tx.transactionType || "-",
      receiverAccount: tx.receiverAccount || "-",
      amount: tx.amount?.toString() || "-",
    }));

    autoTable(doc, {
      startY: 44,
      head: [tableColumns.map(c => c.header)],
      body: tableData.map(row => tableColumns.map(c => row[c.dataKey])),
      foot: [[ "", "Итого:", "", "", "", totalAmount.toFixed(2) ]],
      theme: "grid",       // линии вокруг всех ячеек
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
      },
      footStyles: {
        font: "Roboto",
        fontStyle: "normal",
        fontSize: 10,
        halign: "right",
      },
      columnStyles: {
        0: { cellWidth: 10 },   // №
        1: { cellWidth: 35 },   // Дата и время
        2: { cellWidth: 70 },   // ID платежа
        3: { cellWidth: 50 },   // Наименование услуги
        4: { cellWidth: 50 },   // Лицевой счет
        5: { cellWidth: 25 },   // Сумма
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
