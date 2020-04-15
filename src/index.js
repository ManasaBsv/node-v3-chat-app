const express= require('express')
const path= require('path')
const http= require('http')
const socketio= require('socket.io')
const Filter= require('bad-words')
const { generateMessage } = require('./utils/messages')
const { addUser, removeUser,getUser, getUsersinRoom} = require('./utils/users')

const port= process.env.PORT || 3000
const pdpath= path.join(__dirname,'../public')


const app=express()
const server=http.createServer(app)
const io=socketio(server)

app.use(express.static(pdpath))



io.on('connection',(socket)=>{
    
    const message='Welcome to our Application!'
     

     socket.on('join',({username,room}, callback)=>{

        const {error, user} = addUser({id: socket.id, username, room})

        if(error)
        {
            return callback(error)
        }
        
        socket.join(user.room)
        socket.emit('sendMsg',generateMessage('Admin',message))
        socket.broadcast.to(user.room).emit('sendMsg',generateMessage('Admin',`${user.username} has joined`))
        io.to(user.room).emit('roomData',{
            room: user.room,
            users: getUsersinRoom(user.room)
        })
        callback()

     })

     socket.on('mess1',(message,callback)=>{
         const user = getUser(socket.id)

         const filter=new Filter()

         if(filter.isProfane(message))
         {
             return callback('Profanity is not allowed')
         }
         io.to(user.room).emit('sendMsg',generateMessage(user.username,message))
         callback()
     })

     socket.on('send-loc',(location,callback)=>{

        const user = getUser(socket.id)

         var loc= `https://google.com/maps?q=${location.latitude},${location.longitude} `
         io.to(user.room).emit('show-loc',generateMessage(user.username,loc))
         callback()
     })

     socket.on('disconnect', ()=>{
         const user = removeUser(socket.id)

         if(user)
         {
            io.to(user.room).emit('sendMsg', generateMessage('Admin',` ${user.username} has left`))

            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersinRoom(user.room)
            })
         }
         
         
     })
    
})


server.listen(port,()=>{
    console.log('Server is running on port:',port)
})




