import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/entity/navigationEntities";


export const SettingsRouter = {
  goToProfileSettings: (navigation: NavigationProp<RootStackParamList>) => {
    navigation.navigate('ProfileSettings');
  },
  goToNotificationSettings: (navigation: NavigationProp<RootStackParamList>) => {
    navigation.navigate('NotificationSettings');
  },
  goToPrivacySettings: (navigation: NavigationProp<RootStackParamList>) => {
    navigation.navigate('PrivacySettings');
  },
  goToQrCode: (navigation: NavigationProp<RootStackParamList>) => {
    navigation.navigate('QrCode');
  },
  goToLanguageSettings: (navigation: NavigationProp<RootStackParamList>) => {
    navigation.navigate('LanguageSettings');
  },
};