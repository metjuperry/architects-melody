export interface SingerTemplate {
    bodyImg: string;
    headImg: string;
    classes: string;
    alt: string;
    canSing?: boolean; // Optional property to control singing ability
}

export interface Singer {
    id: string;
    template: SingerTemplate;
    position: 'front' | 'back'; // Keep for now, will use for depth calculation
    isFlipped: boolean;
    isSinging: boolean;
    xPosition?: number; // X-axis position for dragging
    isSelected?: boolean; // Selection state for control panel
    zIndex?: number; // Z-index for front/back positioning
    yOffset?: number; // Y-axis offset to make singers appear taller when in back
}

export interface MusicalNote {
    id: string;
    symbol: string;
    x: number;
    y: number;
}