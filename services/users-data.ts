export const USERS_API_URL = "https://dummyjson.com/users";
export const USERS_PAGE_SIZE = 30;
export const USERS_QUERY_KEY = ["users", "all"] as const;

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: "male" | "female";
  email: string;
  phone: string;
  username: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: {
    color: string;
    type: string;
  };
  address: {
    address: string;
    city: string;
    state: string;
    stateCode: string;
    postalCode: string;
    country: string;
  };
  university: string;
  company: {
    department: string;
    name: string;
    title: string;
  };
  role: string;
};

export type DepartmentSummary = {
  male: number;
  female: number;
  ageRange: string;
  hair: Record<string, number>;
  addressUser: Record<string, string>;
};

export type DepartmentData = {
  users: User[];
  summary: DepartmentSummary;
};

export type UsersPage = {
  users: User[];
  total: number;
  skip: number;
  limit: number;
};
