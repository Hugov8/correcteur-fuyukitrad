export type Erreur = {
    status: number,
    messageErreur: String,
}

export type StringOrNull = string | null

export const determineIsErrorOrNot = <T>(value: Erreur | T): value is Erreur => {
    return (value as Erreur).messageErreur && true
}
