export type User = {
    id: string;
    firstName: string;
    lastName: string;
    address: string;
    email: string;
    password: string;
    picture: string;
  };


export type registerUser = {
    firstName: string;
    lastName: string;
    address: string;
    email: string;
    password: string;
    file: string;
}