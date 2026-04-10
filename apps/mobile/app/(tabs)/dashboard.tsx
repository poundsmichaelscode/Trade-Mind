import { Text } from 'react-native';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';

export default function DashboardScreen() {
  return <Screen title="Trading Desk" subtitle="Responsive mobile companion for quick journaling and portfolio checks.">
    <Card title="Net PnL" value="+$3,842" />
    <Card title="Win Rate" value="61%" />
    <Card title="Discipline Note">
      <Text style={{ color: '#cbd5e1', marginTop: 10 }}>Your London session trades continue to outperform your New York entries.</Text>
    </Card>
  </Screen>;
}
