#To Do:

1. make a settings state, offer:
    - toggle web fetch for Schedule/News/etc.
2. Rewrite http.get data with toggle config in mind.


#Planned Features:
general info: provide general information about the conference.
News: News on website
Venue: address with a button to copy, and under it the map in google maps if available.
Floor map: interior map of the conference.
Schedule: Display schedule. Allow adding talks to user schedule, if conflicting time, offer replacement or cancellation.
My schedule: -remove item from own schedule.
             -display personal schedule.
Speaker list: list speakers.
Twitter: twitter feed for TXLF
About: about author.
Chatroom: irc channel, through ZNC? can it host a whole bunch of users?

contacts manager


#logistics

##app.js
states:
    geninfo
    news
    location
    indoorMap
    schedule
    myschedule
    speakersL
    speaker
    twitter
    chatroom
    about

##controller.js
    

##services.js


##directives.js
by views:


