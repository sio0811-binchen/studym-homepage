/**
 * Format phone number to Korean format (010-1234-5678)
 * @param value - Raw phone number string
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (value: string): string => {
    // Remove all non-numeric characters
    const numbers = value.replace(/[^0-9]/g, '');

    // Format based on length
    if (numbers.length <= 3) {
        return numbers;
    }

    if (numbers.length <= 7) {
        return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    }

    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
};

/**
 * Validate Korean phone number format
 * @param phoneNumber - Phone number to validate
 * @returns true if valid, false otherwise
 */
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    return phoneRegex.test(phoneNumber);
};
