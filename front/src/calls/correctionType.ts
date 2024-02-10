export interface Correction {
    line : number,
    initialSentence : String,
    grammar : GrammarError[],
    spelling : SpellingError[],
}

export interface CorrectionSheet {
    id: String,
    recordsLine : Correction[]
}

export interface SpreadSheetIds {
    sheets: String[],
}

export interface CorrectionSpreadsheet {
    title : String,
    sheets: CorrectionSheet[]
}

export type GrammarError = {
    nStart : number,
    nEnd : number
    sRuleId : String,
    sType: String
    sMessage: String,
    aSuggestions: String[],
    URL : String,
}

export type SpellingError = {
    sType: String,
    sValue: String,
    nStart: number,
    nEnd: number,
}

export type Erreur = {
    status: number,
    messageErreur: String,
}

export const determineIsErrorOrNot = <T>(value: Erreur | T): value is Erreur => {
    return (value as Erreur).messageErreur && true
}