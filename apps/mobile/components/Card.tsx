import { PropsWithChildren } from "react";
import { View, Text } from "react-native";

export function Card({ title, value, children }: PropsWithChildren<{ title: string; value?: string }>) {
  return <View style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: 16 }}>
    <Text style={{ color: '#94a3b8', fontSize: 12 }}>{title}</Text>
    {value ? <Text style={{ color: 'white', fontSize: 24, fontWeight: '700', marginTop: 8 }}>{value}</Text> : null}
    {children}
  </View>;
}
