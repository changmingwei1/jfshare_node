var zookeeper = require('node-zookeeper-client');
var logger = require('../util/log4node').configlog4node.servLog4js();
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
            logger.debug('Got watcher event: %s', event);
            listChildren();
        },
        function (error, children, stat) {
            if (error) {
                logger.debug(
                    'Failed to list children of %s due to: %s.',
                    public_client_path,
                    error
                );
                return;
            }

            logger.debug('Children of %s are: %j.', public_client_path, children);
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
            logger.debug('Got watcher event: %s', event);
            listChildren();
        },
        function (error, children, stat) {
            if (error) {
                logger.debug(
                    'Failed to list children of %s due to: %s.',
                    self_path,
                    error
                );
                return;
            }

            logger.debug('Children of %s are: %j.', self_path, children);
            children.forEach(function(key){
                getChildData(self_path, key);
            })
        }
    );
}

function getChildData(nodePath, key){
    logger.debug('key:%s.', key);
    client.getData(nodePath + '/' + key,
        function(event){
            logger.debug('Got event: %s.', event);
            getChildData(nodePath, event.path.split('/')[3]);
        },
        function(error, data, stat){
            if (error) {
                logger.debug(error.stack);
                return;
            }

            logger.debug('Got data: %s', data.toString('utf8'));
            zkMap[key] = data.toString('utf8');
        })
}

client.on('connected', function () {
    logger.debug('Connected to the server.');
    listChildren();
    console.info("zk ==>%s",JSON.stringify(zkMap));
});

client.on('disconnected', function(){
    logger.debug('disconnected to the server.');
    if(client !== undefined){
        client.close();
        client = undefined;
    }

    zkInit();
});

client.on('expired', function(){
    logger.debug('expired to the server.');
    if(client !== undefined){
        client.close();
        client = undefined;
    }

    zkInit();
});

client.on('authenticationFailed', function(){
    logger.debug('authenticationFailed to the server.');
    if(client !== undefined){
        client.close();
        client = undefined;
    }

    zkInit();
});

client.getACL(path, function (error, acls, stat) {
    if (error) {
        logger.debug(error.stack);
        return;
    }

    logger.debug('ACL(s) are: %j', acls);
});

module.exports.getData = function(key){
    return zkMap[key];
};

//module.exports = new ZkClient();