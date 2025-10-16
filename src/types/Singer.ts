export interface SingerTemplate {
    bodyImg: string;
    headImg: string;
    classes: string;
    alt: string;
}

export interface Singer {
    id: string;
    template: SingerTemplate;
    position: 'front' | 'back';
    isFlipped: boolean;
    isSinging: boolean;
}

export interface MusicalNote {
    id: string;
    symbol: string;
    x: number;
    y: number;
}