const {SuccessModel , ErrorModel} = require('../model/resModel')
const studentFn = require('../controller/student')

// 统一的登陆验证函数
const loginCheck = (req) => {
    console.log('???')
    if(!req.session.username){
        console.log('能不能执行到i这里')
        return  Promise.resolve(
             new ErrorModel('登陆过期')
        )
    }
}
const handleListRouter = (req , res) => {
    const method = req.method
    const loginCheckResult = loginCheck(req)
    console.log('loginCheckResult',loginCheckResult)
    if(loginCheckResult){
        return loginCheck(req)
    }
    if(method === 'GET' && req.path === '/api/student/list'){
        const author = req.query.author|| ''
        const keyword = req.query.keyword || ''
        const _class = req.query._class || ''
        const result = studentFn.getList(author,keyword,_class)
        return result.then(listData => {
            return new SuccessModel(listData)
        })
        
    }
    if(method === 'POST' && req.path === '/api/student/new'){
        req.body.author = 'admin'
        const result = studentFn.addStudent(req.body)
        return result.then(succ => {
            console.log('succ',succ)
            if(succ.id>0){
                return new SuccessModel(succ)
            }
            return new ErrorModel('添加失败')
        })
    }
    if(method === 'POST' && req.path === '/api/student/update'){
        req.body.author = 'admin'
        const result = studentFn.updateStudent(req.body)
        return result.then(succ => {
            console.log('succ',succ)
            if(succ){
                return new SuccessModel(succ)
            }
            return new ErrorModel('更新失败')
        })
    }
    if(method === 'POST' && req.path === '/api/student/del'){
        req.body.author = 'admin'
        const result = studentFn.delStudent(req.body)
        return result.then(succ => {
            console.log('succ',succ)
            if(succ){
                return new SuccessModel(succ)
            }
            return new ErrorModel('删除失败')
        })
    }
}
module.exports = handleListRouter