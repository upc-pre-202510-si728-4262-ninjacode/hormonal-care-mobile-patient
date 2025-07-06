import React, { useEffect, useRef } from 'react'
import { Animated, FlatList, View } from 'react-native'
import { MessageResponse } from '../entities/messageEntitie'
import { MessageCard } from '../components/MessageCard';


const AnimatedMessageCard = ({ item, index }: { item: MessageResponse, index: number }) => {
  const translateY = useRef(new Animated.Value(30)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        friction: 5,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View>
      <MessageCard item={item} />
    </Animated.View>
  )
}

const renderItem = ({ item, index }: { item: MessageResponse, index: number }) => {
  return (
    <AnimatedMessageCard item={item} index={index} />
  )
}

export const MessagesList = ({ data }: { data: MessageResponse[] }) => {
  return (
    <View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        ListHeaderComponent={() => <View style={{ height: 10 }} />}
        ListFooterComponent={() => <View style={{ height: 40 }} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}
