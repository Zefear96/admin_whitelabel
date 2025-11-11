import { useEffect, useState } from 'react';
import { useKeycloak } from '../../store/KeycloakProvider';
import { Card, Button, Space, Typography } from 'antd';

const { Title, Text } = Typography;

export default function TestKeycloakPage() {
  const { keycloak, initialized, authenticated } = useKeycloak();
  const [keycloakInfo, setKeycloakInfo] = useState<any>(null);

  useEffect(() => {
    if (initialized && keycloak) {
      setKeycloakInfo({
        realm: keycloak.realm,
        clientId: keycloak.clientId,
        url: keycloak.authServerUrl,
        token: keycloak.token ? 'Present' : 'Not present',
        tokenParsed: keycloak.tokenParsed,
        refreshToken: keycloak.refreshToken ? 'Present' : 'Not present',
        idToken: keycloak.idToken ? 'Present' : 'Not present',
      });
    }
  }, [initialized, keycloak]);

  const handleLogin = () => {
    keycloak.login();
  };

  const handleLogout = () => {
    keycloak.logout();
  };

  const handleRefresh = async () => {
    try {
      const refreshed = await keycloak.updateToken(70);
      if (refreshed) {
        console.log('Token refreshed');
      } else {
        console.log('Token not refreshed');
      }
    } catch (error) {
      console.log('Token refresh failed:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Keycloak Test Page</Title>
      
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="Status">
          <Text>Initialized: {initialized ? 'Yes' : 'No'}</Text><br />
          <Text>Authenticated: {authenticated ? 'Yes' : 'No'}</Text>
        </Card>

        {keycloakInfo && (
          <Card title="Keycloak Configuration">
            <Text>Realm: {keycloakInfo.realm}</Text><br />
            <Text>Client ID: {keycloakInfo.clientId}</Text><br />
            <Text>Server URL: {keycloakInfo.url}</Text><br />
            <Text>Token: {keycloakInfo.token}</Text><br />
            <Text>Refresh Token: {keycloakInfo.refreshToken}</Text><br />
            <Text>ID Token: {keycloakInfo.idToken}</Text>
          </Card>
        )}

        {keycloakInfo?.tokenParsed && (
          <Card title="Token Information">
            <pre>{JSON.stringify(keycloakInfo.tokenParsed, null, 2)}</pre>
          </Card>
        )}

        <Card title="Actions">
          <Space>
            <Button type="primary" onClick={handleLogin} disabled={authenticated}>
              Login
            </Button>
            <Button onClick={handleLogout} disabled={!authenticated}>
              Logout
            </Button>
            <Button onClick={handleRefresh} disabled={!authenticated}>
              Refresh Token
            </Button>
          </Space>
        </Card>
      </Space>
    </div>
  );
}
