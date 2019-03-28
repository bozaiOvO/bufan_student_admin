const {exec} = require('../db/mysql')
const getList = (author,keyword,_class) => {
    let sql = `select * from students where 1=1 `
    if(author){
        sql += ` and author=${author}`
    }
    if(keyword){
        sql += ` and name like '%${keyword}%'`
    }
    if(_class){
        sql += ` and class like '%${_class}%'`
    }
    return exec(sql)
}

const addStudent = (data) => {
    const _class = data.class
    // const createtime = new Date(parseInt(Date.now())).toLocaleString().replace(/:\d{1,2}$/,' ')
    const createtime = Date.now()
    const {name , sex,  phone , city,dorm,discount,make,paymentRecord,author} = data  
    let sql = `insert into students(name, sex , class ,phone,city ,dorm ,discount,make,paymentRecord,author,createtime,updatetime)values('${name}','${sex}','${_class}','${phone}','${city}','${dorm}','${discount}','${make}','${paymentRecord}','${author}','${createtime}','${createtime}')`
    return exec(sql).then(insertData => {
        return {
            id :insertData.insertId
        }
    })
}

const updateStudent = (data) => {
    const id = data.id
    const _class = data.class
    // const createtime = new Date(parseInt(Date.now())).toLocaleString().replace(/:\d{1,2}$/,' ')
    const updatetime = Date.now()
    const {name , sex,  phone , city,dorm,discount,make,paymentRecord,author} = data  
    let sql = `update students set name='${name}' , sex='${sex}',class='${_class}',phone='${phone}',city='${city}',dorm='${dorm}',discount='${discount}',make='${make}',paymentRecord='${paymentRecord}',author='${author}',updatetime='${updatetime}' where id='${id}'`
    return exec(sql).then(updateData => {
        //这个玩意儿 大于0 就是成功了
        console.log(updateData)
        if(updateData.affectedRows>0){
            return true
        }
        return false 
    })
}

const delStudent = (data) => {
    const id = data.id 
    let sql = `delete from students where id='${id}'`
    return exec(sql).then(delData=>{
        //这个玩意儿 大于0 就是成功了
        if(delData.affectedRows>0){
            return true
        }
        return false 
    })
}

module.exports = {
    getList,
    addStudent,
    updateStudent,
    delStudent
}