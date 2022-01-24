import { Platform } from 'react-native';

const URI =
  Platform.OS === 'web'
    ? '/graphql'
    : 'https://graphql.dandelion.supplies/graphql';

export default URI;
