export interface Transaction {
  price: number;
  date: Date;
  store: string;
  category?: Category
//   category?: Accommodation | Fun | Vehicle | Food;
}

export interface TransactionsArray {
  creditCard?: number;
  month: number;
  trans: Transaction[];
}


export enum Category {
  // Vehicle
  VehicleMaintenance,
  Gas,
  PublicTransport,
  Insurance,
  Fee,
  // Food
  Food,
  // Fun
  Restaurant,
  Parties,
  Travel,
  Pubs,
  Misc,
  // Accommodation
  Rent,
  Bills,
  Furniture,
}

export const CategoryMap: {[id: string] : Category[]; } = {
  Vehicle: [
    Category.VehicleMaintenance,
    Category.Fee,
    Category.Gas,
    Category.PublicTransport,
    Category.Insurance,
  ],
  Food: [
    Category.Food
  ],
  Fun: [
    Category.Restaurant,
    Category.Parties,
    Category.Travel,
    Category.Pubs,
    Category.Misc,
  ],
  Accommodation: [
    Category.Rent,
    Category.Bills,
    Category.Furniture
  ],
};

export enum Vehicle {
  Maintenance,
  Gas,
  PublicTransport,
  Fee,
  Insurance,
}

export enum Food {}

export enum Fun {
  Restaurant,
  Parties,
  Travel,
  Pubs,
  Misc,
}

export enum Accommodation {
  Rent,
  Bills,
  Maintenance,
  Furniture,
}

// export interface Transaction {
//     price: number,
//     date: Date,
//     store: string,
//     category?: Accommodation | Fun | Vehicle | Food;
//   }

//   export enum Vehicle {
//     Maintenance,
//     Gas,
//     PublicTransport,
//     Fee,
//     Insurance
//   }

//   export enum Food {

//   }

//   export enum Fun {
//     Restaurant,
//     Parties,
//     Travel,
//     Pubs,
//     Misc,
//   }

//   export enum Accommodation {
//     Rent,
//     Bills,
//     Maintenance,
//     Furniture
//   }
