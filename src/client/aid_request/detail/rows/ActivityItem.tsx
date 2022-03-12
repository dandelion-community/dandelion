import { gql } from '@apollo/client';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColor } from 'src/client/components/Colors';
import Monogram from 'src/client/components/Monogram';
import TextWithMentions from '../../../components/text_input_with_styles/TextWithMentions';
import { ActivityItemFragment } from './__generated__/ActivityItemFragment';

type Props = {
  activityItem: ActivityItemFragment;
};

export default function ActivityItem({ activityItem }: Props): JSX.Element {
  const color = useColor('text');
  const actorName = activityItem.actor?.displayName ?? 'Unknown';
  return (
    <View style={styles.container}>
      <View style={styles.monogramColumn}>
        <Monogram name={actorName} />
      </View>
      <View style={styles.nonMonogramColumn}>
        <View style={styles.header}>
          <View style={styles.actorName}>
            <Text style={[styles.actorNameText, { color }]}>{actorName}</Text>
          </View>
          <View style={styles.spacer} />
          <View style={styles.when}>
            <Text style={[styles.whenText, { color }]}>
              {activityItem.when}
            </Text>
          </View>
        </View>
        <View>
          <TextWithMentions
            style={[
              styles.contentText,
              { color },
              activityItem.isComment
                ? styles.contentTextComment
                : styles.contentTextNonComment,
            ]}
            value={activityItem.message}
          />
        </View>
      </View>
    </View>
  );
}

export const ActivityItemFragments = {
  activityItem: gql`
    fragment ActivityItemFragment on AidRequestActivityItem {
      _id
      actor {
        displayName
      }
      isComment
      message
      when
    }
  `,
};

const styles = StyleSheet.create({
  actorName: {
    flexGrow: 0,
  },
  actorNameText: {
    fontSize: 16,
    lineHeight: 24,
  },
  container: {
    alignItems: 'stretch',
    flexDirection: 'row',
    margin: 8,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  contentTextComment: {},
  contentTextNonComment: { fontStyle: 'italic', opacity: 0.6 },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexGrow: 0,
  },
  monogramColumn: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    flexGrow: 0,
    marginRight: 4,
    marginTop: 4,
  },
  nonMonogramColumn: {
    flexGrow: 1,
    flexShrink: 1,
  },
  spacer: {
    flexGrow: 1,
  },
  when: {
    flexGrow: 0,
  },
  whenText: {
    fontSize: 12,
    lineHeight: 20,
    opacity: 0.6,
  },
});
