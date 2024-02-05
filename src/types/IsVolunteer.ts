export type isVolunteer = {
    idUser: string;
    idFestival: number;
    role?: Role;
    isVege?: boolean;
    sizeTeeShirt?: string;
    getTeeShirt?: boolean;
    status?: Status;
}

export type Role = "administrator" | "receptionManager" | "referent";
export type Status = "notAccepted" | "accepted";
