import axios from "axios";
import { DOMAIN } from "./Data";

const domain = DOMAIN + 'user/'

/**
 * 登陆对应所需信息
 */
type LoginUser = {
    username: string,
    password: string,
    autoLogin: boolean
}

/**
 * 用户登陆
 * @returns 用户登录结果
 * @param login
 */
export const login = (login: LoginUser) => {
    return axios.post(domain + "login", {
        username: login.username,
        password: login.password,
        auto_login: login.autoLogin
    })
}

/**
 * 获取是否是永久登录
 * @param cookie 对应的 token
 * @returns 是否是永久登录
 */
export const getAutoLogin = (cookie: string) => {
    return axios.post(domain + "autologin", {}, {
        headers: {
            Authorization: cookie
        }
    })
}

type User = {
    username: string,
    password: string,
    is_administrator: boolean
}
/**
 * 注册对应的账户
 * @param cookie 对应的 token
 * @param user 注册的用户
 * @returns 是否成功
 */
export const signup = (cookie: string, user: User) => {
    return axios.post(domain + "signup", {
        username: user.username,
        password: user.password,
        is_administrator: user.is_administrator
    }, {
        headers: {
            Authorization: cookie
        }
    })
}

/**
 * 删除对应的账户
 * @param cookie 对应的 token
 * @param user 需要删除的结果
 * @returns 是否成功
 */
export const delUser = (cookie: string, user: User) => {
    return axios.post(domain + "delUser", {
        username: user.username,
    }, {
        headers: {
            Authorization: cookie
        }
    })
}


/**
 * 搜索对应的用户
 * @param cookie 对应的 token
 * @param name 搜索的名字
 * @returns 结果
 */
export const searchUser = (cookie: string, name: string) => {
    return axios.post(domain + "searchUser", {
        username: name
    }, {
        headers: {
            Authorization: cookie
        }
    })
}

/**
 * 获取所有的用户包括密码
 * @param cookie 对应的 token
 * @returns 结果
 */
export const getUserList = (cookie: string) => {
    return axios.post(domain + "getUserList", {}, {
        headers: {
            Authorization: cookie
        }
    })
}

/**
 * 获取所有的用户名字
 * @param cookie 对应的 token
 * @returns 结果
 */
export const getUsernameList = (cookie: string) => {
    return axios.post(domain + "getUsernameList", {}, {
        headers: {
            Authorization: cookie
        }
    })
}


/**
 * 获取对应用户的所有货物
 * @param cookie 对应的 token
 * @param name 用户名字
 * @returns 结果
 */
export const getGoods = (cookie: string, name: string) => {
    return axios.post(domain + "getGoods", {
        username: name
    }, {
        headers: {
            Authorization: cookie
        }
    })
}

/**
 * 修改对应的账户
 * @param cookie 对应的 token
 * @param user 需要修改的用户
 * @returns 是否成功
 */
export const updateUser = (cookie: string, user: User) => {
    return axios.post(domain + "updateUser", {
        username: user.username,
        password: user.password,
        is_administrator: user.is_administrator
    }, {
        headers: {
            Authorization: cookie
        }
    })
}

export const isAdministrator = (cookie: string) => {
    return axios.post(domain + "isAdministrator", {}, {
        headers: {
            Authorization: cookie
        }
    })
}
