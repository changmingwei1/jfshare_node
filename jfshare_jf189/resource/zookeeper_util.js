var zookeeper = require('node-zookeeper-client');

var zkMap = {};

var options = {
    sessionTimeout: 30000,
    spinDelay: 1000,
    retries: 3
};
//var url = '120.24.153.155:2181';
var url = '101.201.39.63';
var client = undefined;
//var path = process.argv[2];
var path = "/.ridge";

function ZkClient(){}

function zkInit() {
    if (client == undefined) {
        client = zookeeper.createClient(url, options);
        client.connect();
    }
}

zkInit();

// List and watch the children of given node:
function listChildren() {
    //get public_client_conf
    var public_client_path = path+'/jfx_public_client';
    client.getChildren(
        public_client_path,
        function (event) {
            console.log('Got watcher event: %s', event);
            listChildren();
        },
        function (error, children, stat) {
            if (error) {
                console.log(
                    'Failed to list children of %s due to: %s.',
                    public_client_path,
                    error
                );
                return;
            }

            console.log('Children of %s are: %j.', public_client_path, children);
            children.forEach(function(key){
                getChildData(public_client_path, key);
            })
        }
    );

    //get self_conf
    var self_path = path+'/jfx_node_jf189';
    client.getChildren(
        self_path,
        function (event) {
            console.log('Got watcher event: %s', event);
            listChildren();
        },
        function (error, children, stat) {
            if (error) {
                console.log(
                    'Failed to list children of %s due to: %s.',
                    self_path,
                    error
                );
                return;
            }

            console.log('Children of %s are: %j.', self_path, children);
            children.forEach(function(key){
                getChildData(self_path, key);
            })
        }
    );
}

function getChildData(nodePath, key){
    console.log('key:%s.', key);
    client.getData(nodePath + '/' + key,
        function(event){
            console.log('Got event: %s.', event);
            getChildData(nodePath, event.path.split('/')[3]);
        },
        function(error, data, stat){
            if (error) {
                console.log(error.stack);
                return;
            }

            console.log('Got data: %s', data.toString('utf8'));
            zkMap[key] = data.toString('utf8');
        })
}

client.on('connected', function () {
    console.log('Connected to the server.');
    listChildren();
    console.info("zk ==>%s",JSON.stringify(zkMap));
});

client.on('disconnected', function(){
    console.log('disconnected to the server.');
    if(client !== undefined){
        client.close();
        client = undefined;
    }

    zkInit();
});

client.on('expired', function(){
    console.log('expired to the server.');
    if(client !== undefined){
        client.close();
        client = undefined;
    }

    zkInit();
});

client.on('authenticationFailed', function(){
    console.log('authenticationFailed to the server.');
    if(client !== undefined){
        client.close();
        client = undefined;
    }

    zkInit();
});

client.getACL(path, function (error, acls, stat) {
    if (error) {
        console.log(error.stack);
        return;
    }

    console.log('ACL(s) are: %j', acls);
});

module.exports.getData = function(key){
    return zkMap[key];
};

//module.exports = new ZkClient();