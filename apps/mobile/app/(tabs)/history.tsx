import { Text } from 'react-native';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';

export default function HistoryScreen() {
  return <Screen title="Trade History" subtitle="Review your latest entries on the go.">
    <Card title="BTCUSD · Buy" value="+$420"><Text style={{ color: '#94a3b8', marginTop: 10 }}>RR 2.4 · New York session</Text></Card>
    <Card title="EURUSD · Sell" value="-$98"><Text style={{ color: '#94a3b8', marginTop: 10 }}>RR 0.6 · London session</Text></Card>
  </Screen>;
}
