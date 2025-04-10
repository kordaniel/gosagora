import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Separator = () => (
  <SafeAreaView mode="margin" style={styles.separator} />
);

const styles = StyleSheet.create({
  separator: { height: 1, },
});

export default Separator;
