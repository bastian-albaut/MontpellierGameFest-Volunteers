export type isVolunteer = {
    idUser: string;
    idFestival: number;
    role?: Role;
    isVege?: boolean;
    sizeTeeShirt?: string;
    status?: Status;
}

export type Role = "administrator" | "receptionManager" | "referent";
export type Status = "notAccepted" | "accepted";