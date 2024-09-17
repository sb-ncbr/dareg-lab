export const formatTime = (date: Date, {showMinutes}: { showMinutes: boolean }): string => {
    return `${date.getHours()}:${padLeft(showMinutes ? date.getMinutes() : 0, 2)}`;
}

export const padLeft = (value: number, length: number): string => {
    return value.toString().padStart(length, '0');
}

export const capitalizeFirstLetters = (value: string): string => {
    return value.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}