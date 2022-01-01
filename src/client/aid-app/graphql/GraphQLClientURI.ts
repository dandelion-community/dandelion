import { Platform } from 'react-native';

const URI =
  Platform.OS === 'web'
    ? '/graphql'
    : 'http://graphql.dandelion.supplies/graphql';

export default URI;
