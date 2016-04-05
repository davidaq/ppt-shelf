import auth from './-auth';

export default function(props, children, widgets) {
    return auth(props.request).then(_ => {
        throw {$redirect:'admin/dashboard.page'};
    });
}