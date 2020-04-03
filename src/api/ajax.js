/*
 *  能发送ajax请求的函数模块
 *  函数的返回值是promise对象
 */
import axios from 'axios';
export default function ajax(url, data={}, type='GET', isPic = false) {
    if(type==='GET'){
        let paramStr = ''
        Object.keys(data).forEach(key => {
            paramStr += key + '=' + data[key] + '&'
        })
        if(paramStr) {
            paramStr = paramStr.substring(0, paramStr.length - 1)
            return axios.get(url + '?' + paramStr);
        }else{
            return axios.get(url)
        }

    }else if(type === 'POST') {
        let config = {
            headers:{'Content-Type':'multipart/form-data'}
        };
        return axios.post(url, data, isPic && config)
    }else if(type === 'PATCH') {
        try {
            return axios.patch(url, data)
        }catch (e) {
            console.log(e)
        }
    }else if(type === 'DELETE') {
        return axios.delete(url, data)
    }
}