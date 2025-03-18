"use client";

import { Tables } from "@/types/supabase";
import { createContext, PropsWithChildren, useContext, useMemo } from "react";

interface IBusinessProfile extends Partial<Tables<"business_profiles">> {
  profile: Partial<Tables<"profiles">>;
}

export interface IBusiness extends Partial<Tables<"businesses">> {
  integrations: Partial<Tables<"business_integrations">>[];
  locations: Partial<Tables<"business_locations">>[];
  products: Tables<"business_products">[];
  profiles: IBusinessProfile[];
}

type TBusinessProviderContext = {
  business: IBusiness;
  productsDictionary: {
    [k: number]: Tables<"business_products">;
  };
};

const initialContext = {
  business: {
    id: "biz",
    integrations: [],
    locations: [],
    products: [],
    profiles: [],
  },
  productsDictionary: {},
};

const BusinessProviderContext =
  createContext<TBusinessProviderContext>(initialContext);

export function useBusinessContext() {
  const context = useContext(BusinessProviderContext);

  if (context === undefined)
    throw new Error(
      "useBusinessContext must be used in BusinessContextProvider",
    );

  return context;
}

export function BusinessContextProvider({
  children,
  business,
}: PropsWithChildren<Pick<TBusinessProviderContext, "business">>) {
  const productsDictionary = business.products.reduce<{
    [k: number]: Tables<"business_products">;
  }>((dictionary, product) => {
    dictionary[product.id] = product;
    return dictionary;
  }, {});

  const value = useMemo(
    () => ({
      business: {
        ...business,
        integrations: business.integrations.filter(
          (integration) => integration.status === "active",
        ),
      },
      productsDictionary,
    }),
    [business, productsDictionary],
  );

  return (
    <BusinessProviderContext.Provider value={value}>
      {children}
    </BusinessProviderContext.Provider>
  );
}
