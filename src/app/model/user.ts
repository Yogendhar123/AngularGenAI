const TOKEN_NAME = 'access_token';
const LIST_VIEW_FLAG = 'LIST_VIEW_FLAG';
const BASIC_VIEW_FLAG = 'BASIC_VIEW_FLAG';

export function setToken(token: string) {
    localStorage.setItem(TOKEN_NAME, token);
}

export function getToken() {
    return localStorage.getItem(TOKEN_NAME);
}

export function setListViewFlag() {
    localStorage.setItem(LIST_VIEW_FLAG, '1');
}

export function unSetBasicViewFlag() {
    localStorage.setItem(BASIC_VIEW_FLAG, '0');
}

export function getBasicViewFlag() {
    return localStorage.getItem(BASIC_VIEW_FLAG);
}

export function setBasicViewFlag() {
    localStorage.setItem(BASIC_VIEW_FLAG, '1');
}

export function unSetListViewFlag() {
    localStorage.setItem(LIST_VIEW_FLAG, '0');
}

export function getListViewFlag() {
    return localStorage.getItem(LIST_VIEW_FLAG);
}

export function removeToken() {
    localStorage.removeItem(TOKEN_NAME);
}
