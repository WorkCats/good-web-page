import axios from "axios";
import { DOMAIN } from "./data";

const domain = DOMAIN + 'good/'

/**
 * 对应的货物信息
 */
export type Good = {
    id: string;
    name: string;
    size: number;
    user_name: string
}

/**
 * 获取 Good 列表
 * @param cookie 对应的 token
 * @returns Good 列表
 */
export const getGoodList = (cookie: string) => {
    return axios.post(domain + "getGoodList", {}, {
        headers: {
            Authorization: cookie
        }
    })
}

/**
 * 添加货物
 * @param cookie 对应的 token
 * @param good 需要添加的货物信息
 * @returns 是否成功
 */
export const addGood = (cookie: string, good: Good) => {

    return axios.post(domain + "addGood", {
        id: good.id,
        name: good.name,
        size: good.size,
        user_name: good.user_name
    }, {
        headers: {
            Authorization: cookie
        }
    })
}

/**
 * 删除货物
 * @param cookie 对应的 token
 * @param name 对应的 id
 * @returns 是否成功
 */
export const delGood = (cookie: string, name: String) => {

    return axios.post(domain + "delGood", {
        good_id: name
    }, {
        headers: {
            Authorization: cookie
        }
    })
}

/**
 * 查询
 * @param cookie 对应的 token
 * @param name 搜索的名字
 * @returns 对应结果
 */
export const searchGood = (cookie: string, name: String) => {

    return axios.post(domain + "searchGood", {
        good_name: name
    }, {
        headers: {
            Authorization: cookie
        }
    })
}

/**
 * 更新
 * @param cookie 对应的 token
 * @param good 更新对应的 good
 * @returns 对应结果
 */
export const updateGood = (cookie: string, good: Good) => {

    return axios.post(domain + "updateGood", {
        id: good.id,
        name: good.name,
        size: good.size,
        user_name: good.user_name
    }, {
        headers: {
            Authorization: cookie
        }
    })
}
