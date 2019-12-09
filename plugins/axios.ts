export default ({ $axios }) => {
    $axios.onRequest(config => {
        console.log('Making request to ' + config.url);
    });

    $axios.onError(err => {
        console.error(err);
    });

    $axios.onResponse(resp => {
        console.log(`Request: ${resp.config.url} has finished. Resonse Status: ${resp.status}`);
    });
};
