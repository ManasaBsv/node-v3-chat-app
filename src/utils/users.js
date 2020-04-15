const users=[]

const addUser = ({id,username,room})=>{

    var username = username.trim().toLowerCase()
    var room= room.trim().toLowerCase()

    //validate data
    if(!username || !room)
    {
        return {
            error: 'Username and room are required'
        }
    }

    const existingUser = users.find((user) =>
    {
        return user.room=== room && user.username ===username
    })

    if(existingUser)
    {
        return {
            error: 'Username is in use! '
        }
    }

    const user = { id, username, room }
    users.push(user)

    return { user : user }   //notice , no error value ,as if control reaches here, there is no error.
  

}



const removeUser = (id) =>{

    const index = users.findIndex( (user ) => user.id === id)

    if(index!==-1)
    {
        return users.splice(index,1)[0]
    }
}

const getUser = (id)=>{

    const user = users.find((user)=>
    {
        return  user.id ===id
    })

    return user
}

const getUsersinRoom = (room)=>{
    room = room.trim().toLowerCase()
    const usersRoom = users.filter((user)=>{
        return user.room ===room
    })

    return usersRoom
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersinRoom
}