import React, { useState, useRef, useEffect } from 'react'
import { Text, TouchableOpacity, View, StyleSheet, ScrollView, Platform } from 'react-native'

interface Props {
    selectedDate: Date
    appointmentsDates: string[]
    setSelectedDate: (date: Date) => void
}

export const AppointmentsRowCalendar = ({ selectedDate, appointmentsDates, setSelectedDate }: Props) => {
    const [selectedYear, setSelectedYear] = useState(selectedDate.getFullYear())
    const [selectedMonth, setSelectedMonth] = useState(selectedDate.getMonth())

    const scrollViewRef = useRef<ScrollView>(null)
    const dateItemRefs = useRef<{ [key: string]: any | null }>({})

    const getDaysInMonth = (year: number, month: number) => {
        const days = []
        const totalDays = new Date(year, month + 1, 0).getDate()
        for (let i = 1; i <= totalDays; i++) {
            days.push(new Date(year, month, i))
        }
        return days
    }

    const days = getDaysInMonth(selectedYear, selectedMonth)

    const scrollToSelectedDate = () => {
        const selectedIndex = days.findIndex(
            day => day.toDateString() === selectedDate.toDateString()
        )

        if (selectedIndex !== -1 && scrollViewRef.current) {
            setTimeout(() => {
                if (scrollViewRef.current) {
                    scrollViewRef.current.scrollTo({
                        x: selectedIndex * 70,
                        animated: true
                    })
                }
            }, 100)
        }
    }

    useEffect(() => {
        scrollToSelectedDate()
    }, [selectedDate])

    useEffect(() => {
        scrollToSelectedDate()
    }, [selectedMonth, selectedYear])

    useEffect(() => {
        const delay = Platform.OS === 'ios' ? 300 : 500;
        const initialScrollTimer = setTimeout(() => {
            scrollToSelectedDate()
        }, delay)

        return () => clearTimeout(initialScrollTimer)
    }, [])

    return (
        <View>
            <ScrollView
                ref={scrollViewRef}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                style={{ paddingTop: 10, paddingBottom: 20 }}
            >
                {days.map((day, index) => {

                    const isSelected = day.toDateString() === selectedDate.toDateString()
                    const dayKey = day.toISOString()
                    const dayString = day.toISOString().split('T')[0]
                    const isInAppointmentsDates = appointmentsDates.includes(dayString)

                    return (
                        <TouchableOpacity
                            key={index}
                            ref={ref => dateItemRefs.current[dayKey] = ref}
                            onPress={() => setSelectedDate(day)}
                            style={[styles.dateBox, isSelected && styles.selectedBox]}
                        >
                            <Text style={[styles.dateText]}>
                                {day.getDate()}
                            </Text>
                            <Text style={styles.dayText}>
                                {day.toLocaleDateString('en-US', { weekday: 'short' })}
                            </Text>
                            {isInAppointmentsDates && <View style={styles.pointBox} />}
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    picker: {
        flex: 1,
    },
    dateRow: {
        marginVertical: 10,
    },
    dateBox: {
        padding: 10,
        marginHorizontal: 5,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        width: 60,
    },
    selectedBox: {
        backgroundColor: '#d0c4fb',
    },
    pointBox: {
        width: 5,
        height: 5,
        borderRadius: 20,
        backgroundColor: '#d0c4fb',
        marginTop: 5,
        alignSelf: 'center'
    },
    dateText: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    dayText: {
        fontSize: 12,
        color: '#555',
    },
    selectedDateLabel: {
        textAlign: 'center',
        fontStyle: 'italic',
        marginTop: 10,
    },
})