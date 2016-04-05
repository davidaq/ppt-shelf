
export default function(request) {
    var user = request.yar.get('login-user');
    if (!user) {
        throw {$redirect:'admin/login.page'};
    }
    return Promise.resolve(user);
}