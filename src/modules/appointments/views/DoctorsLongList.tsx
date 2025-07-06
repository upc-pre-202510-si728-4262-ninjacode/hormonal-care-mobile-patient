import React, { useEffect, useRef } from 'react'
import { DoctorResponse } from '../entities/doctorEntitie';
import { DoctorCard } from '../components/DoctorCard';
import { Animated, FlatList, View } from 'react-native';

const AnimatedDoctorCard = ({ item, index }: { item: DoctorResponse, index: number }) => {
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
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <DoctorCard data={item} size='small'/>
    </Animated.View>
  );
};

const renderItem = ({ item, index }: { item: DoctorResponse, index : number }) => (
  <AnimatedDoctorCard item={item} index={index} />
);

export const DoctorsLongList = ( {data} : {data : DoctorResponse[]} ) => {
  return (
    <View>
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListFooterComponent={() => <View style={{ height: 40 }} />}
            showsVerticalScrollIndicator={false}
        />
    </View>
  )
}
