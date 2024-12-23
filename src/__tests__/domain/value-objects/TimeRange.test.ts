import { TimeRange } from '../../../domain/value-objects/TimeRange';
import { ValidationError } from '../../../domain/errors/ValidationError';

describe('TimeRange Value Object', () => {
    it('should create a valid time range', () => {
        const start = new Date();
        const end = new Date(start.getTime() + 3600000); // 1 hour later
        const timeRange = new TimeRange(start, end);

        expect(timeRange).toBeDefined();
        expect(timeRange.startTime).toEqual(start);
        expect(timeRange.endTime).toEqual(end);
    });

    it('should throw error when end time is before start time', () => {
        const start = new Date();
        const end = new Date(start.getTime() - 3600000); // 1 hour before

        expect(() => {
            new TimeRange(start, end);
        }).toThrow(ValidationError);
    });

    it('should throw error when start time is in the past', () => {
        const start = new Date(Date.now() - 3600000); // 1 hour ago
        const end = new Date(Date.now() + 3600000); // 1 hour from now

        expect(() => {
            new TimeRange(start, end);
        }).toThrow(ValidationError);
    });

    it('should correctly check for overlap', () => {
        const range1 = new TimeRange(
            new Date('2024-01-01T10:00:00'),
            new Date('2024-01-01T12:00:00')
        );

        const range2 = new TimeRange(
            new Date('2024-01-01T11:00:00'),
            new Date('2024-01-01T13:00:00')
        );

        const range3 = new TimeRange(
            new Date('2024-01-01T13:00:00'),
            new Date('2024-01-01T14:00:00')
        );

        expect(range1.overlaps(range2)).toBe(true);
        expect(range1.overlaps(range3)).toBe(false);
    });

    it('should calculate duration correctly', () => {
        const start = new Date('2024-01-01T10:00:00');
        const end = new Date('2024-01-01T12:00:00');
        const timeRange = new TimeRange(start, end);

        expect(timeRange.getDurationInHours()).toBe(2);
    });
}); 