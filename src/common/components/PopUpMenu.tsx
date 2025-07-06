import React, { useState } from 'react'
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../contexts/AuthContext';

interface PopUpMenuProps {
    navigation: () => void;
    menuVisible: boolean;
    setMenuVisible: (visible: boolean) => void;
}

export const PopUpMenu = ({ navigation, menuVisible, setMenuVisible }: PopUpMenuProps) => {
    const {logout} = useAuth();

    const handleLogout = async () => {
        await logout();
        setMenuVisible(false);
    }

    return (
        <>
            <Modal
                transparent
                visible={menuVisible}
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
            >
                <Pressable style={styles.overlay} onPress={() => setMenuVisible(false)}>
                    <View style={styles.menu}>
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => {
                                setMenuVisible(false);
                                navigation();
                            }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="settings-outline" size={20} />
                                <Text style={styles.menuText}>Settings</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => {
                                handleLogout();
                            }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialIcons name="logout" size={20} color={'red'}/>
                                <Text style={{...styles.menuText, color: 'red'}}>Logout</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingTop: 50,
        paddingRight: 15
    },
    menu: {
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4
    },
    menuItem: {
        paddingVertical: 10
    },
    menuText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 10
    }
});
