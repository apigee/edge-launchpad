# HollaWorld solution

Purpose of this solution is to demo the usage of Edge-Launchpad. This solution consists of :
- 1 proxy (backend is httpbin.org)
- 1 kvm
- 1 product
- developer
- app

The solution tries to echo a "Hollaworld" msg to the user. The actual msg to be displayed is configured in the kvm.

### Installation 

#### Pre-requisites
+ node.js 
+ npm

#### Instructions

Install gulp 
```
npm install --global gulp-cli
```

Pull node modules
```
npm install
```

Run the deploy command
```
gulp deploy
```

### Demo

Make following API call, it should fail due to authorization

```http://org-env.apigee.net/v0/hello/get```

Now make the same call with right apikey obtained from the app that got created

```http://org-env.apigee.net/v0/hello/get?apikey=<api_key>```

You should see output like bellow :
```
{
  "args": {
    "apikey": "xxxx", 
    "welcome_msg": "holla !! welcome to the real world! It sucks but you will love it"
  }, 
  "headers": {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8", 
    "Accept-Encoding": "gzip, deflate", 
    "Accept-Language": "en-US,en;q=0.8", 
    "Connection": "close", 
    "Cookie": "_hp2_id.429197800=%7B%22userId%22%3A%221761631017327123%22%2C%22pageviewId%22%3A%224574434243034323%22%2C%22sessionId%22%3A%220140363516446449%22%2C%22identity%22%3Anull%2C%22trackerVersion%22%3A%223.0%22%7D; _ga=GA1.2.655510896.1483511480; _gauges_unique_day=1; _gauges_unique_month=1; _gauges_unique_year=1; _gauges_unique=1; _gauges_unique_hour=1", 
    "Host": "httpbin.org", 
    "Upgrade-Insecure-Requests": "1", 
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
  }, 
  "origin": "104.132.196.82, 104.154.179.1", 
  "url": "http://httpbin.org/get?apikey=xxxx&welcome_msg=holla !! welcome to the real world ! It sucks"
}
```

