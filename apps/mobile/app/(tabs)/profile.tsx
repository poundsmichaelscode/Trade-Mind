import { Text } from 'react-native';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';

export default function ProfileScreen() {
  return <Screen title="Profile" subtitle="Account, risk settings, and subscription status.">
    <Card title="Plan" value="Pro Trader" />
    <Card title="Preferred risk"><Text style={{ color: '#e2e8f0', marginTop: 10 }}>2% per trade · Swing trading</Text></Card>
  </Screen>;
}
