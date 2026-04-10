import { Text } from 'react-native';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';

export default function InsightsScreen() {
  return <Screen title="Insights" subtitle="Rule-based coaching summaries from your historical data.">
    <Card title="Performance edge"><Text style={{ color: '#e2e8f0', marginTop: 10 }}>You win more often on GBP pairs than on BTC pairs.</Text></Card>
    <Card title="Risk warning"><Text style={{ color: '#fecaca', marginTop: 10 }}>Your average loss is still larger than your average win.</Text></Card>
  </Screen>;
}
