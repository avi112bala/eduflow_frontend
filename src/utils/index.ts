
interface ICurrencyFormat {
    amount: string
    currency: string
}
export const _getUser = () => {
    // const stringifiedUser = sessionStorage.getItem('agility_user');
    const stringifiedUser = localStorage.getItem('agility_user');
    if (stringifiedUser && stringifiedUser !== 'undefined') {
        const localUser: any = JSON.parse(stringifiedUser);
        return localUser;
    }
    return null;
};

export const _clearData = ({ pushToLogin = true }) => {
    if (pathName()) {
        localStorage.clear();
    }
    if (pushToLogin) {
        window.location.href = "/";
    }
    return false;
};

export const pathName = () => typeof window !== "undefined" && window;

export const _getToken = () => {
    // const token = pathName() && sessionStorage.getItem("agility_token");
    const token = pathName() && localStorage.getItem("agility_token");

    return token;
};

export const _isAnEmptyObject = (obj: any) => {
    for (const key in obj) {
        if (obj?.prototype?.hasOwnProperty?.call(key)) return false
        else return false
    }
    return true
}


export const _isAnEmptyObjectEcommerce = (obj: any) => {
    return obj && Object.keys(obj).length === 0;
};


export const _isUserLoggedIn = (): boolean => {
    const user = _getUser();
    const token = _getToken()
    if (!_isAnEmptyObject(user) && token !== undefined) {
        return true;
    }
    return false;
};


export const formatMoney = (amount: any, isDecimal = true) => {
    if (!amount) return null;

    const formatter = isDecimal
        ? new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
        : new Intl.NumberFormat('en-US', {});

    return formatter.format(amount);
};

// utils/phoneFormatter.js
export const formatPhoneNumber = (phoneNumber: any, countryCode = null) => {
    if (!phoneNumber || phoneNumber === '--') return '--';

    // Remove any non-digit characters except plus sign
    const cleaned = phoneNumber.replace(/[^\d+]/g, '');

    // If country code is provided separately, use it
    if (countryCode) {
        const numberWithoutCode = cleaned.replace(new RegExp(`^\\+?${countryCode}`), '');
        return `+${countryCode} ${formatNumberParts(numberWithoutCode)}`;
    }

    // Auto-detect country code if not provided
    if (cleaned.startsWith('+234')) {
        return `+234 ${formatNumberParts(cleaned.slice(4))}`;
    } else if (cleaned.startsWith('234')) {
        return `+234 ${formatNumberParts(cleaned.slice(3))}`;
    }

    // Default formatting for other numbers
    return cleaned;
};

const formatNumberParts = (number: any) => {
    // Format as XXX XXX XXXX for most numbers
    if (number.length === 10) {
        return `${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`;
    }
    return number; // Return as is if doesn't match expected format
};

export const formatWeight = (amount: any, isDecimal = true) => {
    if (!amount) return null;

    const formatter = isDecimal
        ? new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
        })
        : new Intl.NumberFormat('en-US', {});

    return formatter.format(amount);
};

export const formatCurrency = ({ amount, currency }: ICurrencyFormat) => {
    if (amount !== "") {
        const formattedNumber = new Intl.NumberFormat('en-US', {
            currency: currency,
            minimumFractionDigits: 2,
        }).format(parseInt(amount))
        return formattedNumber
    }

    else return null
}

export const formatNumber = (value: number) => {
    return new Intl.NumberFormat().format(value)
}

const debounce = <T extends (...args: any[]) => void>(fn: T) => {
    let frame: number;

    return (...params: Parameters<T>) => {
        if (frame) {
            cancelAnimationFrame(frame);
        }

        frame = requestAnimationFrame(() => {
            fn(...params);
        });
    };
};

export const storeScroll = () => {
    document.documentElement.dataset.scroll = window.scrollY.toString();
};

export function getRandomElement<T>(arr: Array<T>): T {
    return arr[Math.floor(Math.random() * arr.length)]
}

export const nairaSymbol = '\u20A6';

export const dollarSymbol = '\u0024';

export const cedisSymbol = '₵';

export const poundsSymbol = '£';

document.addEventListener('scroll', debounce(storeScroll), { passive: true });

storeScroll();

export const validateEmail = (email: string) => {
    const re =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

export const removeEmptyObjectKeys = (obj: object) => {
    return Object.fromEntries(
        Object.entries(obj).filter(([, value]) =>
            value !== ""
            && !(typeof value === "object" && value !== null && Object.keys(value).length === 0)
            && value !== undefined
        )
    );
};

export const isDateBeforeAugust = () => {
    const now = new Date();
    const deadline = new Date(2025, 6, 31, 23, 59, 59);

    return now <= deadline
}

export const ispromotionDateBeforeAugust = (date: any) => {
    const now = new Date();

    return now <= date
}

export function getAnniversaryDiscount(items: any[] = []): number {
    if (!isDateBeforeAugust() || !Array.isArray(items)) return 0;

    let total = 0;

    for (let index = 0; index < items.length; index++) {
        const item = items[index];
        const isHaulage =
            item.type === 'haulage' || item.ShipmentType === 4;

        const price = item.Price ?? 0;

        if (!isHaulage && price) {
            total += price;
        }
    }

    return total * 0.1;
}


export const validatePassword = (password: string = "") => {
    const errors: string[] = [];

    if (password.length < 8) errors.push("At least 8 characters");
    if (!/[a-z]/.test(password)) errors.push("At least one lowercase letter");
    if (!/[A-Z]/.test(password)) errors.push("At least one uppercase letter");
    if (!/\d/.test(password)) errors.push("At least one number");
    if (!/[^A-Za-z0-9]/.test(password)) errors.push("At least one special character");

    return {
        isValid: errors.length === 0,
        errors,
    };
};

export const stripHtml = (html: string): string => {
    if (!html) return "";
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent?.trim() || "";
};



