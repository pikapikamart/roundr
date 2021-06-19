const users = [];

const userJoin = (id, channel) =>{
    const user = {id, channel};
    users.push(user);
}


const findRoom = (id)=>{
    return users.find(user => user.id == id)
}

module.exports = {userJoin, findRoom};