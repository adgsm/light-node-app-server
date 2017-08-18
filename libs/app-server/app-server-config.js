module.exports = {
	'connection_timeout' : 2 * 60 * 1000,
	'host' : '0.0.0.0',
	'port' : 3000,
	'secure_host' : '0.0.0.0',
	'secure_port' : 3001,
	'ca' : [ '/etc/ssl/certs/server-intermediate-CA-bundle.crt' ],
	'keyPath' : '/etc/ssl/certs/server.key',
	'certPath' : '/etc/ssl/certs/server.crt',
	'upload_dir' : '/tmp'
}
