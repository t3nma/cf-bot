import snekfetch from 'snekfetch';
import { API } from './constants';

/**
 * http://codeforces.com/api/help/methods#user.info
 * @param {array<string>} handles user handles
 */
export const get_user = async function(handles) {
    const params = handles.join(';');
    return await snekfetch.get(API.user + params);
};

/**
 * http://codeforces.com/api/help/methods#problemset.problems
 * @param {array<string>} tags problem tags
 */
export const get_problem = async function(tags) {
    const params = tags.join(';');
    return await snekfetch.get(API.problem + params);
};

/**
 * https://codeforces.com/api/help/methods#contest.list
 */
export const get_contest = async function() {
    return await snekfetch.get(API.contest);
};