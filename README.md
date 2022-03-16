# RpTide

## ENV File Example

```
* ADMIN_FUNCTIONALITY = < true/false >
* USER_FUNCTIONALITY = < true/false >
* PAYMENT_SYSTEM = < true/false >
* POST_FUNCTIONALITY = < true/false >
* COMMENT_FUNCTIONALITY = < true/false >

* *BASE_URL = https://www.< (PRODUCTION ONLY) Url of Site >

* PORT = < Chosen port here >

* MONGO_URI = < Mongo uri goes here >

* EMAIL_PASSWORD = < Email password >
* EMAIL = < Email to send verification >
* MAILER_URL = < Url for email >

* SECRET_KEY = < Your secret goes here >
```

## Server Status System
```
* "executed: false" --> Unexpected Error
* "status: false" --> Expected Error
``` 

## When Designing Server
* Routes check params if they are ascii ( ex. validator.isAscii(param) )
* Collection functions check params if they are specific type ( Ex. validator.isEmail(param) )


## TODO List For Deployment
* Set up base URL in ENV
* Set up secret in ENV
* Disable creating an admin account
* MongoDB password change
* Prepare mongoDB for more data
* Uncomment Expiration on tokens
* Stop user from deleting a comment
* Save unedited version of comment as well.
* Increase comment count on pages
* Increase Post Counts on Page
* Set encryption key for secrey key in env
* Create subscription products
	* Price objects for each will have 1 day trial (24 hour buffer) 

## FILL-DATA should be done in the "collections" file

## ROUTE STRUCTURE
/< CLASSIFICATION (leave empty for public): "user" or "admin" >/< ITEM  >/:item_related_property/< FUNCTION: (create, read, read-all.. etc) >/:tab/:sort/:limit/:page/:other

## TODO
* ADD SCHEDULE SYSTEM!