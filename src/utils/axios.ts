import axios, {AxiosError} from 'axios';
import {VueClass} from 'vue-class-component/lib/declarations';
import {HttpStatus} from '@/model/HttpStatus';

function get(url: string) {
    return new Promise(function(resolve, reject) {
        axios.get(url)
            .then(function(response) {
                console.log(response);
                resolve(response);
            })
            .catch(function(error) {
                console.log(error.response.status);
                if (error.response.status === 401) {
                    console.error('401 Unauthorized');
                    return;
                }
                reject(error);
            });
    });
}

export default {
    get,
};

export function convoy(target: VueClass<any>, name: string, descr: PropertyDescriptor) {
    const fn = descr.value;
    descr.value = function() {
        fn.call(target)
            .catch((error: AxiosError) => {
                const {status = HttpStatus.OK} = error.response  || {};
                if (status >= HttpStatus.SERVER_ERROR) {
                    console.error('Internal error!', error.response);
                } else if (status >= HttpStatus.CLIENT_REQUEST) {
                    console.error('Bad request!', error.response);
                }
            });
    };
    return descr;
}
