import React, { useEffect, useRef } from 'react'
import { AppointmentResponse } from '../entities/appointmentEntitie';
import { AppointmentCard } from '../components/AppointmentCard';
import { Animated, FlatList, View } from 'react-native';

// const AnimatedAppointmentCard = ({ item, index }: { item: AppointmentResponse, index: number }) => {
//   const opacity = useRef(new Animated.Value(0)).current;
//   const scale = useRef(new Animated.Value(0.9)).current;

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(opacity, {
//         toValue: 1,
//         duration: 300,
//         delay: index * 100,
//         useNativeDriver: true,
//       }),
//       Animated.spring(scale, {
//         toValue: 1,
//         friction: 6,
//         delay: index * 100,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   }, []);

//   return (
//     <Animated.View style={{ opacity, transform: [{ scale }] }}>
//       <AppointmentCard item={item} />
//     </Animated.View>
//   );
// };

// const AnimatedAppointmentCard = ({ item, index }: { item: AppointmentResponse, index: number }) => {
//   const opacity = useRef(new Animated.Value(0)).current;
//   const translateX = useRef(new Animated.Value(50)).current;

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(opacity, {
//         toValue: 1,
//         duration: 300,
//         delay: index * 100,
//         useNativeDriver: true,
//       }),
//       Animated.timing(translateX, {
//         toValue: 0,
//         duration: 300,
//         delay: index * 100,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   }, []);

//   return (
//     <Animated.View style={{ opacity, transform: [{ translateX }] }}>
//       <AppointmentCard item={item} />
//     </Animated.View>
//   );
// };

const AnimatedAppointmentCard = ({ item, index }: { item: AppointmentResponse, index: number }) => {
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
      <AppointmentCard item={item} />
    </Animated.View>
  );
};

// const renderItem = ({ item }: { item: AppointmentResponse }) => (
//   <AnimatedAppointmentCard item={item} index={item.id} />
// );

const renderItem = ({ item, index }: { item: AppointmentResponse, index: number }) => (
  <AnimatedAppointmentCard item={item} index={index} />
);

export const AppointmentsLongList = ({ data }: { data: AppointmentResponse[] }) => {

  return (
    <View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListHeaderComponent={() => <View style={{ height: 10 }} />}
        ListFooterComponent={() => <View style={{ height: 40 }} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}
