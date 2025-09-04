import { NavigationProp, RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
    ClientList: undefined;
    ClientForm: { clientId?: string };
    ClientDetail: { clientId: string };
};

export type RootStackNavigationProp = NavigationProp<RootStackParamList>;
export type RootStackRouteProp<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;