"use client";

import { Tables } from "@/types/supabase";
import { useParams } from "next/navigation";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
} from "react";

type TLocation = Partial<Tables<"business_locations">> &
  Partial<Tables<"business_location_profiles">>;

type TBusiness = Partial<Tables<"businesses">> &
  Partial<Tables<"business_profiles">>;

export interface User extends Tables<"profiles"> {
  businesses?: Tables<"businesses">[];
  business_profiles?: Tables<"business_profiles">[];
  locations?: Tables<"business_locations">[];
  location_profiles?: Tables<"business_location_profiles">[];
  location?: TLocation;
  locationAdmin?: boolean;
  business?: TBusiness;
}

const UserProviderContext = createContext<{
  user: User;
}>({
  user: {
    avatar_url: "",
    created_at: "",
    updated_at: "",
    full_name: "",
    id: "",
    username: "",
    address: "",
    address2: "",
    city: "",
    email: "",
    phone: "",
    state: "",
    postal_code: "",
    website: "",
    businesses: [],
    business_profiles: [],
    locations: [],
    location_profiles: [],
    location: {},
    locationAdmin: false,
    business: {},
  },
});

export function useUserContext() {
  const context = useContext(UserProviderContext);

  if (context === undefined)
    throw new Error("useUserContext must be used in UserContextProvider");

  return context;
}

type UserProviderContextProps = PropsWithChildren & {
  user: User;
};

export default function UserContextProvider({
  children,
  user,
}: UserProviderContextProps) {
  const { locationId, businessId } = useParams();

  const getSelectedLocationData = useCallback(() => {
    const { locations, location_profiles } = user;

    const selectedLocation = locations?.find(
      (location) => location.id === Number(locationId),
    );

    const selectedLocationProfile = location_profiles?.find(
      (locationProfile) => locationProfile.location_id === Number(locationId),
    );

    const foundLocationAndProfile =
      !!selectedLocation && !!selectedLocationProfile;

    return {
      ...(foundLocationAndProfile
        ? { ...selectedLocation, ...selectedLocationProfile }
        : {}),
    };
  }, [locationId, user]);

  const getSelectedBusinessData = useCallback(() => {
    const { business_profiles, businesses } = user;

    const selectedBusiness = businesses?.find(
      (business) => business.id === businessId,
    );

    const selectedBusinessProfile = business_profiles?.find(
      (profile) => profile.business_id === businessId,
    );

    const foundBusinessAndProfile =
      !!selectedBusiness && !!selectedBusinessProfile;

    return {
      ...(foundBusinessAndProfile
        ? { ...selectedBusiness, ...selectedBusinessProfile }
        : {}),
    };
  }, [businessId, user]);

  const value = useMemo(
    () => ({
      user: {
        ...user,
        ...(locationId
          ? {
              location: getSelectedLocationData(),
            }
          : {}),
        ...(businessId
          ? {
              business: getSelectedBusinessData(),
            }
          : {}),
      },
    }),
    [
      user,
      businessId,
      locationId,
      getSelectedLocationData,
      getSelectedBusinessData,
    ],
  );

  return (
    <UserProviderContext.Provider value={value}>
      {children}
    </UserProviderContext.Provider>
  );
}
