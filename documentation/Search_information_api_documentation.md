
# Search Information API Documentation
This API allows a Citizen to search for any information stored in the system.
## Use Case
The use case allows the Citizen to search for any information stored in the system by providing a search criteria.
## Associated Use Case
The associated use case for search information API is the ESN Directory selection menu.

## Dependent Use Cases
The dependent Use cases for this use case are ESNDirectory.

## Open Endpoints
The search information API provides an endpoint for the following:

[ListofCitizens]
-------------------------------------------------------
### Request

**Search Criteria:** 
Citizen provides an existing username (or part of a username)
Citizen provides a status-code (OK, Help, Emergency)

Searching by status:
Method: ```GET```
URL: ```/users/statuses/${status}```

Searching by username:
Method: ```GET```
URL: ```/users/${username}```


### Response
{ "results": " List of matching citizens status level}
-------------------------------------------------------

Search Results: 
System displays a list of all citizens matching the criterion, together with their current status. First matching citizens who are online are displayed, followed by matching citizens who are offline.
Within each group, citizens are displayed in alphabetical order using their usernames.
System displays a list of all citizens with this status. Citizens are displayed in alphabetical order, starting with all the citizens who are online, and followed by all the citizens who are offline.

[ListofPublicAnnouncements]
-------------------------------------------------------

**Search Criteria:** 
Citizen provides one or more words


### Request
{notificationMessage} is the string message to search for. 

URL: ```/receiver/notification?={notificationMessage}```
Method: ```GET```

### Response
{ "results": " returns List of matching announcements}


**Additional Detail:** 
System displays the 10 latest announcements including these words (together with sender name and timestamp). The user can ask to see more announcements by sets of 10. Announcements are displayed in reverse chronological order.
Note: If the search criteria include only stop words (see rule below), no results are displayed.


[ListofPublicMessages]
-------------------------------------------------------
**Search Criteria:** 
Citizen provides one or more words.


### Request
{publicMessage} is the string message to search for. 
Method: ```GET```
URL: ```/publicChatPage?publicMessage="hello```

example: 
http://localhost:5003/publicChatPage?publicMessage="hello"

With display count: 
http://localhost:5003/publicChatPage?publicMessage="test"&count=10

### Response
{ "results": " List of matching public messages}

**Additional Detail:** 
System displays the 10 latest public messages including these words (together with sender name, timestamp, and status at the time the message was sent). The user can ask to see more messages by sets of 10. Messages are displayed in reverse chronological order. Note: If the search criteria include only stop words (see rule below), no results are displayed.


[ListofPrivateMessages]
-------------------------------------------------------
**Search Criteria:**  
Citizen provides one or more words


### Request
{words} is the string message to search for. 

Private message search
Note: If the search criteria is a word the system displays the results which will be filtered for stop words before the search.
Method: ```GET``
URL: ```/privateChatPage?privateMessage="hello"```
`
http://localhost:5003/privateChatPage?privateMessage="a able testing"

with count limit parameter:
http://localhost:5003/privateChatPage?privateMessage="a able hello"&count=10


Getting the status:
Note: If the search criteria is the word “status”, the system displays the status histories of the citizens in the room with a default limit of 10. 

Method: ```GET``
URL: ```/privateChatPage?privateMessage="status"```
`
Example: 
http://localhost:5003/privateChatPage?privateMessage="status"



### Response
{
    "statusHistories": [
        {
            "status": "OK",
            "citizen": "user06",
            "timesent": "3/23/2023, 6:39:04 PM"
        },
        {
            "status": "undefined",
            "citizen": "user05",
            "timesent": "3/23/2023, 6:38:54 PM"
        },
        {
            "status": "OK",
            "citizen": "user06",
            "timesent": "3/23/2023, 6:38:45 PM"
        },
        {
            "status": "undefined",
            "citizen": "user05",
            "timesent": "3/23/2023, 6:38:00 PM"
        }
    ]
}


**Additional Detail:** 
System displays the 10 latest private messages including these words (together with sender name, timestamp, and status at the time the message was sent). The user can ask to see more messages by sets of 10. Messages are displayed in reverse chronological order. Note: If the search criteria is the word “status”, the system displays the status histories of the other Citizen involved in the discussion (10 latest status changes in reverse chronological order). Note: If the search criteria include only stop words (see rule below), no results are displayed.
-------------------------------------------------------

Additional Information:
**Stop-Word Rule**:
The system filters out stop words prior to the search. The stop words are: 
> a,able,about,across,after,all,almost,also,am,among,an,and,any,are,as,at,be,because,been,but,by,can,cannot,could,dear,did,do,does,either,else,ever,every,for,from,get,got,had,has,have,he,her,hers,him,his,how,however,i,if,in,into,is,it,its,just,least,let,like,likely,may,me,might,most,must,my,neither,no,nor,not,of,off,often,on,only,or,other,our,own,rather,said,say,says,she,should,since,so,some,than,that,the,their,them,then,there,these,they,this,tis,to,too,twas,us,wants,was,we,were,what,when,where,which,while,who,whom,why,will,with,would,yet,you,your


[Status Codes]
-------------------------------------------------------
The following status codes apply for all the above API endpoints. 

### Success Status Code
-   `200 OK`  Returns an array of search results matching the Citizen's search criteria. 
- The response body will be in json format.

### Fail Status Code
-   `404 Not Found`: If there are no matches for the Citizen's search criteria, the response will include an error message.






