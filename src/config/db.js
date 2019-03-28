const env = process.env.NODE_ENV //环境参数

//配置
let MYSQL_CONFIG;
let REDIS_CONFIG;

if(env === 'dev'){
    //Mysql
    MYSQL_CONFIG = {
        host: 'localhost',
        user:'root',
        password:'root',
        port:'3306',
        database:'bufan_student'
    }

    //redis
    REDIS_CONFIG = {
        port: 6379,
        host:'127.0.0.1'
    }
}

if(env === 'production'){
    //实际线上环境应该写线上的端口 用户名和密码
    MYSQL_CONFIG =  {
        host: 'localhost',
        user:'root',
        password:'root',
        port:'3306',
        database:'bufan_student'
    }

        //redis
    REDIS_CONFIG = {
        port: 6379,
        host:'127.0.0.1'
    }
}

module.exports = {
    MYSQL_CONFIG,
    REDIS_CONFIG
}