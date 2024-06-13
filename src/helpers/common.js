import { encryptStorage } from './encryptStorage'
import _logo from '../assets/logo.png'

export const logo = _logo

export const storage = {
    set: (key, value) => {
        if (typeof value === "object") {
            value = JSON.stringify(value);
        }
        encryptStorage.setItem(key, value);
    },
    get: (key, _default = null) => {
        var value = encryptStorage.getItem(key);
        if (value == undefined || value == null) {
            value = _default;
        }
        return value;
    },
    clear: () => {
        encryptStorage.clear();
    },
    getParsed: (key, _default = null) => {
        var value = encryptStorage.getItem(key);
        if (value == undefined || value == null) {
            value = _default;
        }
        return value;
    }
}

export const enums = {
    USER: "user",
    ROLE_ADMIN: "admin",

}

export const handlePasswordValidation = (password) => {
    if (password.trim() === '') {
        return 'Password cannot be empty.';
    } else if (password.length < 8) {
        return 'Password must be at least 8 characters long.';
    } else if (!/[a-z]/g.test(password) || !/[A-Z]/g.test(password) || !/[0-9]/g.test(password)) {
        return 'Password must contain lowercase, uppercase, and numeric characters.';
    }
    return null; // No errors
};

export const validateEmail = (email) => {
    if (!email) {
        return 'Email cannot be empty.';
    }

    // Basic check for @ and dot separators
    if (!email.includes('@') || !(email.includes('.') && email.lastIndexOf('.') < email.length - 1)) {
        return 'Invalid email format.';
    }

    // More complex validation using regular expression (optional)
    // const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // if (!re.test(email)) {
    //   return 'Invalid email format.';
    // }

    return null; // No errors
};


const getRandomLetters = (length = 1) => Array(length).fill().map(e => String.fromCharCode(Math.floor(Math.random() * 26) + 65)).join('');
const getRandomDigits = (length = 1) => Array(length).fill().map(e => Math.floor(Math.random() * 10)).join('');
export const generateUniqueID = (existingIDs) => {
    let id = getRandomLetters(2) + getRandomDigits(4);
    while (existingIDs.includes(id)) id = getRandomLetters(2) + getRandomDigits(4);
    return id;
};


export const isValue = (item) => {
    if (typeof item !== undefined && item) {
        return true
    }

    return false
}

export function isEqualSet(set1, set2) {
    if (set1.size !== set2.size) {
        return false;
    }
    for (const item of set1) {
        if (!set2.has(item)) {
            return false;
        }
    }
    return true;
}

export const isEmptyObject = (obj) => {
    return obj == null || Object.keys(obj).length === 0;
  };

