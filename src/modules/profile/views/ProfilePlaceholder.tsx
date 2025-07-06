import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Button, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useAuth } from '../../../common/contexts/AuthContext';
import { FullDataProfileEntity } from '../entities/profile.entity';
import { ProfilePresenter } from '../presenters/profile.presenter';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import { PersonalInformationView } from './PersonalInformationView';
import { MedicalInformationView } from './MedicalInformationView';
import { Skeleton } from 'moti/skeleton';
import { useProfile } from '../../../common/contexts/ProfileContext';

interface Props {
  presenter: ProfilePresenter;
}

export const ProfilePlaceholder = ({ presenter }: Props) => {
  const { user } = useAuth();
  const { profile, setProfile } = useProfile();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [personalInformationData, setPersonalInformationData] = useState<{ name: string; value: string }[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);
  const [medicalInformationData, setMedicalInformationData] = useState<{
    typeOfBlood: string;
    personalHistory: string;
    familyHistory: string;
    doctorId: number | null;
  }>({
    typeOfBlood: 'No Specified',
    personalHistory: 'No Specified',
    familyHistory: 'No Specified',
    doctorId: null,
  });

  const toggleBlur = () => {
    setIsBlurred(prev => !prev);
  };

  const profileViewInterface = {
    showLoading: () => setLoading(true),
    hideLoading: () => setLoading(false),
    showError: (message: string) => setError(message),
    showProfile: (profile: FullDataProfileEntity) => setProfile(profile),
  };

  useEffect(() => {
    if (user) {
      presenter.attachProfileView(profileViewInterface);
      presenter.loadProfile(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (profile) {
      const personalData = [
        { name: 'Name', value: profile.fullName },
        { name: 'Birthday', value: profile.birthday.split('T')[0] },
        { name: 'Gender', value: profile.gender },
      ];
      const medicalData = {
        typeOfBlood: profile.typeOfBlood || 'No Specified',
        personalHistory: profile.personalHistory || 'No Specified',
        familyHistory: profile.familyHistory || 'No Specified',
        doctorId: profile.doctorId || null,
      };

      setMedicalInformationData(medicalData);
      setPersonalInformationData(personalData);
    }
  }, [profile]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (user) {
        await presenter.loadProfile(user.id);
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
        {
          loading ? (
            <View style={styles.contentContainer}>
              <View style={styles.loadingImageBox}>
                <Skeleton height={120} width={120} radius="round" colorMode="light" />
              </View>
              <View style={{ height: 20, marginTop: 25 }}>
              </View>
            </View>
          ) : (
            <View style={styles.contentContainer}>
              <View style={styles.imageBox}>
                <Image source={{ uri: "https://www.pngplay.com/wp-content/uploads/11/Meowth-Pokemon-Transparent-File.png" }} resizeMode='cover' style={styles.image} />
              </View>
              <View>
                <Text style={styles.secondTitle}>{profile?.fullName}</Text>
              </View>
            </View>
          )
        }
        <View style={styles.secondContainer}>
          <Text style={styles.thirdTitle}>Personal Information</Text>
        </View>
        <PersonalInformationView data={personalInformationData} loading={loading} error={error} />
        <View style={styles.secondContainer}>
          <Text style={styles.thirdTitle}>Medical Information</Text>
          <TouchableOpacity onPress={toggleBlur}>
            <Feather name={isBlurred ? 'eye' : 'eye-off'} size={20} color="black" />
          </TouchableOpacity>
        </View>
        <MedicalInformationView data={medicalInformationData} loading={loading} error={error} isBlurred={isBlurred} />
        <View style={styles.secondContainer}>
          <Text style={styles.thirdTitle}>Personal Resume</Text>
          <View>
            <Text style={styles.aiTitle}>AI</Text>
          </View>
        </View>
        <View style={styles.secondContainer}>
          <Text style={styles.thirdTitle}>Prescriptions</Text>
          <View>
            <Text style={styles.aiTitle}>AI</Text>
          </View>
        </View>
      </ScrollView >
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
  },
  secondTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginTop: 10,
    marginBottom: 16,
  },
  thirdTitle: {
    color: '#4b5563',
    fontWeight: '600',
    marginBottom: 16,
  },
  aiTitle: {
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  imageBox: {
    width: 120,
    height: 120,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#d0c4fb',
    backgroundColor: '#F5F5FF',
  },
  loadingImageBox: {
    width: 120,
    height: 120,
    borderRadius: 100,
  },
});

export default ProfilePlaceholder;
