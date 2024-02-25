export interface CharacterDictionary {

    readonly definition: string,
    readonly pinyin: string[]
}

export interface GraphicDictionary {

    readonly strokes: string[]
}

export * from './hsk';