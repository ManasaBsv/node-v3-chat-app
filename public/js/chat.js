const  socket=io()


const $messageForm= document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const messages= document.querySelector('#messages')

const messageTemplate= document.querySelector('#message-template').innerHTML
const locationTemplate= document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//options
const {username,room}= Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoscroll = ()=>{
    //New message element
    const $newMessage = messages.lastElementChild

    const $newMessageStyles= getComputedStyle($newMessage)
    const $newMessageMargin = parseInt($newMessageStyles.marginBottom)
    const $newMessageHeight = $newMessage.offsetHeight + $newMessageMargin

    //Visible height
    const visibleHeight = messages.offsetHeight

    //Height of messages container
    const containerHeight = messages.scrollHeight

    //How far scrolled
    const scrollOffset = messages.scrollTop + visibleHeight

    if((containerHeight - $newMessageHeight) <= scrollOffset )
    {
        messages.scrollTop = messages.scrollHeight
    }



}

socket.emit('join',{username, room}, (error)=>{
    if(error)
    {
        alert(error)
        location.href="/"
    }
})

socket.on('sendMsg', (message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate,{ 
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
     })

    messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('show-loc',(message)=>{
    console.log(message)

    const html = Mustache.render(locationTemplate,{
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
     })

    messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
    
})

socket.on('roomData',({room, users})=>{

    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })

    document.querySelector('#sidebar').innerHTML=html

})



document.querySelector('#message-form').addEventListener('submit', (event)=>{
    
    event.preventDefault()
    $messageFormButton.setAttribute('disabled','disabled')

    const message1= document.querySelector('input').value

    socket.emit('mess1',message1,(error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()
        if(error)
        {
            return console.log(error)
        }
        console.log('Message delivered')
    })

})

const sendLoc= document.querySelector('#send-loc')

document.querySelector('#send-loc').addEventListener('click', ()=>{
    
    sendLoc.setAttribute('disabled','disabled')
    if(!navigator.geolocation)
    {  
        return alert('Geolocation is not supported by your browser')
    }

    navigator.geolocation.getCurrentPosition((position)=>{
        
        var location={
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }
    
        socket.emit('send-loc',location,()=>{
            sendLoc.removeAttribute('disabled')
            console.log('Location Shared!')
        })
    })
})

// document.querySelector('#increement').addEventListener('click',()=>{
//     console.log('clicked')
//     socket.emit('increement')
// })