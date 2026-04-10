import { PropsWithChildren } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "react-native";

export function Screen({ title, subtitle, children }: PropsWithChildren<{ title: string; subtitle?: string }>) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#020617' }}>
      <View style={{ padding: 20 }}>
        <Text style={{ color: '#34d399', fontSize: 12, letterSpacing: 2, textTransform: 'uppercase' }}>TradeMind Mobile</Text>
        <Text style={{ color: 'white', fontSize: 30, fontWeight: '700', marginTop: 6 }}>{title}</Text>
        {subtitle ? <Text style={{ color: '#94a3b8', marginTop: 8 }}>{subtitle}</Text> : null}
        <View style={{ marginTop: 20, gap: 12 }}>{children}</View>
      </View>
    </SafeAreaView>
  );
}
