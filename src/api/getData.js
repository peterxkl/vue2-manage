import fetch from '@/config/fetch'

/**
 * 登陆
 */

export const login = data => fetch('/user/login', data, 'POST');

/**
 * 退出
 */

export const signout = () => fetch('/user/signout');

