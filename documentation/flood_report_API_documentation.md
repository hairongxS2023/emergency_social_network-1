# ESN flood_report API Documentation

### Overview

The use case starts when the the user elect to share the flood scene when they are near the flood, the user can elect to either submit the road name/zipcode along with current time, user also has to take a picture to verify the authenticity of the incident. This piece of information is broadcasted at the public wall so other users may avoid dangerous situations.


# Endpoint

**POST** `flood_reports`

### Request Body

| Field          | Type    | Description                                                 |
|----------------|---------|-------------------------------------------------------------|
| `poster`       | string  | The poster of the flood report (username).                  |
| `location`     | string  | The location where the user located when posting.           |
| `image`        | String  | base64 String of a file                                     |
### Example Request Body

```
{
  "Poster": "Hakan",
  "content": "3355 Scott Blvd #110, Santa Clara, CA 95054, United States",
  "image":"data:imagepngbase64iVBORw0KGgoAAAANSUhEUgAAAyAAAAMgCAYAAADbcAZoAAAAGXRFWHRTb2Z0d2FyZQ...."
}
```
## Response

Success
* Status Code: 201 Created
The announcement is successfully created

Error
* Status Code: 400 Bad Request

* Status Code: 403 Forbidden
User does not have permission to submit a report

## Endpoint

**GET** `/flood_reports`


### Return value

``` json
{
    report_history: result{
        poster: String,
        image_source: {
            data: BinData(0, base64 string)
            contentType: String,
        },
        location: String,
        time: String,
        upvote: Number,
        downvote: Number
    }
}
```

## Response
Success
* Status Code: 200 Success
Successfully found the history report    

Error
* Status Code: 404 Not Found
The history announcement is not found


## Endpoint

**DELETE** `/flood_reports`

## Response
Success
* Status Code: 204 Accepted
Successfully deleted the report

Error
* Status Code: 404 Not Found
Cannot find the report by its id

* Status Code: 400 Bad Request

## Endpoint

**PATCH** `/flood_reports`
Update vote information

## Response
Success
* Status Code: 200 Resource Update successfully
Successfully update the report

Error
* Status Code: 404 Not Found
Cannot find the report by its id

* Status Code: 400 Bad Request

* Status Code: 409 Duplicated record

