import { Descriptions, Modal } from "antd";
import { ProductStatementSection } from "./ProductStatementSection";
import type { ProductStatementType } from "../../../../types/product/StatementDataType";

const PRODUCT_LABEL_MAP: Record<string, string> = {
  id: "ID",
  productName: "Наименование продукта",
  productCode: "Код продукта",
  currency: "Валюта",
  iban: "IBAN",
  accountNumber: "Номер счёта",
  cardNumber: "Номер карты",
  active: "Статус",
  expiry: "Срок действия",
  openDate: "Дата открытия",
  expiryDate: "Дата закрытия",
  rate: "Ставка",
  cellNumber: "Номер ячейки",
  availableRentAmount: "Доступная сумма аренды",
  rentalCurrency: "Валюта аренды",
  insuranceReserveAmount: "Страховой резерв",
  lastVisitDate: "Последний визит",
  expireDate: "Дата окончания аренды",
  availableAmount: " Доступная сумма",
  blockedAmount: " Заблокированная сумма",
  isAmountBlocked: "Статус блокировки",
  cardExpiry: "Срок действия (баланс)",
  cardId: "ID карты",
  initialAmount: "Исходная сумма",
  bonusAmount: "Бонусная сумма",
  creditLimit: "Кредитный лимит",
  lockedBackofficeAmount: "Заблокировано (backoffice)",
  lockedBackofficeAmountOffline: "Заблокировано offline (backoffice)",
  lockedAmount: "Заблокировано всего",
  outstandingAmount: "Остаток задолженности",
  statusActive: "Активен",
  profitAmount: "Сумма прибыли",
  mudarabahId: "ID мударабы",
};

function formatProductValue(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}

function renderDetails(obj: Record<string, unknown>) {
  return (
    <Descriptions bordered column={1} size="middle">
      {Object.entries(obj)
        .filter(([k]) => k !== "key")
        .map(([key, value]) => (
          <Descriptions.Item key={key} label={PRODUCT_LABEL_MAP[key] || key}>
            {typeof value === "object" ? (
              <pre style={{ margin: 0, fontSize: 12, whiteSpace: "pre-wrap" }}>
                {formatProductValue(value)}
              </pre>
            ) : (
              formatProductValue(value)
            )}
          </Descriptions.Item>
        ))}
    </Descriptions>
  );
}

interface ProductDetailsModalProps {
  title: string;
  open: boolean;
  onClose: () => void;
  data?: Record<string, unknown> | null;
  extraData?: Record<string, unknown> | null;
  width?: number;
  statementType?: ProductStatementType;
  productId?: string;
  userId?: string;
}

export function ProductDetailsModal({
  title,
  open,
  onClose,
  data,
  extraData,
  width = 840,
  statementType,
  productId,
  userId,
}: ProductDetailsModalProps) {
  if (!data && !extraData) return null;

  const merged: Record<string, unknown> = {
    ...(data ?? {}),
    ...(extraData ?? {}),
  };

  const showStatement = !!statementType && !!productId && !!userId;

  return (
    <Modal title={title} open={open} onCancel={onClose} footer={null} width={width}>
      {renderDetails(merged)}
      {showStatement && (
        <ProductStatementSection
          statementType={statementType}
          productId={productId}
          userId={userId}
        />
      )}
    </Modal>
  );
}
