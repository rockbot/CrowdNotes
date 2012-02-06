
var mongo = require('mongodb'),
    // primary1 = new mongo.Server('127.0.0.1', 27017, {auto_reconnect:true, poolSize:5}),
    // secondary1 = new mongo.Server('127.0.0.1', 27018, {auto_reconnect:true, poolSize:5}),
    // primary2 = new mongo.Server('127.0.0.1', 27017, {auto_reconnect:true, poolSize:5}),
    // secondary2 = new mongo.Server('127.0.0.1', 27018, {auto_reconnect:true, poolSize:5}),
    primary1 = new mongo.Server('127.0.0.1', 30000, {auto_reconnect:true, poolSize:5}),
    secondary1 = new mongo.Server('127.0.0.1', 30001, {auto_reconnect:true, poolSize:5}),
    primary2 = new mongo.Server('127.0.0.1', 30000, {auto_reconnect:true, poolSize:5}),
    secondary2 = new mongo.Server('127.0.0.1', 30001, {auto_reconnect:true, poolSize:5}),
    websiteRs = new mongo.ReplSetServers([primary1, secondary1], {
      rs_name:'replica-set-foo', 
      read_secondary:true,
      readPreference:mongo.Server.READ_SECONDARY_ONLY
    }),
    adserverRs = new mongo.ReplSetServers([primary2, secondary2], {
      rs_name:'replica-set-foo', 
      read_secondary:true,
      readPreference:mongo.Server.READ_SECONDARY_ONLY
    }),
    website = new mongo.Db('test', websiteRs),
    adserver = new mongo.Db('test', adserverRs),
  //website = new mongo.Db('simplereach_website_production', new mongo.Server('localhost', 27017, {auto_reconnect:true, poolSize:5})),
  //adserver = new mongo.Db('adserver', new mongo.Server('localhost', 27017, {auto_reconnect:true, poolSize:5})),
  accounts = [], accountsCollection, contentCollection, count = 0;

var numProcessed = 0;

website.on('error', function(err){
  console.log(err); process.exit(1);
});

adserver.on('error', function(err){
  console.log(err); process.exit(1);
});

/**
 * loads content for accounts in the array
 */
function loadContent(){
  var account = accounts.shift();
      fields = ['account_id','avg_ctr','cat','channels','ckw','ctr','published','topics','url', 'updated_at', 'disabled'],
      sort = [['published','desc']];
  var criteria = { "account_id":account };

  if(account === undefined){
    process.exit(1);
    // no more accounts to process
    // the return here goes into limbo
    return
  }
  console.log('GETTING CONTENT for', criteria);
  contentCollection.find(criteria, {}, function(err, cursor){
    cursor.each(function(err, doc) {      
      if(err){ console.log(err); process.exit(1); }
      if(doc === null){
        //once this account is done, load the next
        numProcessed++;
        console.log('FINISHED ACCOUNT', account, 'WITH', count, 'ITEMS, accounts processed so far:', numProcessed);

        count = 0;
        cursor.close();
        process.nextTick(function() {
          loadContent();
        })
      } else {
        count += 1;
      }
    });    
  });
}

/**
 * Loads account ids and pushes them onto an array
 **/
function loadAccounts(){
  accountsCollection.find({active:{$ne:false}}, { fields:{'_id':1}}, function(err, cursor) {
    if(err){ console.log(err); process.exit(1); }
    console.log('GETTING ACCOUNTS');

    cursor.each(function(err, doc){
      if(err){ console.log(err); process.exit(1); }
      if(doc !== null){
        accounts.push(doc._id);
      } else {
        console.log('FOUND', accounts.length, 'ACCOUNTS');
        loadContent();
        return;
      }
    });
  });
}

console.log('OPENING CONNECTION TO WEBSITE');
website.open(function(err, wsClient){
  if(err){console.log(err); process.exit(1); }
  console.log('OPENING CONNECTION TO ADSERVER');
  adserver.open(function(err, asClient){
    if(err){ console.log(err); process.exit(1); }

    // Get collections and remove the content
    accountsCollection = wsClient.collection('accounts');
    contentCollection = wsClient.collection('content');
    loadAccounts();
  });
});