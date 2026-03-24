import { Row, Col } from "antd";
import { ClientAccountSection } from "./ClientAccountSection";
import { ClientCardSection } from "./ClientCardSection";
import { ClientMudarabaSection } from "./ClientMudarabaSection";
import { ClientMurabahaSection } from "./ClientMurabahaSection";
import { ClientSafeSection } from "./ClientSafeSection";

interface ClientProductPageProps {
  keycloakClientId: string;
}

export default function ClientProductPage({ keycloakClientId }: ClientProductPageProps) {
  return (
    <div style={{ padding: "8px 0" }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12} xl={24}>
          <ClientCardSection keycloakClientId={keycloakClientId} />
        </Col>
        <Col xs={24} lg={12} xl={24}>
          <ClientAccountSection keycloakClientId={keycloakClientId} />
        </Col>
        <Col xs={24} lg={12} xl={24}>
          <ClientMudarabaSection keycloakClientId={keycloakClientId} />
        </Col>
        <Col xs={24} lg={12} xl={24}>
          <ClientMurabahaSection keycloakClientId={keycloakClientId} />
        </Col>
        <Col xs={24} lg={12} xl={24}>
          <ClientSafeSection keycloakClientId={keycloakClientId} />
        </Col>
      </Row>
    </div>
  );
}
