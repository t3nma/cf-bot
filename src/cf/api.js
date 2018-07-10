import snekfetch from 'snekfetch';
import { API } from './constants';

/**
 * http://codeforces.com/api/help/methods#user.info
 * @param {array<string>} user handles
 */
export const get_user_info = async function(handles) {
    const params = handles.join(';');
    return await snekfetch.get(API.user_info + params);
};