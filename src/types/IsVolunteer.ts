export type isVolunteer = {
    idUser: string;
    idFestival: number;
    role?: Role;
    isVege?: boolean;
    sizeTeeShirt?: string;
    getTeeShirt?: boolean;
}

export type Role = "administrator" | "receptionManager" | "referent";