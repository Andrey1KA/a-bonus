import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

export type Group = {
  id: string;
  name: string;
};

const TAB_PURPLE = '#6766AA';

type Props = Group & {
  isSelected: boolean;
  setSelectedGroupId: (id: string) => void;
  colors: {
    background: string;
    border: string;
    placeholder: string;
    text: string;
  };
};

const GroupListItemButton = ({ id, name, isSelected, setSelectedGroupId, colors }: Props) => {
  return (
    <Pressable
      onPress={() => setSelectedGroupId(id)}
      style={[
        styles.pill,
        {
          backgroundColor: isSelected ? TAB_PURPLE : colors.background,
          borderColor: isSelected ? TAB_PURPLE : colors.border,
        },
      ]}>
      <Text
        style={[styles.pillText, { color: isSelected ? '#fff' : colors.placeholder }]}
        numberOfLines={1}>
        {name}
      </Text>
    </Pressable>
  );
};

export default GroupListItemButton;

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 26,
    borderWidth: 1,
    maxWidth: 200,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
});
