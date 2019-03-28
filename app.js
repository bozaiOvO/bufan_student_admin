//引入解析querystring的文件
const querystring = require('querystring')
//引入router
const handleUserRouter = require('./src/router/user')
const handleStudentRouter = require('./src/router/student')

const {set ,get } = require('./src/db/redis')

//获取cookie的过期时间 
const getCookieExpires = () => {
    let d = new Date()
    d.setTime(d.getTime() + (24*60*60*1000))
    return d.toGMTString()
}
//解析postData
const getPostData = (req) => {
    const promise = new Promise( (resolve , reject) => {
        if(req.method === 'GET') {
            return resolve({})
        }
        let postData = ''
        req.on('data' , chunk => {
            postData += chunk.toString()
        })
        req.on('end' , () => {
            if(!postData){
                resolve({})
            }
            if(req.headers['content-type']=='application/json'){
                console.log('json')
                resolve(JSON.parse(postData))
                return 
            }else if(req.headers['content-type']=='application/x-www-form-urlencoded'){
                console.log('....这份是form')
                 resolve(querystring.parse(postData.toString()))
                 return
            }else{
                return resolve({})
            }
        })
    }) 
    return promise 
}

const serverHandle =(req , res) =>{
    //设置返回JSON
    res.setHeader('Content-type','application/json')
    //设置允许跨域分享资源为true
    res.setHeader('Access-Control-Allow-Credentials',true)
    //拆分path
    const url = req.url 
    req.path = url.split('?')[0]
    //解析query
    req.query = querystring.parse(url.split('?')[1])
    

    //解析cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || ''
    cookieStr.split(';').forEach(item=>{
        if(!item){
            return
        }
        const arr = item.split('=')
        const key = arr[0].trim()
        const val = arr[1].trim()
        req.cookie[key] = val
    })

    //处理session
    let needSetCookie = false 
    let userId = req.cookie.userid 
    if(!userId){
        needSetCookie = true 
        userId = `${Date.now()}_${Math.random()}`
        //初始化session
        set(userId,{})
    }
    //获取session
    req.sessionId = userId 
    get(req.sessionId).then(sessionData => {
        if(sessionData===null){
            set(req.sessionId ,{})
            req.session = {}
        }else{
            req.session = sessionData
        }
        return getPostData(req)
    })
    .then(postData => {
        req.body = postData 
         //处理user
        const userResult = handleUserRouter(req , res)
        
        if(userResult){
            userResult.then(userData => {
                if(needSetCookie){
                    res.setHeader('Set-Cookie',`userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }
                 res.end(JSON.stringify(userData))
            })
            return
        }

        //处理student
        const studentResult = handleStudentRouter(req , res)
        if(studentResult){
            studentResult.then(data => {
                if(needSetCookie){
                    res.setHeader('Set-Cookie',`userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }
                 res.end(JSON.stringify(data))
            })
            return
        }

        //处理404
        res.writeHead(404,{"content-type":"text/plain"})
        res.write("404 not found")
        res.end() 
    })

   
}
module.exports = serverHandle