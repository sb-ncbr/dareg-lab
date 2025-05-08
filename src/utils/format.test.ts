import {capitalizeFirstLetters, formatTime, padLeft} from "./format.ts";


describe('Utility functions', () => {

    // Test padLeft function
    describe('padLeft', () => {
        it('should pad a number with leading zeros', () => {
            expect(padLeft(5, 2)).toBe('05');
            expect(padLeft(10, 2)).toBe('10');
            expect(padLeft(7, 3)).toBe('007');
        });
    });

    // Test formatTime function
    describe('formatTime', () => {
        it('should format the time with hours and minutes when showMinutes is true', () => {
            const date = new Date('2025-05-08T12:30:00');
            expect(formatTime(date, { showMinutes: true })).toBe('12:30');
        });

        it('should format the time with only hours when showMinutes is false', () => {
            const date = new Date('2025-05-08T12:30:00');
            expect(formatTime(date, { showMinutes: false })).toBe('12:00');
        });

        it('should handle single digit hours correctly', () => {
            const date = new Date('2025-05-08T09:00:00');
            expect(formatTime(date, { showMinutes: true })).toBe('9:00');
            expect(formatTime(date, { showMinutes: false })).toBe('9:00');
        });
    });

    // Test capitalizeFirstLetters function
    describe('capitalizeFirstLetters', () => {
        it('should capitalize the first letter of each word in a sentence', () => {
            expect(capitalizeFirstLetters('hello world')).toBe('Hello World');
            expect(capitalizeFirstLetters('this is a test')).toBe('This Is A Test');
            expect(capitalizeFirstLetters('capitalize first letters')).toBe('Capitalize First Letters');
        });

        it('should return an empty string when input is empty', () => {
            expect(capitalizeFirstLetters('')).toBe('');
        });

        it('should handle single word input correctly', () => {
            expect(capitalizeFirstLetters('hello')).toBe('Hello');
        });

        it('should handle input with multiple spaces between words', () => {
            expect(capitalizeFirstLetters('hello   world')).toBe('Hello   World');
        });
    });

});
